import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Seo from '../components/Seo';
import Particles from "@/components/custom-ui/particles";
import {
    getAllDecks,
    getAllTopics,
    saveDeck,
    deleteDeck as dbDeleteDeck,
    getActiveDeckId,
    setActiveDeckId,
    DEFAULT_TOPICS,
    type FlashcardDeck,
    type DeckTopic,
    type Topic,
} from "@/lib/db/indexedDB";
import {
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Lightbulb,
    Upload,
    Trash2,
    X,
    AlertCircle,
    FolderOpen,
} from "lucide-react";

const swipeVariants = {
    enter: (direction: number) => ({
        y: direction > 0 ? 400 : -400,
        opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (direction: number) => ({
        y: direction < 0 ? 400 : -400,
        opacity: 0,
    }),
};

function parseCSV(
    text: string,
    filename: string
): { slides: { question: string; answer: string }[]; name: string } | null {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return null;

    const header = lines[0];
    if (
        !header.includes("问题") &&
        !header.includes("প্রশ্ন") &&
        !header.includes("Question")
    )
        return null;

    const slides: { question: string; answer: string }[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const match = line.match(/^"(.*?)","(.*)"$/s);
        if (!match) continue;

        const question = match[1].replace(/^\uFEFF/, "").trim();
        const answer = match[2].replace(/^\uFEFF/, "").trim();

        if (question && answer) {
            slides.push({ question, answer });
        }
    }

    if (slides.length === 0) return null;

    const name = filename
        .replace(/\.csv$/i, "")
        .replace(/_/g, " ")
        .trim();

    return { slides, name };
}

export default function Home() {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [activeDeckId, setActiveId] = useState<string | null>(null);
    const [current, setCurrent] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [showSetupDialog, setShowSetupDialog] = useState(false);
    const [pendingDeck, setPendingDeck] = useState<{
        name: string;
        slides: { question: string; answer: string }[];
    } | null>(null);
    const [setupTitle, setSetupTitle] = useState("");
    const [setupTopic, setSetupTopic] = useState<DeckTopic>("study");
    const [topics, setTopics] = useState<Topic[]>(DEFAULT_TOPICS);
    const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [allDecks, activeId, allTopics] = await Promise.all([
                    getAllDecks(),
                    getActiveDeckId(),
                    getAllTopics(),
                ]);
                setDecks(allDecks);
                setActiveId(activeId);
                setTopics(allTopics);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const activeDeck = decks.find((d) => d.id === activeDeckId) ?? null;
    const slides = Array.isArray(activeDeck?.slides) ? activeDeck.slides : [];

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
                setCurrent(0);
                setShowAnswer(false);
            }
        },
        [handleFileUpload, t]
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

        await saveDeck(deck);
        await setActiveDeckId(id);

        const allDecks = await getAllDecks();
        setDecks(allDecks);
        setActiveId(id);
        setCurrent(0);
        setShowAnswer(false);
        setShowSetupDialog(false);
        setPendingDeck(null);
    }, [pendingDeck, setupTitle, setupTopic]);

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

    const handleDeleteDeck = useCallback(
        async (id: string) => {
            await dbDeleteDeck(id);
            const allDecks = await getAllDecks();
            setDecks(allDecks);
            if (activeDeckId === id) {
                const nextId = allDecks[0]?.id ?? null;
                await setActiveDeckId(nextId);
                setActiveId(nextId);
                setCurrent(0);
                setShowAnswer(false);
            }
        },
        [activeDeckId]
    );

    const handleSetActive = useCallback(
        async (id: string) => {
            await setActiveDeckId(id);
            setActiveId(id);
            setCurrent(0);
            setShowAnswer(false);
        },
        []
    );

    const paginate = useCallback(
        (newDirection: number) => {
            setShowAnswer(false);
            setCurrent((prev) => {
                const next = prev + newDirection;
                if (next < 0) return slides.length - 1;
                if (next >= slides.length) return 0;
                return next;
            });
        },
        [slides.length]
    );

    const paginateVertical = useCallback(
        (newDirection: number) => {
            setShowAnswer(false);
            setSwipeDirection(newDirection);
            setCurrent((prev) => {
                const next = prev + newDirection;
                if (next < 0) return slides.length - 1;
                if (next >= slides.length) return 0;
                return next;
            });
        },
        [slides.length]
    );

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") paginate(1);
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") paginate(-1);
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setShowAnswer((s) => !s);
            }
        };
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file" && items[i].type === "text/csv") {
                    const file = items[i].getAsFile();
                    if (file) {
                        handleFileUpload(file);
                        break;
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKey);
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("paste", handlePaste);
        };
    }, [paginate, handleFileUpload]);

    useEffect(() => {
        setShowAnswer(false);
    }, [current, activeDeckId]);

    useEffect(() => {
        setCurrent(0);
    }, [activeDeckId]);

    const progress =
        slides.length > 0 ? ((current + 1) / slides.length) * 100 : 0;

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
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-6"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            {t("home.title")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {activeDeck
                                ? `${activeDeck.title} — ${t("home.slideOf", { current: current + 1, total: slides.length })}`
                                : t("home.uploadPrompt")}
                        </p>
                    </motion.div>

                    {/* Deck tabs */}
                    {decks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap gap-2 justify-center mb-6"
                        >
                            {decks.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => handleSetActive(d.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                        d.id === activeDeckId
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                    }`}
                                >
                                    <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-semibold">{d.title}</span>
                                    <span className="text-xs opacity-60">
                                        ({Array.isArray(d.slides) ? d.slides.length : 0})
                                    </span>
                                    <Trash2
                                        className="h-3.5 w-3.5 shrink-0 hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeckToDelete(d.id);
                                        }}
                                    />
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Upload button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mb-6"
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            {t("home.uploadCsv")}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                handleMultipleFileUpload(e.target.files);
                                e.target.value = "";
                            }}
                        />
                    </motion.div>

                    {/* Error message */}
                    <AnimatePresence>
                        {uploadError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                
                                className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-6 max-w-lg mx-auto"
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{uploadError}</span>
                                <button
                                    onClick={() => setUploadError(null)}
                                    className="ml-auto shrink-0 hover:opacity-70"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Slide area */}
                    {slides.length > 0 ? (
                        <>
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Flip card container with swipe */}
                            <div className="relative w-full h-[340px] perspective-1000">
                                <AnimatePresence
                                    initial={false}
                                    custom={swipeDirection}
                                    mode="wait"
                                >
                                    <motion.div
                                        key={`${activeDeckId}-${current}-swipe`}
                                        custom={swipeDirection}
                                        variants={swipeVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            type: "spring",
                                            stiffness: 1000,
                                            damping: 80,
                                        }}
                                        drag="y"
                                        dragConstraints={{ top: 0, bottom: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(_, info) => {
                                            if (info.offset.y > 100) {
                                                paginateVertical(-1);
                                            } else if (info.offset.y < -100) {
                                                paginateVertical(1);
                                            }
                                        }}
                                        className="relative w-full h-full"
                                    >
                                        <div
                                            className="relative w-full h-full perspective-1000 cursor-pointer"
                                            onClick={() => setShowAnswer(!showAnswer)}
                                        >
                                            <motion.div
                                                className="relative w-full h-full preserve-3d transition-transform duration-500"
                                                style={{
                                                    transformStyle: "preserve-3d",
                                                    transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
                                                }}
                                            >
                                                {/* Front - Question */}
                                                <div className="absolute w-full h-full backface-hidden rounded-2xl border bg-card shadow-lg p-8 flex flex-col items-center justify-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <HelpCircle className="h-6 w-6" />
                                                            <span className="text-sm font-semibold uppercase tracking-wider">
                                                                {t("home.question")}
                                                            </span>
                                                        </div>
                                                        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed text-center">
                                                            {slides[current]?.question}
                                                        </h2>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-4">
                                                        {t("home.clickToFlip")}
                                                    </p>
                                                </div>

                                                {/* Back - Answer (flipped 180°) */}
                                                <div
                                                    className="absolute w-full h-full backface-hidden rounded-2xl border bg-primary/10 shadow-lg p-8 flex flex-col items-center justify-center"
                                                    style={{
                                                        transform: "rotateY(180deg)",
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <Lightbulb className="h-6 w-6" />
                                                            <span className="text-sm font-semibold uppercase tracking-wider">
                                                                {t("home.answer")}
                                                            </span>
                                                        </div>
                                                        <p className="text-lg md:text-xl font-semibold text-foreground text-center">
                                                            {slides[current]?.answer}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-4">
                                                        {t("home.clickToFlip")}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-center gap-6 mt-8">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => paginate(-1)}
                                    className="h-12 w-12 rounded-full"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>

                                <div className="flex gap-1.5 max-w-[280px] overflow-hidden items-center">
                                    {slides.map((_, i) => {
                                        const dist = Math.abs(i - current);
                                        if (
                                            dist > 4 &&
                                            i !== 0 &&
                                            i !== slides.length - 1
                                        )
                                            return null;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSwipeDirection(
                                                        i > current ? 1 : -1
                                                    );
                                                    setCurrent(i);
                                                }}
                                                className={`h-2.5 w-2.5 rounded-full transition-all shrink-0 ${
                                                    i === current
                                                        ? "bg-primary scale-125"
                                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                                }`}
                                            />
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => paginate(1)}
                                    className="h-12 w-12 rounded-full"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground mt-4">
                                {t("home.keyboardHint")}
                            </p>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-4 py-16"
                        >
                            <div className="flex justify-center">
                                <div className="bg-muted rounded-full p-6">
                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">
                                {t("home.noDeck")}
                            </h2>
                            <p 
                                className="text-muted-foreground max-w-md mx-auto"
                                dangerouslySetInnerHTML={{ __html: t("home.noDeckDesc") }}
                            />
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Setup Dialog */}
            <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("home.deckSetup")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="deck-title">{t("home.deckTitle")}</Label>
                            <Input
                                id="deck-title"
                                placeholder={t("home.deckTitlePlaceholder")}
                                value={setupTitle}
                                onChange={(e) => setSetupTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("home.selectTopic")}</Label>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSetupTopic(topic.id as DeckTopic)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                            setupTopic === topic.id
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                        }`}
                                    >
                                        {topic.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowSetupDialog(false);
                                setPendingDeck(null);
                            }}
                        >
                            {t("home.cancel")}
                        </Button>
                        <Button
                            onClick={confirmDeck}
                            disabled={!setupTitle.trim()}
                        >
                            {t("home.save")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deckToDelete !== null} onOpenChange={(o) => !o && setDeckToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("home.deleteDeck")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("home.deleteDeckConfirm")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("home.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deckToDelete) {
                                    handleDeleteDeck(deckToDelete);
                                    setDeckToDelete(null);
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t("home.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
