import { useEffect, useCallback } from "react";

interface UseKeyboardAndFileHandlersProps {
    onFileUpload: (file: File) => void;
    onPaginate: (direction: number) => void;
    onToggleAnswer: () => void;
}

export function useKeyboardAndFileHandlers({
    onFileUpload,
    onPaginate,
    onToggleAnswer,
}: UseKeyboardAndFileHandlersProps) {
    const handlePaste = useCallback(
        (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file" && items[i].type === "text/csv") {
                    const file = items[i].getAsFile();
                    if (file) {
                        onFileUpload(file);
                        break;
                    }
                }
            }
        },
        [onFileUpload]
    );

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") onPaginate(1);
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") onPaginate(-1);
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onToggleAnswer();
            }
        };

        window.addEventListener("keydown", handleKey);
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("paste", handlePaste);
        };
    }, [onPaginate, onToggleAnswer, onFileUpload]);
}
