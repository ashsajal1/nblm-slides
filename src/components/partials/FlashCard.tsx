import { useTranslation } from "react-i18next";
import { HelpCircle, Lightbulb } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface FlashCardProps {
    question: string;
    answer: string;
    showAnswer: boolean;
    onFlip: () => void;
}

function renderMathInText(text: string): React.ReactNode {
    if (!text) return null;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    // Combined regex to match block math ($$...$$ or \[...\]), inline math ($...$ or \(...\)), or display math ($...$ with trailing space)
    // Order matters: check block math first, then inline
    const mathRegex = /\$\$(.+?)\$\$|\\\[([\s\S]*?)\\\]|\$(.+?)\$|\\\((.+?)\\\)/g;
    let match;

    while ((match = mathRegex.exec(text)) !== null) {
        // Add text before the math
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        // Determine which type of math and add accordingly
        if (match[1] !== undefined || match[2] !== undefined) {
            // Block math: $$...$$ or \[...\]
            const mathExpression = match[1] || match[2];
            parts.push(
                <div key={key++} className="my-2">
                    <BlockMath math={mathExpression} />
                </div>
            );
        } else {
            // Inline math: $...$ or \(...\)
            const mathExpression = match[3] || match[4];
            parts.push(
                <InlineMath key={key++} math={mathExpression} />
            );
        }

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
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
                            {renderMathInText(question)}
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
                            {renderMathInText(answer)}
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
