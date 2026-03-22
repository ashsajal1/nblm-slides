import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { languages } from '@/i18n/index';
import { ChevronDown, Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[1];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-muted/50 transition-colors"
            >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{currentLang.nativeName}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    >
                        <div className="py-1 max-h-[320px] overflow-y-auto">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                                        lang.code === i18n.language
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    <span className="font-medium">{lang.nativeName}</span>
                                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
