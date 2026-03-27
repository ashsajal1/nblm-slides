import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideNavigatorProps {
    current: number;
    total: number;
    onPaginate: (direction: number) => void;
    onJumpTo: (index: number) => void;
    onDirectionChange: (direction: number) => void;
}

export function SlideNavigator({
    current,
    total,
    onPaginate,
    onJumpTo,
    onDirectionChange,
}: SlideNavigatorProps) {
    return (
        <>
            <div className="flex items-center justify-center gap-6 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPaginate(-1)}
                    className="h-12 w-12 rounded-full"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex gap-1.5 max-w-[280px] overflow-hidden items-center">
                    {Array.from({ length: total }).map((_, i) => {
                        const dist = Math.abs(i - current);
                        if (dist > 4 && i !== 0 && i !== total - 1) {
                            return null;
                        }
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    onDirectionChange(i > current ? 1 : -1);
                                    onJumpTo(i);
                                }}
                                className={`h-2.5 w-2.5 rounded-full transition-all shrink-0 ${
                                    i === current
                                        ? "bg-primary scale-125"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                            />
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPaginate(1)}
                    className="h-12 w-12 rounded-full"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
                {/* Keyboard hint will be passed from parent */}
            </p>
        </>
    );
}
