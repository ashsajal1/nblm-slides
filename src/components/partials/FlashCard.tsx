import { useTranslation } from "react-i18next";
import { HelpCircle, Lightbulb } from "lucide-react";

interface FlashCardProps {
    question: string;
    answer: string;
    showAnswer: boolean;
    onFlip: () => void;
}

export function FlashCard({ question, answer, showAnswer, onFlip }: FlashCardProps) {
    const { t } = useTranslation();

    return (
        <div className="relative w-full h-full perspective-1000">
            <div
                className="relative w-full h-full preserve-3d transition-transform duration-500 cursor-pointer"
                onClick={onFlip}
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
                            {question}
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
                            {answer}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        {t("home.clickToFlip")}
                    </p>
                </div>
            </div>
        </div>
    );
}
