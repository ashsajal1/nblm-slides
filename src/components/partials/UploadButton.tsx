import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
    onFilesSelected: (files: FileList | null) => void;
}

export function UploadButton({ onFilesSelected }: UploadButtonProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
            >
                <Upload className="h-4 w-4" />
                {t("home.uploadCsv")}
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                multiple
                className="hidden"
                onChange={(e) => {
                    onFilesSelected(e.target.files);
                    e.target.value = "";
                }}
            />
        </>
    );
}
