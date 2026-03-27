import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

export function EmptyState() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 py-16"
        >
            <div className="flex justify-center">
                <div className="bg-muted rounded-full p-6">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
                {t("home.noDeck")}
            </h2>
            <p
                className="text-muted-foreground max-w-md mx-auto"
                dangerouslySetInnerHTML={{ __html: t("home.noDeckDesc") }}
            />
        </motion.div>
    );
}
