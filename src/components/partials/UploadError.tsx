import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface UploadErrorProps {
    error: string;
    onDismiss: () => void;
}

export function UploadError({ error, onDismiss }: UploadErrorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-6 max-w-lg mx-auto"
        >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
            <button
                onClick={onDismiss}
                className="ml-auto shrink-0 hover:opacity-70"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}
