import { motion } from "framer-motion";
import { FlashCard } from "./FlashCard";

const swipeVariants = {
    enter: (direction: number) => ({
        y: direction > 0 ? 400 : -400,
        opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (direction: number) => ({
        y: direction < 0 ? 400 : -400,
        opacity: 0,
    }),
};

interface SwipeableFlashCardProps {
    question: string;
    answer: string;
    showAnswer: boolean;
    onFlip: () => void;
    swipeDirection: number;
    onSwipeComplete: (direction: number) => void;
}

export function SwipeableFlashCard({
    question,
    answer,
    showAnswer,
    onFlip,
    swipeDirection,
    onSwipeComplete,
}: SwipeableFlashCardProps) {
    return (
        <motion.div
            key={`card-${swipeDirection}`}
            custom={swipeDirection}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                type: "spring",
                stiffness: 1000,
                damping: 80,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={1}
            onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                    onSwipeComplete(-1);
                } else if (info.offset.y < -100) {
                    onSwipeComplete(1);
                }
            }}
            className="relative w-full h-[340px]"
        >
            <FlashCard
                question={question}
                answer={answer}
                showAnswer={showAnswer}
                onFlip={onFlip}
            />
        </motion.div>
    );
}
