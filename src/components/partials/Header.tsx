import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { FlashcardDeck } from "@/lib/db/indexedDB";

interface HeaderProps {
    activeDeck: FlashcardDeck | null;
    currentSlide: number;
    totalSlides: number;
}

export function Header({ activeDeck, currentSlide, totalSlides }: HeaderProps) {
    const { t } = useTranslation();

    return (
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
                    ? `${activeDeck.title} — ${t("home.slideOf", { current: currentSlide + 1, total: totalSlides })}`
                    : t("home.uploadPrompt")}
            </p>
        </motion.div>
    );
}
