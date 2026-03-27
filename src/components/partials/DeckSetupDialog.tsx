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
import type { DeckTopic, Topic } from "@/lib/db/indexedDB";

interface DeckSetupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    onTitleChange: (title: string) => void;
    topic: DeckTopic;
    onTopicChange: (topic: DeckTopic) => void;
    topics: Topic[];
    onSave: () => void;
    onCancel: () => void;
}

export function DeckSetupDialog({
    open,
    onOpenChange,
    title,
    onTitleChange,
    topic,
    onTopicChange,
    topics,
    onSave,
    onCancel,
}: DeckSetupDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("home.selectTopic")}</Label>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topicItem) => (
                                <button
                                    key={topicItem.id}
                                    onClick={() => onTopicChange(topicItem.id as DeckTopic)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                        topic === topicItem.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card text-muted-foreground border-border hover:border-primary/50"
                                    }`}
                                >
                                    {topicItem.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        {t("home.cancel")}
                    </Button>
                    <Button onClick={onSave} disabled={!title.trim()}>
                        {t("home.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
