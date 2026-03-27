import { FolderOpen, Trash2 } from "lucide-react";
import type { FlashcardDeck } from "@/lib/db/indexedDB";

interface DeckTabsProps {
    decks: FlashcardDeck[];
    activeDeckId: string | null;
    onSetActive: (id: string) => void;
    onDelete: (id: string) => void;
}

export function DeckTabs({ decks, activeDeckId, onSetActive, onDelete }: DeckTabsProps) {
    return (
        <div className="flex gap-2 justify-start mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent py-2 px-4">
            {decks.map((d) => (
                <button
                    key={d.id}
                    onClick={() => onSetActive(d.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border shrink-0 ${
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
                            onDelete(d.id);
                        }}
                    />
                </button>
            ))}
        </div>
    );
}
