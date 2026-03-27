import { useState, useEffect, useCallback } from "react";
import {
    getAllDecks,
    getAllTopics,
    saveDeck,
    deleteDeck as dbDeleteDeck,
    getActiveDeckId,
    setActiveDeckId,
    DEFAULT_TOPICS,
    type FlashcardDeck,
    type Topic,
} from "@/lib/db/indexedDB";

export function useDecks() {
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [activeDeckId, setActiveId] = useState<string | null>(null);
    const [topics, setTopics] = useState<Topic[]>(DEFAULT_TOPICS);
    const [loading, setLoading] = useState(true);

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

    const handleSaveDeck = useCallback(async (deck: FlashcardDeck) => {
        await saveDeck(deck);
        await setActiveDeckId(deck.id);
        const allDecks = await getAllDecks();
        setDecks(allDecks);
        setActiveId(deck.id);
    }, []);

    const handleDeleteDeck = useCallback(async (id: string) => {
        await dbDeleteDeck(id);
        const allDecks = await getAllDecks();
        setDecks(allDecks);
        if (activeDeckId === id) {
            const nextId = allDecks[0]?.id ?? null;
            await setActiveDeckId(nextId);
            setActiveId(nextId);
        }
    }, [activeDeckId]);

    const handleSetActive = useCallback(async (id: string) => {
        await setActiveDeckId(id);
        setActiveId(id);
    }, []);

    return {
        decks,
        activeDeckId,
        topics,
        loading,
        handleSaveDeck,
        handleDeleteDeck,
        handleSetActive,
        setActiveId,
        setDecks,
    };
}
