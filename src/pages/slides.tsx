import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    getAllDecks,
    getAllTopics,
    saveDeck,
    deleteDeck,
    updateDeckSlide,
    addSlideToDeck,
    removeSlideFromDeck,
    saveCustomTopic,
    deleteTopic,
    type FlashcardDeck,
    type Flashcard,
    type Topic,
    type DeckTopic,
} from "@/lib/db/indexedDB";
import Seo from "../components/Seo";
import Particles from "@/components/custom-ui/particles";
import {
    Plus,
    Trash2,
    Pencil,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Settings2,
    Check,
    X,
    Tag,
    PlusCircle,
    Filter,
} from "lucide-react";

export default function SlidesPage() {
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "slides">("grid");
    const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [filterTopic, setFilterTopic] = useState<DeckTopic | "all">("all");

    const [editSlideIndex, setEditSlideIndex] = useState<number | null>(null);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");

    const [showTopicDialog, setShowTopicDialog] = useState(false);
    const [newTopicLabel, setNewTopicLabel] = useState("");

    const [showDeckEditDialog, setShowDeckEditDialog] = useState(false);
    const [editDeckTitle, setEditDeckTitle] = useState("");
    const [editDeckTopic, setEditDeckTopic] = useState<DeckTopic>("study");

    const [showAddSlideDialog, setShowAddSlideDialog] = useState(false);
    const [addQuestion, setAddQuestion] = useState("");
    const [addAnswer, setAddAnswer] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const [allDecks, allTopics] = await Promise.all([
                    getAllDecks(),
                    getAllTopics(),
                ]);
                setDecks(allDecks);
                setTopics(allTopics);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filteredDecks =
        filterTopic === "all"
            ? decks
            : decks.filter((d) => d.topic === filterTopic);

    const slides = activeDeck?.slides ?? [];

    const handleDeleteDeck = useCallback(async (id: string) => {
        await deleteDeck(id);
        setDecks(await getAllDecks());
        if (activeDeck?.id === id) {
            setActiveDeck(null);
        }
    }, [activeDeck]);

    const handleStartEditDeck = (deck: FlashcardDeck) => {
        setEditDeckTitle(deck.title);
        setEditDeckTopic(deck.topic);
        setShowDeckEditDialog(true);
    };

    const handleSaveDeck = useCallback(async () => {
        if (!activeDeck || !editDeckTitle.trim()) return;
        const updated: FlashcardDeck = {
            ...activeDeck,
            title: editDeckTitle.trim(),
            topic: editDeckTopic,
        };
        await saveDeck(updated);
        setDecks(await getAllDecks());
        setActiveDeck(updated);
        setShowDeckEditDialog(false);
    }, [activeDeck, editDeckTitle, editDeckTopic]);

    const handleStartEditSlide = (index: number) => {
        const slide = slides[index];
        setEditSlideIndex(index);
        setEditQuestion(slide.question);
        setEditAnswer(slide.answer);
    };

    const handleSaveSlide = useCallback(async () => {
        if (editSlideIndex === null || !activeDeck || !editQuestion.trim())
            return;
        const updatedSlide: Flashcard = {
            question: editQuestion.trim(),
            answer: editAnswer.trim(),
        };
        await updateDeckSlide(activeDeck.id, editSlideIndex, updatedSlide);
        const allDecks = await getAllDecks();
        setDecks(allDecks);
        setActiveDeck(allDecks.find((d) => d.id === activeDeck.id) ?? null);
        setEditSlideIndex(null);
        setEditQuestion("");
        setEditAnswer("");
    }, [editSlideIndex, editQuestion, editAnswer, activeDeck]);

    const handleAddSlide = useCallback(async () => {
        if (!activeDeck || !addQuestion.trim()) return;
        const newSlide: Flashcard = {
            question: addQuestion.trim(),
            answer: addAnswer.trim(),
        };
        await addSlideToDeck(activeDeck.id, newSlide);
        const allDecks = await getAllDecks();
        setDecks(allDecks);
        setActiveDeck(allDecks.find((d) => d.id === activeDeck.id) ?? null);
        setAddQuestion("");
        setAddAnswer("");
        setShowAddSlideDialog(false);
    }, [addQuestion, addAnswer, activeDeck]);

    const handleDeleteSlide = useCallback(async (index: number) => {
        if (!activeDeck) return;
        await removeSlideFromDeck(activeDeck.id, index);
        const allDecks = await getAllDecks();
        setDecks(allDecks);
        setActiveDeck(allDecks.find((d) => d.id === activeDeck.id) ?? null);
        setCurrent((prev) => Math.max(0, prev - 1));
    }, [activeDeck]);

    const handleCreateTopic = useCallback(async () => {
        if (!newTopicLabel.trim()) return;
        const id = `custom-${Date.now()}`;
        const topic: Topic = { id, label: newTopicLabel.trim(), isCustom: true };
        await saveCustomTopic(topic);
        const allTopics = await getAllTopics();
        setTopics(allTopics);
        setNewTopicLabel("");
        setShowTopicDialog(false);
    }, [newTopicLabel]);

    const handleDeleteTopic = useCallback(async (id: string) => {
        await deleteTopic(id);
        setTopics(await getAllTopics());
    }, []);

    const paginate = useCallback((newDirection: number) => {
        setShowAnswer(false);
        setDirection(newDirection);
        setCurrent((prev) => {
            const next = prev + newDirection;
            if (next < 0) return slides.length - 1;
            if (next >= slides.length) return 0;
            return next;
        });
    }, [slides.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (viewMode !== "slides") return;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") paginate(1);
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") paginate(-1);
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setShowAnswer((s) => !s);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [paginate, viewMode]);

    useEffect(() => {
        setShowAnswer(false);
    }, [current, activeDeck]);

    const slideVariants = {
        enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
    };

    if (loading) return null;

    return (
        <>
            <Seo title="স্লাইডস" description="ফ্ল্যাশকার্ড স্লাইডস" />

            <section className="relative w-full min-h-screen overflow-hidden bg-background">
                <div className="absolute inset-0">
                    <Particles />
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                স্লাইডস
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {decks.length} ডেক — {decks.reduce((acc, d) => acc + d.slides.length, 0)} স্লাইড
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTopicDialog(true)}
                                className="gap-2"
                            >
                                <Tag className="h-4 w-4" />
                                টপিক
                            </Button>
                            {activeDeck && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setActiveDeck(null);
                                        setViewMode("grid");
                                        setCurrent(0);
                                    }}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    ফিরে যান
                                </Button>
                            )}
                        </div>
                    </motion.div>

                    {/* Topic filter */}
                    {!activeDeck && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap items-center gap-2 mb-6"
                        >
                            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                            <button
                                onClick={() => setFilterTopic("all")}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                    filterTopic === "all"
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                }`}
                            >
                                সব
                            </button>
                            {topics.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() =>
                                        setFilterTopic(
                                            filterTopic === t.id ? "all" : t.id
                                        )
                                    }
                                    className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1.5 ${
                                        filterTopic === t.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                    }`}
                                >
                                    <span>{t.label}</span>
                                    {t.isCustom && (
                                        <X
                                            className="h-3 w-3 hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTopic(t.id);
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Grid View */}
                    {viewMode === "grid" && !activeDeck && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDecks.map((deck, i) => (
                                <motion.div
                                    key={deck.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground truncate">
                                                {deck.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                                    {topics.find((t) => t.id === deck.topic)?.label ?? deck.topic}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => {
                                                    setActiveDeck(deck);
                                                    setViewMode("slides");
                                                    setCurrent(0);
                                                }}
                                                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                                title="View"
                                            >
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActiveDeck(deck);
                                                    handleStartEditDeck(deck);
                                                }}
                                                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                                title="Settings"
                                            >
                                                <Settings2 className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDeck(deck.id)}
                                                className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {deck.slides.length} স্লাইড
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Slides View */}
                    {viewMode === "slides" && activeDeck && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-foreground">
                                    {activeDeck.title}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowAddSlideDialog(true)}
                                        className="gap-1.5"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        স্লাইড যোগ
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStartEditDeck(activeDeck)}
                                        className="gap-1.5"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        এডিট
                                    </Button>
                                </div>
                            </div>

                            {/* Slides table */}
                            <div className="bg-card border rounded-xl overflow-hidden mb-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-12">#</th>
                                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">প্রশ্ন</th>
                                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">উত্তর</th>
                                                <th className="text-right px-4 py-3 font-medium text-muted-foreground w-24">অ্যাকশন</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {slides.map((slide, i) => (
                                                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                                    <td className="px-4 py-3 text-foreground font-medium">
                                                        {slide.question}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {slide.answer}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-end gap-1">
                                                            <button
                                                                onClick={() => handleStartEditSlide(i)}
                                                                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSlide(i)}
                                                                className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Slideshow */}
                            <div className="relative overflow-hidden rounded-2xl border bg-card shadow-lg min-h-[300px] flex items-center justify-center p-8">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    <motion.div
                                        key={`${activeDeck.id}-${current}`}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="w-full text-center space-y-6"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                                                {slides[current]?.question}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setShowAnswer((s) => !s)}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                                        >
                                            {showAnswer ? "প্রশ্ন দেখুন" : "উত্তর দেখুন"}
                                        </button>
                                        {showAnswer && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-primary/10 border border-primary/20 rounded-xl p-4"
                                            >
                                                <p className="text-lg font-semibold text-foreground">
                                                    {slides[current]?.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-center gap-6 mt-6">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => paginate(-1)}
                                    className="h-10 w-10 rounded-full"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {current + 1} / {slides.length}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => paginate(1)}
                                    className="h-10 w-10 rounded-full"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </>
                    )}

                    {filteredDecks.length === 0 && viewMode === "grid" && (
                        <div className="text-center py-16 text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>কোনো ডেক পাওয়া যায়নি।</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Edit Slide Dialog */}
            <Dialog open={editSlideIndex !== null} onOpenChange={(o) => !o && setEditSlideIndex(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>স্লাইড এডিট করুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>প্রশ্ন</Label>
                            <Input
                                value={editQuestion}
                                onChange={(e) => setEditQuestion(e.target.value)}
                                placeholder="প্রশ্ন লিখুন"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>উত্তর</Label>
                            <Input
                                value={editAnswer}
                                onChange={(e) => setEditAnswer(e.target.value)}
                                placeholder="উত্তর লিখুন"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditSlideIndex(null)}>
                            বাতিল
                        </Button>
                        <Button onClick={handleSaveSlide} disabled={!editQuestion.trim()}>
                            সেভ করুন
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Slide Dialog */}
            <Dialog open={showAddSlideDialog} onOpenChange={setShowAddSlideDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>নতুন স্লাইড যোগ করুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>প্রশ্ন</Label>
                            <Input
                                value={addQuestion}
                                onChange={(e) => setAddQuestion(e.target.value)}
                                placeholder="প্রশ্ন লিখুন"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>উত্তর</Label>
                            <Input
                                value={addAnswer}
                                onChange={(e) => setAddAnswer(e.target.value)}
                                placeholder="উত্তর লিখুন"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddSlideDialog(false)}>
                            বাতিল
                        </Button>
                        <Button onClick={handleAddSlide} disabled={!addQuestion.trim()}>
                            যোগ করুন
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Topic Dialog */}
            <Dialog open={showTopicDialog} onOpenChange={setShowTopicDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>টপিক ম্যানেজ করুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        {topics.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between px-3 py-2 bg-card border rounded-lg"
                            >
                                <span className="text-sm font-medium">{t.label}</span>
                                {t.isCustom ? (
                                    <button
                                        onClick={() => handleDeleteTopic(t.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                            <Input
                                placeholder="নতুন টপিকের নাম"
                                value={newTopicLabel}
                                onChange={(e) => setNewTopicLabel(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreateTopic()}
                            />
                            <Button onClick={handleCreateTopic} disabled={!newTopicLabel.trim()}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Deck Dialog */}
            <Dialog open={showDeckEditDialog} onOpenChange={setShowDeckEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>ডেক এডিট করুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>টাইটেল</Label>
                            <Input
                                value={editDeckTitle}
                                onChange={(e) => setEditDeckTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>টপিক</Label>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setEditDeckTopic(t.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                            editDeckTopic === t.id
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeckEditDialog(false)}>
                            বাতিল
                        </Button>
                        <Button onClick={handleSaveDeck} disabled={!editDeckTitle.trim()}>
                            সেভ করুন
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
