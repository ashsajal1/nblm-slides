import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "flashcards-db";
const DB_VERSION = 1;
const STORE_NAME = "decks";

export interface Flashcard {
    question: string;
    answer: string;
}

export interface FlashcardDeck {
    id: string;
    name: string;
    slides: Flashcard[];
    createdAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            },
        });
    }
    return dbPromise;
}

export async function getAllDecks(): Promise<FlashcardDeck[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
}

export async function saveDeck(deck: FlashcardDeck): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, deck);
}

export async function deleteDeck(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
}

export async function getActiveDeckId(): Promise<string | null> {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const result = await store.get("__active__");
    return result?.value ?? null;
}

export async function setActiveDeckId(id: string | null): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, { id: "__active__", value: id });
}
