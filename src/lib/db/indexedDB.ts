import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "flashcards-db";
const DB_VERSION = 3;
const DECKS_STORE = "decks";
const TOPICS_STORE = "topics";

export interface Flashcard {
    question: string;
    answer: string;
}

export interface Topic {
    id: string;
    label: string;
    isCustom: boolean;
}

export type DeckTopic = string;

export const DEFAULT_TOPICS: Topic[] = [
    { id: "study", label: "Study", isCustom: false },
    { id: "personal", label: "Personal", isCustom: false },
    { id: "trading", label: "Trading", isCustom: false },
];

export interface FlashcardDeck {
    id: string;
    name: string;
    title: string;
    topic: DeckTopic;
    slides: Flashcard[];
    createdAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) {
                    db.createObjectStore(DECKS_STORE, { keyPath: "id" });
                }
                if (oldVersion < 2) {
                    db.createObjectStore(TOPICS_STORE, { keyPath: "id" });
                }
                if (oldVersion < 3) {
                    if (!db.objectStoreNames.contains(TOPICS_STORE)) {
                        db.createObjectStore(TOPICS_STORE, { keyPath: "id" });
                    }
                }
            },
        });
    }
    return dbPromise;
}

export async function getAllDecks(): Promise<FlashcardDeck[]> {
    const db = await getDB();
    return db.getAll(DECKS_STORE);
}

export async function saveDeck(deck: FlashcardDeck): Promise<void> {
    const db = await getDB();
    await db.put(DECKS_STORE, deck);
}

export async function deleteDeck(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(DECKS_STORE, id);
}

export async function updateDeckSlide(
    deckId: string,
    index: number,
    slide: Flashcard
): Promise<void> {
    const db = await getDB();
    const deck = (await db.get(DECKS_STORE, deckId)) as FlashcardDeck;
    if (!deck) return;
    deck.slides[index] = slide;
    await db.put(DECKS_STORE, deck);
}

export async function addSlideToDeck(
    deckId: string,
    slide: Flashcard
): Promise<void> {
    const db = await getDB();
    const deck = (await db.get(DECKS_STORE, deckId)) as FlashcardDeck;
    if (!deck) return;
    deck.slides.push(slide);
    await db.put(DECKS_STORE, deck);
}

export async function removeSlideFromDeck(
    deckId: string,
    index: number
): Promise<void> {
    const db = await getDB();
    const deck = (await db.get(DECKS_STORE, deckId)) as FlashcardDeck;
    if (!deck) return;
    deck.slides.splice(index, 1);
    await db.put(DECKS_STORE, deck);
}

export async function getAllTopics(): Promise<Topic[]> {
    const db = await getDB();
    const custom = (await db.getAll(TOPICS_STORE)) as Topic[];
    return [...DEFAULT_TOPICS, ...custom.filter((t) => t.isCustom)];
}

export async function saveCustomTopic(topic: Topic): Promise<void> {
    const db = await getDB();
    await db.put(TOPICS_STORE, topic);
}

export async function deleteTopic(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(TOPICS_STORE, id);
}

export async function getActiveDeckId(): Promise<string | null> {
    const db = await getDB();
    const result = await db.get(DECKS_STORE, "__active__");
    return result?.value ?? null;
}

export async function setActiveDeckId(id: string | null): Promise<void> {
    const db = await getDB();
    await db.put(DECKS_STORE, { id: "__active__", value: id });
}
