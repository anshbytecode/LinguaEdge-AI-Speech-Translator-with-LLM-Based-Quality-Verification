export type DomainType = 
  | 'medical' 
  | 'disaster' 
  | 'travel' 
  | 'diplomatic' 
  | 'tech' 
  | 'general';

export type NavigationTab = 
  | 'overview'
  | 'translate'
  | 'inspector'
  | 'quality_lab'
  | 'conversation'
  | 'phrasebook'
  | 'practice'
  | 'history'
  | 'analytics'
  | 'pipeline'
  | 'models'
  | 'glossary'
  | 'benchmark'
  | 'settings';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechLocale: string;
  direction?: 'ltr' | 'rtl';
  isSupportedOffline: boolean;
}

export type VerificationGrade = 'A+' | 'A' | 'B' | 'C' | 'F';

export interface FlaggedError {
  id: string;
  type: 'negation' | 'number' | 'dosage' | 'mistranslation' | 'omission' | 'name' | 'inconsistent_term';
  severity: 'critical' | 'warning' | 'info';
  term: string;
  description: string;
  category?: 'meaning' | 'omission' | 'grammar' | 'fluency' | 'terminology' | 'formatting';
}

export interface SuggestedCorrection {
  original: string;
  refined: string;
  reason: string;
  accepted?: boolean;
}

export interface TokenAlignment {
  sourceToken: string;
  targetToken: string;
  confidence: number; // 0 to 1
  isEntity?: boolean;
  isPreserved?: boolean;
  status: 'matched' | 'shifted' | 'hallucinated' | 'omitted';
}

export interface TranslationCandidate {
  id: string;
  modelName: string;
  text: string;
  bleuScore: number;
  fluencyScore: number;
  terminologyScore: number;
  isRecommended: boolean;
}

export interface QualityVerificationResult {
  overallScore: number; // 0 - 100 estimated score
  grade: VerificationGrade;
  confidenceLevel: 'high' | 'medium' | 'low';
  verdict: 'VERIFIED_ACCURATE' | 'ACCEPTABLE' | 'NEEDS_REVIEW' | 'CRITICAL_HALLUCINATION_DETECTED';
  verdictExplanation: string;
  scoreCalculationExplanation: string;
  meaningPreservation: 'intact' | 'minor_drift' | 'severe_distortion';
  semanticSimilarity: number;
  fluencyScore: number;
  domainPrecision: number;
  hallucinationRisk: 'none' | 'low' | 'moderate' | 'critical';
  benchmarkBleuScore: number; // reference BLEU metric, kept separate from LLM quality score
  backTranslation: string;
  backTranslationSemanticSimilarity: number; // 0 - 100
  detectedEntities: string[];
  droppedEntities: string[];
  flaggedErrors: FlaggedError[];
  suggestedCorrection?: SuggestedCorrection;
  candidates?: TranslationCandidate[];
  tokenAlignments: TokenAlignment[];
  linguisticCritique: string[];
  verificationEngine: 'offline-edge-lqv' | 'deep-cloud-llm' | 'heuristic-matrix';
  latencyMs: number;
  userRating?: number; // 1-5 stars
}

export interface LatencyBreakdown {
  sttMs: number;
  nmtMs: number;
  lqvMs: number;
  ttsMs: number;
  totalMs: number;
}

export interface TranslationSession {
  id: string;
  title: string;
  timestamp: number;
  isFavorite: boolean;
  domain: DomainType;
  sourceLang: string;
  targetLang: string;
  rawTranscript: string;
  sourceText: string; // editable transcript
  initialTranslation: string;
  translatedText: string; // active translation
  verifiedTranslation: string;
  userAcceptedCorrection: boolean;
  phoneticGuide?: string;
  latencies: LatencyBreakdown;
  verification: QualityVerificationResult;
  processingMode: 'speed' | 'quality';
  networkUsageKb: number;
  peakRamMb: number;
  audioDurationSec?: number;
  audioBlobUrl?: string;
  notes?: string;
  tags?: string[];
}

export interface PresetScenario {
  id: string;
  title: string;
  category: DomainType;
  sourceLang: string;
  targetLang: string;
  description: string;
  sourceText: string;
  expectedTranslation: string;
  keyEntities: string[];
  urgency: 'high' | 'critical' | 'routine';
}

export interface PhrasebookItem {
  id: string;
  category: DomainType;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  phoneticGuide?: string;
  isEmergency: boolean;
}

export interface GlossaryItem {
  id: string;
  term: string;
  sourceLang: string;
  targetLang: string;
  preferredTranslation: string;
  category: DomainType;
  notes: string;
  createdAt: number;
}

export interface ModelPackage {
  id: string;
  name: string;
  task: 'Speech-to-Text' | 'Translation' | 'LLM Verifier' | 'Text-to-Speech';
  version: string;
  sizeMb: number;
  quantization: 'INT4' | 'INT8' | 'FP16';
  languagePair: string;
  status: 'ready' | 'downloading' | 'available' | 'offline_ready';
  memoryRequiredMb: number;
  lastUpdated: string;
}

export interface BenchmarkSample {
  id: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  referenceTranslation: string;
  domain: DomainType;
}

export interface BenchmarkRun {
  id: string;
  timestamp: number;
  modelProfile: string;
  quantization: string;
  languagePair: string;
  sampleCount: number;
  avgLatencyMs: number;
  avgBleuScore: number;
  avgLqvScore: number;
  peakRamMb: number;
  networkKb: number;
  errorCount: number;
  status: 'completed' | 'running';
}

export interface PipelineStageNode {
  id: string;
  name: string;
  stage: 'capture' | 'vad' | 'stt' | 'nmt' | 'lqv' | 'tts';
  status: 'idle' | 'running' | 'completed' | 'error';
  latencyMs: number;
  inputPreview: string;
  outputPreview: string;
  details: string;
}

export interface OfflineSelfTestResult {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'running' | 'not_tested';
  message: string;
}

export interface PrivacyAuditEvent {
  id: string;
  timestamp: number;
  action: string;
  modelUsed: string;
  audioKeptOnDevice: boolean;
  networkBytesTransferred: number;
}

export interface AppSettings {
  // Offline & Edge
  offlineOnlyMode: boolean;
  processingMode: 'speed' | 'quality';
  modelSelection: string;
  quantizationProfile: 'INT4' | 'INT8' | 'FP16';
  
  // Audio & Speech
  defaultSourceLang: string;
  defaultTargetLang: string;
  autoDetectLang: boolean;
  micDeviceId: string;
  inputVolume: number;
  outputVolume: number;
  playbackSpeed: number;
  speechRate?: number;
  speechPitch: number;
  autoSpeakTranslation: boolean;
  noiseCancellationEnabled: boolean;
  vadThresholdMs: number; // e.g. 800ms silence detection
  
  // Verification Settings
  enableVerification: boolean;
  verificationStrictness: 'strict' | 'balanced' | 'relaxed';
  suggestCorrections: boolean;
  confidenceThreshold: number;
  llmProvider: 'offline-heuristic' | 'gemini' | 'openai' | 'groq' | 'ollama';
  apiKey?: string;
  customModelName?: string;
  targetAudience?: 'general' | 'clinical' | 'emergency_responder' | 'technical';
  
  // Privacy & Retention
  retainAudioRecordings: boolean;
  retainTranscripts: boolean;
  
  // Accessibility & Theme
  theme: 'dark' | 'light' | 'oled';
  fontSize: 'regular' | 'large' | 'xlarge';
  highContrast: boolean;
}
