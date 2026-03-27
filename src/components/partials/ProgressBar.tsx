import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
    const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

    return (
        <div className="w-full h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
            <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
}
