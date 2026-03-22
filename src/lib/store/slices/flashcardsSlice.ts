import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface FlashcardsState {
    decks: FlashcardDeck[];
    activeDeckId: string | null;
    uploadError: string | null;
}

const initialState: FlashcardsState = {
    decks: [],
    activeDeckId: null,
    uploadError: null,
};

const flashcardsSlice = createSlice({
    name: 'flashcards',
    initialState,
    reducers: {
        addDeck: (state, action: PayloadAction<FlashcardDeck>) => {
            state.decks.push(action.payload);
            if (!state.activeDeckId) {
                state.activeDeckId = action.payload.id;
            }
            state.uploadError = null;
        },
        removeDeck: (state, action: PayloadAction<string>) => {
            state.decks = state.decks.filter((d) => d.id !== action.payload);
            if (state.activeDeckId === action.payload) {
                state.activeDeckId = state.decks[0]?.id ?? null;
            }
        },
        setActiveDeck: (state, action: PayloadAction<string | null>) => {
            state.activeDeckId = action.payload;
        },
        clearUploadError: (state) => {
            state.uploadError = null;
        },
    },
});

export const { addDeck, removeDeck, setActiveDeck, clearUploadError } =
    flashcardsSlice.actions;

export default flashcardsSlice.reducer;
