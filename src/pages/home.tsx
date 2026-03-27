import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Volume2, VolumeX } from "lucide-react";
import Seo from '../components/Seo';
import Particles from "@/components/custom-ui/particles";
import { FlashcardDeck, type DeckTopic, saveDeck, setActiveDeckId, getAllDecks } from "@/lib/db/indexedDB";
import { useDecks } from "@/hooks/useDecks";
import { useSlides } from "@/hooks/useSlides";
import { useKeyboardAndFileHandlers } from "@/hooks/useKeyboardAndFileHandlers";
import { parseCSV, type ParsedCSV } from "@/lib/csv-parser";
import { Header } from "@/components/partials/Header";
import { DeckTabs } from "@/components/partials/DeckTabs";
import { UploadButton } from "@/components/partials/UploadButton";
import { UploadError } from "@/components/partials/UploadError";
import { ProgressBar } from "@/components/partials/ProgressBar";
import { SwipeableFlashCard } from "@/components/partials/SwipeableFlashCard";
import { SlideNavigator } from "@/components/partials/SlideNavigator";
import { EmptyState } from "@/components/partials/EmptyState";
import { DeckSetupDialog } from "@/components/partials/DeckSetupDialog";
import { DeleteConfirmationDialog } from "@/components/partials/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { t } = useTranslation();
    const {
        decks,
        activeDeckId,
        topics,
        loading,
        handleSaveDeck,
        handleDeleteDeck,
        handleSetActive: handleSetActiveDeck,
        setActiveId,
        setDecks,
    } = useDecks();

    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showSetupDialog, setShowSetupDialog] = useState(false);
    const [pendingDeck, setPendingDeck] = useState<ParsedCSV | null>(null);
    const [setupTitle, setSetupTitle] = useState("");
    const [setupTopic, setSetupTopic] = useState<DeckTopic>("study");
    const [deckToDelete, setDeckToDelete] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(false);

    const activeDeck = decks.find((d) => d.id === activeDeckId) ?? null;
    const slides = Array.isArray(activeDeck?.slides) ? activeDeck.slides : [];

    const {
        current,
        showAnswer,
        swipeDirection,
        setCurrent,
        setShowAnswer,
        setSwipeDirection,
        paginate,
        paginateVertical,
        reset,
    } = useSlides(slides.length);

    // Strip KaTeX syntax from text for speech
    const stripMathSyntax = useCallback((text: string): string => {
        if (!text) return "";
        return text
            .replace(/\$\$(.+?)\$\$/g, "$1")
            .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
            .replace(/\$(.+?)\$/g, "$1")
            .replace(/\\\((.+?)\\\)/g, "$1")
            .replace(/\\frac{([^}]+)}{([^}]+)}/g, "$1 divided by $2")
            .replace(/\\sqrt{([^}]+)}/g, "square root of $1")
            .replace(/\^/g, " to the power of ");
    }, []);

    // Speak text using speech synthesis
    const speak = useCallback((text: string) => {
        if (!text || !("speechSynthesis" in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const cleanText = stripMathSyntax(text);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [stripMathSyntax]);

    // Stop speaking
    const stopSpeaking = useCallback(() => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    // Toggle auto-speak
    const toggleAutoSpeak = useCallback(() => {
        setAutoSpeak((prev) => {
            const newValue = !prev;
            if (!newValue) {
                stopSpeaking();
            }
            return newValue;
        });
    }, [stopSpeaking]);

    // Auto-speak when answer is shown
    useEffect(() => {
        if (autoSpeak && showAnswer && slides[current]) {
            speak(slides[current].answer);
        }
    }, [autoSpeak, showAnswer, current, slides, speak]);

    // Auto-speak question when slide changes
    useEffect(() => {
        if (autoSpeak && slides[current]) {
            speak(slides[current].question);
        }
    }, [autoSpeak, current, slides, speak]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleFileUpload = useCallback(
        (file: File) => {
            setUploadError(null);

            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const result = parseCSV(text, file.name);

                if (!result || result.slides.length === 0) {
                    setUploadError(t("home.invalidCsv"));
                    return;
                }

                setSetupTitle(result.name);
                setSetupTopic("study");
                setPendingDeck(result);
                setShowSetupDialog(true);
            };
            reader.readAsText(file);
        },
        [t]
    );

    const handleMultipleFileUpload = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const csvFiles: File[] = [];
            for (let i = 0; i < files.length; i++) {
                if (files[i].name.endsWith(".csv")) {
                    csvFiles.push(files[i]);
                }
            }

            if (csvFiles.length === 0) {
                setUploadError(t("home.invalidFile"));
                return;
            }

            if (csvFiles.length === 1) {
                handleFileUpload(csvFiles[0]);
                return;
            }

            const newDecks: FlashcardDeck[] = [];

            for (const file of csvFiles) {
                const text = await file.text();
                const result = parseCSV(text, file.name);
                if (result && result.slides.length > 0) {
                    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                    const deck: FlashcardDeck = {
                        id,
                        name: result.name,
                        title: result.name,
                        topic: "study" as DeckTopic,
                        slides: result.slides,
                        createdAt: Date.now(),
                    };
                    newDecks.push(deck);
                }
            }

            if (newDecks.length > 0) {
                for (const deck of newDecks) {
                    await saveDeck(deck);
                }
                const allDecks = await getAllDecks();
                setDecks(allDecks);
                if (newDecks.length > 0) {
                    await setActiveDeckId(newDecks[0].id);
                    setActiveId(newDecks[0].id);
                }
                reset();
            }
        },
        [handleFileUpload, t, setDecks, setActiveId, reset]
    );

    const confirmDeck = useCallback(async () => {
        if (!pendingDeck || !setupTitle.trim()) return;

        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const deck: FlashcardDeck = {
            id,
            name: pendingDeck.name,
            title: setupTitle.trim(),
            topic: setupTopic,
            slides: pendingDeck.slides,
            createdAt: Date.now(),
        };

        await handleSaveDeck(deck);
        reset();
        setShowSetupDialog(false);
        setPendingDeck(null);
    }, [pendingDeck, setupTitle, setupTopic, handleSaveDeck, reset]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    if (files[i].name.endsWith(".csv")) {
                        handleFileUpload(files[i]);
                        break;
                    }
                }
            } else {
                setUploadError(t("home.invalidFile"));
            }
        },
        [handleFileUpload, t]
    );

    const handleDeleteConfirm = useCallback(() => {
        if (deckToDelete) {
            handleDeleteDeck(deckToDelete);
            setDeckToDelete(null);
            reset();
        }
    }, [deckToDelete, handleDeleteDeck, reset]);

    const handleSetActive = useCallback(
        async (id: string) => {
            await handleSetActiveDeck(id);
            setActiveId(id);
            reset();
        },
        [handleSetActiveDeck, setActiveId, reset]
    );

    useKeyboardAndFileHandlers({
        onFileUpload: handleFileUpload,
        onPaginate: paginate,
        onToggleAnswer: () => setShowAnswer((s) => !s),
    });

    useEffect(() => {
        setShowAnswer(false);
    }, [current, activeDeckId]);

    useEffect(() => {
        reset();
    }, [activeDeckId, reset]);

    if (loading) return null;

    return (
        <>
            <Seo
                title={t("home.title")}
                description={t("home.subtitle")}
            />

            <section
                className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <div className="absolute inset-0">
                    <Particles />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
                    <Header
                        activeDeck={activeDeck}
                        currentSlide={current}
                        totalSlides={slides.length}
                    />

                    {decks.length > 0 && (
                        <DeckTabs
                            decks={decks}
                            activeDeckId={activeDeckId}
                            onSetActive={handleSetActive}
                            onDelete={setDeckToDelete}
                        />
                    )}

                    <div className="flex justify-center mb-6 gap-4">
                        <UploadButton onFilesSelected={handleMultipleFileUpload} />
                        {slides.length > 0 && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleAutoSpeak}
                                className={`h-10 w-10 rounded-full ${autoSpeak ? "bg-primary text-primary-foreground" : ""}`}
                                title={autoSpeak ? t("home.disableAutoSpeak") : t("home.enableAutoSpeak")}
                            >
                                {isSpeaking ? (
                                    <Volume2 className="h-5 w-5 animate-pulse" />
                                ) : autoSpeak ? (
                                    <Volume2 className="h-5 w-5" />
                                ) : (
                                    <VolumeX className="h-5 w-5" />
                                )}
                            </Button>
                        )}
                    </div>

                    <AnimatePresence>
                        {uploadError && (
                            <UploadError
                                error={uploadError}
                                onDismiss={() => setUploadError(null)}
                            />
                        )}
                    </AnimatePresence>

                    {slides.length > 0 ? (
                        <>
                            <ProgressBar current={current} total={slides.length} />

                            <div className="relative w-full h-[340px]">
                                <AnimatePresence
                                    initial={false}
                                    custom={swipeDirection}
                                    mode="wait"
                                >
                                    <SwipeableFlashCard
                                        key={`${activeDeckId}-${current}`}
                                        question={slides[current]?.question}
                                        answer={slides[current]?.answer}
                                        showAnswer={showAnswer}
                                        onFlip={() => setShowAnswer(!showAnswer)}
                                        swipeDirection={swipeDirection}
                                        onSwipeComplete={paginateVertical}
                                    />
                                </AnimatePresence>
                            </div>

                            <SlideNavigator
                                current={current}
                                total={slides.length}
                                onPaginate={paginate}
                                onJumpTo={(index) => {
                                    setSwipeDirection(index > current ? 1 : -1);
                                    setCurrent(index);
                                }}
                                onDirectionChange={setSwipeDirection}
                            />

                            <p className="text-center text-sm text-muted-foreground mt-4">
                                {t("home.keyboardHint")}
                            </p>
                        </>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </section>

            <DeckSetupDialog
                open={showSetupDialog}
                onOpenChange={setShowSetupDialog}
                title={setupTitle}
                onTitleChange={setSetupTitle}
                topic={setupTopic}
                onTopicChange={setSetupTopic}
                topics={topics}
                onSave={confirmDeck}
                onCancel={() => {
                    setShowSetupDialog(false);
                    setPendingDeck(null);
                }}
            />

            <DeleteConfirmationDialog
                open={deckToDelete !== null}
                onOpenChange={(o) => !o && setDeckToDelete(null)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
