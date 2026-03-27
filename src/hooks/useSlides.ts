import { useState, useCallback } from "react";

export function useSlides(total: number) {
    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(0);

    const paginate = useCallback(
        (newDirection: number) => {
            setShowAnswer(false);
            setCurrent((prev) => {
                const next = prev + newDirection;
                if (next < 0) return total - 1;
                if (next >= total) return 0;
                return next;
            });
        },
        [total]
    );

    const paginateVertical = useCallback(
        (newDirection: number) => {
            setShowAnswer(false);
            setSwipeDirection(newDirection);
            setCurrent((prev) => {
                const next = prev + newDirection;
                if (next < 0) return total - 1;
                if (next >= total) return 0;
                return next;
            });
        },
        [total]
    );

    const reset = useCallback(() => {
        setCurrent(0);
        setShowAnswer(false);
    }, []);

    return {
        current,
        showAnswer,
        swipeDirection,
        setCurrent,
        setShowAnswer,
        setSwipeDirection,
        paginate,
        paginateVertical,
        reset,
    };
}
