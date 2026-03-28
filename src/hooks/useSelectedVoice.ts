import { useState, useEffect, useCallback, useRef } from 'react';

const VOICE_CHANGE_EVENT = 'selectedVoiceChanged';

export function useSelectedVoice() {
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const voicesLoadedRef = useRef(false);

    const loadVoice = useCallback(() => {
        if (voicesLoadedRef.current) return;
        
        const voices = window.speechSynthesis?.getVoices() || [];
        if (voices.length > 0) {
            voicesLoadedRef.current = true;
            const savedVoiceName = localStorage.getItem('selectedVoice');
            if (savedVoiceName) {
                const voice = voices.find((v) => v.name === savedVoiceName);
                if (voice) {
                    setSelectedVoice(voice);
                }
            }
        }
    }, []);

    useEffect(() => {
        loadVoice();

        if (window.speechSynthesis?.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoice;
        }

        const handleVoiceChange = (e: CustomEvent) => {
            setSelectedVoice(e.detail);
        };

        window.addEventListener(VOICE_CHANGE_EVENT, handleVoiceChange as EventListener);
        
        return () => {
            window.removeEventListener(VOICE_CHANGE_EVENT, handleVoiceChange as EventListener);
        };
    }, [loadVoice]);

    return selectedVoice;
}

export function notifyVoiceChange(voice: SpeechSynthesisVoice) {
    window.dispatchEvent(new CustomEvent(VOICE_CHANGE_EVENT, { detail: voice }));
}
