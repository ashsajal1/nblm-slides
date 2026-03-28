import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import Seo from '../components/Seo';
import Particles from "@/components/custom-ui/particles";
import { FlashcardDeck, type DeckTopic, saveDeck, setActiveDeckId, getAllDecks } from "@/lib/db/indexedDB";
import { useDecks } from "@/hooks/useDecks";
import { useSlides } from "@/hooks/useSlides";
import { useKeyboardAndFileHandlers } from "@/hooks/useKeyboardAndFileHandlers";
import { useSelectedVoice } from "@/hooks/useSelectedVoice";
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
    const [playStep, setPlayStep] = useState<0 | 1 | 2 | 3>(0);
    const questionCallbackCalled = useRef(false);
    const answerCallbackCalled = useRef(false);
    const selectedVoice = useSelectedVoice();

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

    // Strip KaTeX syntax from text for speech and convert to speech-friendly format
    const stripMathSyntax = useCallback((text: string): string => {
        if (!text) return "";
        
        let result = text;

        // Remove block math delimiters: $$...$$ or \[...\]
        result = result.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
        result = result.replace(/\\\[([\s\S]*?)\\\]/g, "$1");
        
        // Remove inline math delimiters: $...$ or \(...\)
        result = result.replace(/\$([^$]+?)\$/g, "$1");
        result = result.replace(/\\\((.+?)\\\)/g, "$1");
        
        // Greek letters (lowercase)
        const greekLetters: Record<string, string> = {
            '\\alpha': 'alpha ', '\\beta': 'beta ', '\\gamma': 'gamma ',
            '\\delta': 'delta ', '\\epsilon': 'epsilon ', '\\varepsilon': 'epsilon ',
            '\\zeta': 'zeta ', '\\eta': 'eta ', '\\theta': 'theta ',
            '\\vartheta': 'theta ', '\\iota': 'iota ', '\\kappa': 'kappa ',
            '\\lambda': 'lambda ', '\\mu': 'mu ', '\\nu': 'nu ',
            '\\xi': 'xi ', '\\pi': 'pi ', '\\varpi': 'pi ',
            '\\rho': 'rho ', '\\varrho': 'rho ', '\\sigma': 'sigma ',
            '\\varsigma': 'sigma ', '\\tau': 'tau ', '\\upsilon': 'upsilon ',
            '\\phi': 'phi ', '\\varphi': 'phi ', '\\chi': 'chi ',
            '\\psi': 'psi ', '\\omega': 'omega ',
        };
        Object.entries(greekLetters).forEach(([latex, name]) => {
            result = result.replace(new RegExp(latex + '(?![a-zA-Z])', 'g'), ` ${name} `);
        });

        // Greek letters (uppercase)
        const greekLettersUppercase: Record<string, string> = {
            '\\Delta': 'Delta ', '\\Theta': 'Theta ', '\\Lambda': 'Lambda ',
            '\\Xi': 'Xi ', '\\Pi': 'Pi ', '\\Sigma': 'Sigma ',
            '\\Upsilon': 'Upsilon ', '\\Phi': 'Phi ', '\\Psi': 'Psi ',
            '\\Omega': 'Omega ', '\\Gamma': 'Gamma ',
        };
        Object.entries(greekLettersUppercase).forEach(([latex, name]) => {
            result = result.replace(new RegExp(latex + '(?![a-zA-Z])', 'g'), ` ${name} `);
        });

        // Operators and symbols - College/academic pronunciation style
        const symbols: Record<string, string> = {
            '+': ' plus ', '-': ' minus ', '=': ' equals ',
            '≠': ' not equal to ', '\\neq': ' not equal to ', '\\ne': ' not equal to ',
            '<': ' less than ', '>': ' greater than ',
            '≤': ' less than or equal to ', '\\leq': ' less than or equal to ',
            '≥': ' greater than or equal to ', '\\geq': ' greater than or equal to ',
            '×': ' into ', '\\times': ' into ',
            '÷': ' by ', '\\div': ' by ',
            '·': ' times ', '\\cdot': ' times ',
            '*': ' times ', '/': ' by ',
            '^': ' to the power of ',
            '\\sqrt': ' root of ', '√': ' root of ',
            '\\infty': ' infinity ', '∞': ' infinity ',
            '\\int': ' integral ', '\\oint': ' contour integral ',
            '\\sum': ' summation ', '\\prod': ' product ',
            '\\lim': ' limit ', '\\log': ' log ', '\\ln': ' ln ',
            '\\sin': ' sine ', '\\cos': ' cosine ', '\\tan': ' tan ',
            '\\csc': ' cosec ', '\\sec': ' sec ', '\\cot': ' cot ',
            '\\arcsin': ' inverse sine ', '\\arccos': ' inverse cosine ', '\\arctan': ' inverse tan ',
            '\\sinh': ' hyperbolic sine ', '\\cosh': ' hyperbolic cosine ', '\\tanh': ' hyperbolic tan ',
            '\\frac': ' ', '\\dfrac': ' ',
            '\\pm': ' plus minus ', '\\mp': ' minus plus ',
            '\\in': ' belongs to ', '\\ni': ' contains ',
            '\\notin': ' does not belong to ', '\\subset': ' subset of ',
            '\\supset': ' superset of ', '\\subseteq': ' subset of or equal to ',
            '\\supseteq': ' superset of or equal to ',
            '\\cup': ' union ', '\\cap': ' intersection ',
            '\\emptyset': ' empty set ', '∅': ' empty set ',
            '\\forall': ' for all ', '\\exists': ' there exists ',
            '\\nexists': ' there does not exist ',
            '\\therefore': ' therefore ', '\\because': ' because ',
            '\\prime': ' prime ', '\\degree': ' degree ', '^\\circ': ' degree ',
            '\\angle': ' angle ', '\\triangle': ' triangle ',
            '\\cong': ' congruent to ', '\\simeq': ' similar to ', '\\sim': ' similar to ',
            '\\approx': ' approximately equal to ', '≈': ' approximately equal to ',
            '\\equiv': ' equivalent to ', '≡': ' equivalent to ',
            '\\perp': ' perpendicular to ', '⊥': ' perpendicular to ',
            '\\parallel': ' parallel to ', '∥': ' parallel to ',
            '\\neg': ' not ', '\\land': ' and ', '\\lor': ' or ',
            '\\implies': ' implies ', '\\Rightarrow': ' implies ',
            '\\rightarrow': ' tends to ', '\\to': ' tends to ', '→': ' tends to ',
            '\\mapsto': ' maps to ', '\\leftarrow': ' left arrow ',
            '\\hat': ' hat ', '\\vec': ' vector ', '\\bar': ' bar ',
            '\\dot': ' dot ', '\\ddot': ' double dot ',
            '\\textbf': '', '\\textit': '', '\\mathrm': '', '\\mathbf': '',
            '\\mathit': '', '\\mathcal': '', '\\mathbb': '', '\\mathfrak': '',
            '\\text': '', '\\partial': ' partial ', '\\nabla': ' del ',
            '\\hbar': ' h bar ', '\\ell': ' ell ',
            '\\Re': ' real part ', '\\Im': ' imaginary part ',
            '\\aleph': ' aleph ',
            '(': ' ', ')': ' ', '[': ' ', ']': ' ',
            '\\left': '', '\\right': '',
        };
        Object.entries(symbols).forEach(([latex, speech]) => {
            result = result.replace(new RegExp(latex.replace(/[{}[\]\\^$|?*+()]/g, '\\$&'), 'g'), speech);
        });

        // Handle fractions: \frac{a}{b} - reads as "a by b" in college style
        result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 by $2");
        result = result.replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, "$1 by $2");

        // Handle subscripts: x_{n} or x_n
        result = result.replace(/_?\{?([a-zA-Z0-9]+)\}?_\{?([a-zA-Z0-9]+)\}?/g, "$1 subscript $2");

        // Handle superscripts: x^{n} or x^n - college style: "x squared", "x cube", "x to the power n"
        result = result.replace(/\{?([a-zA-Z0-9]+)\}?(\^|\*\*)\{?([a-zA-Z0-9]+)\}?/g, (_, base, __, sup) => {
            if (sup === '2') return `${base} squared`;
            if (sup === '3') return `${base} cube`;
            return `${base} to the power ${sup}`;
        });

        // Remove remaining backslashes and braces
        result = result.replace(/\\/g, ' ');
        result = result.replace(/[{}]/g, '');

        // Clean up extra whitespace
        return result.replace(/\s+/g, ' ').trim();
    }, []);

    // Speak text using speech synthesis
    const speak = useCallback((text: string, onEnd?: () => void) => {
        if (!text || !("speechSynthesis" in window)) {
            // If speech not available, call onEnd immediately
            if (onEnd) onEnd();
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const cleanText = stripMathSyntax(text);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            if (onEnd) onEnd();
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
    }, [stripMathSyntax, selectedVoice]);

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

    // Reset to first slide
    const resetToStart = useCallback(() => {
        setAutoSpeak(false);
        stopSpeaking();
        setCurrent(0);
        setShowAnswer(false);
        setPlayStep(0);
    }, [stopSpeaking, setCurrent, setShowAnswer]);

    // Auto-speak and auto-advance logic
    useEffect(() => {
        if (!autoSpeak || slides.length === 0 || !slides[current]) return;

        let timeoutId: NodeJS.Timeout;
        let fallbackTimeoutId: NodeJS.Timeout;
        const currentSlide = slides[current];

        // Step 0: Speak question
        if (playStep === 0 && !showAnswer && !isSpeaking && currentSlide?.question) {
            questionCallbackCalled.current = false;
            speak(currentSlide.question, () => {
                if (!questionCallbackCalled.current) {
                    questionCallbackCalled.current = true;
                    setPlayStep(1);
                }
            });
            // Fallback timeout in case speech callback doesn't fire
            fallbackTimeoutId = setTimeout(() => {
                if (!questionCallbackCalled.current) {
                    questionCallbackCalled.current = true;
                    setPlayStep(1);
                }
            }, 5000);
        }
        // Step 1: Show answer
        else if (playStep === 1 && !showAnswer) {
            setShowAnswer(true);
            setPlayStep(2);
        }
        // Step 2: Speak answer
        else if (playStep === 2 && showAnswer && !isSpeaking && currentSlide?.answer) {
            answerCallbackCalled.current = false;
            speak(currentSlide.answer, () => {
                if (!answerCallbackCalled.current) {
                    answerCallbackCalled.current = true;
                    setPlayStep(3);
                }
            });
            // Fallback timeout in case speech callback doesn't fire
            fallbackTimeoutId = setTimeout(() => {
                if (!answerCallbackCalled.current) {
                    answerCallbackCalled.current = true;
                    setPlayStep(3);
                }
            }, 5000);
        }
        // Step 3: Advance to next slide
        else if (playStep === 3 && showAnswer) {
            timeoutId = setTimeout(() => {
                setCurrent((prev) => {
                    const next = prev + 1;
                    if (next >= slides.length) {
                        setAutoSpeak(false);
                        return 0;
                    }
                    return next;
                });
                setShowAnswer(false);
                setPlayStep(0);
                // Reset callback flags for next card
                questionCallbackCalled.current = false;
                answerCallbackCalled.current = false;
            }, 800);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
        };
    }, [autoSpeak, current, slides.length, showAnswer, playStep, isSpeaking, setCurrent, setShowAnswer, speak, slides]);

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
                            <>
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
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={resetToStart}
                                    className="h-10 w-10 rounded-full"
                                    title={t("home.resetToStart")}
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                    </div>

                    {autoSpeak && slides.length > 0 && (
                        <div className="flex justify-center mb-4">
                            <p className="text-sm text-muted-foreground">
                                {t("home.autoSwipeMode")}
                            </p>
                        </div>
                    )}

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
