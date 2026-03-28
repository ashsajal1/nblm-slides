import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mic, Loader2 } from 'lucide-react';

export interface VoiceOption {
    name: string;
    lang: string;
    voice: SpeechSynthesisVoice;
}

export function VoiceSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [voices, setVoices] = useState<VoiceOption[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const voicesLoadedRef = useRef(false);

    const loadVoices = useCallback(() => {
        if (voicesLoadedRef.current) return;
        
        const availableVoices = window.speechSynthesis?.getVoices() || [];
        if (availableVoices.length > 0) {
            voicesLoadedRef.current = true;
            const voiceOptions: VoiceOption[] = availableVoices.map((voice) => ({
                name: voice.name,
                lang: voice.lang,
                voice,
            }));
            setVoices(voiceOptions);
            setIsLoading(false);

            const savedVoiceName = localStorage.getItem('selectedVoice');
            if (savedVoiceName) {
                const savedVoice = availableVoices.find((v) => v.name === savedVoiceName);
                if (savedVoice) {
                    setSelectedVoice(savedVoice);
                }
            }
        }
    }, []);

    useEffect(() => {
        loadVoices();

        if (window.speechSynthesis?.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        const timeout = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [loadVoices, isLoading]);

    const getLanguageName = (langCode: string): string => {
        try {
            const baseLang = langCode.split('-')[0];
            if (!/^[a-zA-Z]{2,3}$/.test(baseLang)) {
                return langCode;
            }
            const displayName = new Intl.DisplayNames(['en'], { type: 'language' }).of(baseLang);
            return displayName || langCode;
        } catch (e) {
            return langCode;
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
        setSelectedVoice(voice);
        localStorage.setItem('selectedVoice', voice.name);
        setIsOpen(false);

        // Test the voice
        const utterance = new SpeechSynthesisUtterance('Hello');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    };

    const getVoiceDisplayName = (voice: SpeechSynthesisVoice | null) => {
        if (!voice) return 'Default';
        const langName = getLanguageName(voice.lang);
        return `${langName} - ${voice.name}`;
    };

    // Group voices by language
    const voicesByLanguage = voices.reduce((acc, voiceOption) => {
        const lang = voiceOption.lang.split('-')[0];
        if (!acc[lang]) {
            acc[lang] = [];
        }
        acc[lang].push(voiceOption);
        return acc;
    }, {} as Record<string, VoiceOption[]>);

    const languageCodes = Object.keys(voicesByLanguage).sort();

    const handleToggle = () => {
        if (!isLoading && voices.length === 0) {
            loadVoices();
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-muted/50 transition-colors"
                title="Select voice"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Mic className="h-4 w-4" />
                )}
                <span className="hidden sm:inline text-xs max-w-[120px] truncate">
                    {getVoiceDisplayName(selectedVoice)}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-1 w-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-[100]"
                    >
                        <div className="py-1 max-h-[400px] overflow-y-auto">
                            {isLoading || voices.length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading voices...
                                        </div>
                                    ) : (
                                        'No voices available'
                                    )}
                                </div>
                            ) : (
                                languageCodes.map((langCode) => (
                                    <div key={langCode}>
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/30">
                                            {getLanguageName(langCode)}
                                        </div>
                                        {voicesByLanguage[langCode].map((voiceOption) => (
                                            <button
                                                key={voiceOption.voice.name}
                                                onClick={() => handleVoiceChange(voiceOption.voice)}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                                                    selectedVoice?.name === voiceOption.voice.name
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-foreground hover:bg-muted/50'
                                                }`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">{voiceOption.name}</span>
                                                    <span className="text-xs text-muted-foreground">{voiceOption.lang}</span>
                                                </div>
                                                {voiceOption.voice.default && (
                                                    <span className="text-xs text-muted-foreground ml-2">(Default)</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
