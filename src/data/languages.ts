import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', speechLocale: 'en-US', isSupportedOffline: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechLocale: 'hi-IN', isSupportedOffline: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechLocale: 'es-ES', isSupportedOffline: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechLocale: 'fr-FR', isSupportedOffline: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechLocale: 'de-DE', isSupportedOffline: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechLocale: 'ja-JP', isSupportedOffline: true },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', speechLocale: 'zh-CN', isSupportedOffline: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechLocale: 'ar-SA', direction: 'rtl', isSupportedOffline: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', speechLocale: 'pt-BR', isSupportedOffline: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speechLocale: 'ru-RU', isSupportedOffline: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', speechLocale: 'it-IT', isSupportedOffline: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', speechLocale: 'ko-KR', isSupportedOffline: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', speechLocale: 'nl-NL', isSupportedOffline: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', speechLocale: 'tr-TR', isSupportedOffline: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', speechLocale: 'vi-VN', isSupportedOffline: true },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', speechLocale: 'sw-KE', isSupportedOffline: true },
];

export const getLanguageByCode = (code: string): Language => {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
};
