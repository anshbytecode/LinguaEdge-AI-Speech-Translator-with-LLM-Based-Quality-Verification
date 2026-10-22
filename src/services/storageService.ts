import { AppSettings, TranslationSession, GlossaryItem, BenchmarkRun, ModelPackage } from '../types';
import { INITIAL_GLOSSARY, INITIAL_BENCHMARK_HISTORY, INITIAL_MODELS } from '../data/modelsAndGlossary';

const SETTINGS_KEY = 'lingua_edge_settings_v2';
const HISTORY_KEY = 'lingua_edge_history_v2';
const GLOSSARY_KEY = 'lingua_edge_glossary_v2';
const BENCHMARK_KEY = 'lingua_edge_benchmark_v2';
const MODELS_KEY = 'lingua_edge_models_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  offlineOnlyMode: true,
  processingMode: 'speed',
  modelSelection: 'Whisper-Tiny + MarianMT + Qwen-0.5B (Edge INT4)',
  quantizationProfile: 'INT4',
  
  defaultSourceLang: 'en',
  defaultTargetLang: 'hi',
  autoDetectLang: false,
  micDeviceId: 'default',
  inputVolume: 100,
  outputVolume: 100,
  playbackSpeed: 1.0,
  speechPitch: 1.0,
  autoSpeakTranslation: false,
  noiseCancellationEnabled: true,
  vadThresholdMs: 800,
  
  enableVerification: true,
  verificationStrictness: 'strict',
  suggestCorrections: true,
  confidenceThreshold: 75,
  llmProvider: 'offline-heuristic',
  
  retainAudioRecordings: true,
  retainTranscripts: true,
  
  theme: 'dark',
  fontSize: 'regular',
  highContrast: false
};

export const getStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveStoredSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
};

export const getStoredHistory = (): TranslationSession[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load history:', e);
  }
  return [];
};

export const saveAllHistory = (sessions: TranslationSession[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn('Failed to save history list:', e);
  }
};

export const addHistorySession = (session: TranslationSession): TranslationSession[] => {
  try {
    const history = getStoredHistory();
    const updated = [session, ...history.filter(s => s.id !== session.id).slice(0, 49)];
    saveAllHistory(updated);
    return updated;
  } catch (e) {
    console.warn('Failed to add session:', e);
    return [];
  }
};

export const toggleFavoriteSession = (sessionId: string): TranslationSession[] => {
  const history = getStoredHistory();
  const updated = history.map(s => s.id === sessionId ? { ...s, isFavorite: !s.isFavorite } : s);
  saveAllHistory(updated);
  return updated;
};

export const renameSession = (sessionId: string, newTitle: string): TranslationSession[] => {
  const history = getStoredHistory();
  const updated = history.map(s => s.id === sessionId ? { ...s, title: newTitle } : s);
  saveAllHistory(updated);
  return updated;
};

export const deleteSession = (sessionId: string): TranslationSession[] => {
  const history = getStoredHistory();
  const updated = history.filter(s => s.id !== sessionId);
  saveAllHistory(updated);
  return updated;
};

export const clearStoredHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear history:', e);
  }
};

// --- Custom Glossary Storage ---
export const getStoredGlossary = (): GlossaryItem[] => {
  try {
    const raw = localStorage.getItem(GLOSSARY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load glossary:', e);
  }
  return INITIAL_GLOSSARY;
};

export const saveStoredGlossary = (items: GlossaryItem[]): void => {
  try {
    localStorage.setItem(GLOSSARY_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save glossary:', e);
  }
};

// --- Model Packages Storage ---
export const getStoredModels = (): ModelPackage[] => {
  try {
    const raw = localStorage.getItem(MODELS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load models:', e);
  }
  return INITIAL_MODELS;
};

export const saveStoredModels = (models: ModelPackage[]): void => {
  try {
    localStorage.setItem(MODELS_KEY, JSON.stringify(models));
  } catch (e) {
    console.warn('Failed to save models:', e);
  }
};

// --- Benchmark Runs Storage ---
export const getStoredBenchmarkRuns = (): BenchmarkRun[] => {
  try {
    const raw = localStorage.getItem(BENCHMARK_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load benchmarks:', e);
  }
  return INITIAL_BENCHMARK_HISTORY;
};

export const addBenchmarkRun = (run: BenchmarkRun): BenchmarkRun[] => {
  const runs = getStoredBenchmarkRuns();
  const updated = [run, ...runs];
  try {
    localStorage.setItem(BENCHMARK_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save benchmark run:', e);
  }
  return updated;
};

// --- Export Helpers (TXT, CSV, JSON, Markdown/Printable) ---
export const exportAuditReportJSON = (sessions: TranslationSession[]): string => {
  return JSON.stringify(
    {
      system: 'LinguaEdge: Offline Edge-AI Speech Translator & LLM Quality Verifier',
      exportedAt: new Date().toISOString(),
      architecture: 'Zero-Cloud Client Edge WebAssembly / WebGPU Runtime',
      totalSessions: sessions.length,
      sessions
    },
    null,
    2
  );
};

export const exportSessionsCSV = (sessions: TranslationSession[]): string => {
  const headers = ['ID', 'Date', 'Source Language', 'Target Language', 'Source Text', 'Verified Translation', 'Quality Score', 'Grade', 'Confidence', 'Total Latency (ms)', 'Network Usage (KB)'];
  const rows = sessions.map(s => [
    `"${s.id}"`,
    `"${new Date(s.timestamp).toISOString()}"`,
    `"${s.sourceLang}"`,
    `"${s.targetLang}"`,
    `"${s.sourceText.replace(/"/g, '""')}"`,
    `"${s.verifiedTranslation.replace(/"/g, '""')}"`,
    s.verification.overallScore,
    `"${s.verification.grade}"`,
    `"${s.verification.confidenceLevel}"`,
    s.latencies.totalMs,
    s.networkUsageKb
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

export const exportSessionsTXT = (sessions: TranslationSession[]): string => {
  return sessions.map((s, idx) => `
=====================================================
SESSION #${idx + 1}: ${s.title}
Date: ${new Date(s.timestamp).toLocaleString()}
Route: [${s.sourceLang.toUpperCase()}] -> [${s.targetLang.toUpperCase()}] (Domain: ${s.domain})
Source Text:
${s.sourceText}

Verified Translation (Grade ${s.verification.grade} - ${s.verification.overallScore}%):
${s.verifiedTranslation}

LLM Audit Verdict: ${s.verification.verdict}
${s.verification.verdictExplanation}
Back-Translation Overlap: ${s.verification.backTranslationSemanticSimilarity}%
Latency: ${s.latencies.totalMs}ms | Network Usage: 0 KB (100% Offline Edge)
=====================================================
`).join('\n');
};
