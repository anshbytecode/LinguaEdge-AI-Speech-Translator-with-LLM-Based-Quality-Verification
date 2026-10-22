import { ModelPackage, GlossaryItem, BenchmarkSample, BenchmarkRun } from '../types';

export const INITIAL_MODELS: ModelPackage[] = [
  {
    id: 'stt-whisper-tiny-edge',
    name: 'Whisper-Edge Tiny Multi',
    task: 'Speech-to-Text',
    version: 'v2.1-int4',
    sizeMb: 38.5,
    quantization: 'INT4',
    languagePair: 'Multi (99 Langs)',
    status: 'offline_ready',
    memoryRequiredMb: 110,
    lastUpdated: '2026-10-15'
  },
  {
    id: 'nmt-marian-en-hi',
    name: 'MarianMT Edge English ↔ Hindi',
    task: 'Translation',
    version: 'v3.0-int4',
    sizeMb: 52.4,
    quantization: 'INT4',
    languagePair: 'EN ↔ HI',
    status: 'offline_ready',
    memoryRequiredMb: 145,
    lastUpdated: '2026-10-18'
  },
  {
    id: 'nmt-marian-en-es',
    name: 'MarianMT Edge English ↔ Spanish',
    task: 'Translation',
    version: 'v2.9-int4',
    sizeMb: 49.2,
    quantization: 'INT4',
    languagePair: 'EN ↔ ES',
    status: 'offline_ready',
    memoryRequiredMb: 135,
    lastUpdated: '2026-10-12'
  },
  {
    id: 'lqv-qwen-edge-0.5b',
    name: 'Qwen2.5-Edge-0.5B-Quality-Judge',
    task: 'LLM Verifier',
    version: 'v1.4-q4_k_m',
    sizeMb: 285.0,
    quantization: 'INT4',
    languagePair: 'Multilingual Critique',
    status: 'offline_ready',
    memoryRequiredMb: 420,
    lastUpdated: '2026-10-20'
  },
  {
    id: 'tts-piper-vits-edge',
    name: 'Piper VITS Neural Synthesis',
    task: 'Text-to-Speech',
    version: 'v1.2-onnx',
    sizeMb: 24.8,
    quantization: 'INT8',
    languagePair: 'Multi-Voice Edge',
    status: 'offline_ready',
    memoryRequiredMb: 65,
    lastUpdated: '2026-10-08'
  },
  {
    id: 'nmt-nllb-600m-quant',
    name: 'NLLB-200 MoE Heavy Edge',
    task: 'Translation',
    version: 'v1.0-fp16',
    sizeMb: 480.0,
    quantization: 'FP16',
    languagePair: '200+ Languages',
    status: 'available',
    memoryRequiredMb: 750,
    lastUpdated: '2026-09-30'
  }
];

export const INITIAL_GLOSSARY: GlossaryItem[] = [
  {
    id: 'gl-1',
    term: 'Amoxicillin',
    sourceLang: 'en',
    targetLang: 'hi',
    preferredTranslation: 'एमोक्सिसिलिन (Amoxicillin एंटीबायोटिक)',
    category: 'medical',
    notes: 'Preserve brand and generic medical dosage context',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'gl-2',
    term: 'Transformer T-42',
    sourceLang: 'en',
    targetLang: 'hi',
    preferredTranslation: 'ट्रांसफार्मर T-42',
    category: 'tech',
    notes: 'Do not translate equipment ID code',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'gl-3',
    term: 'Emergency shutdown',
    sourceLang: 'en',
    targetLang: 'hi',
    preferredTranslation: 'आपातकालीन शटडाउन (तुरंत बंद करना)',
    category: 'tech',
    notes: 'High urgency safety directive',
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'gl-4',
    term: 'Do not exceed',
    sourceLang: 'en',
    targetLang: 'es',
    preferredTranslation: 'No exceda bajo ninguna circunstancia',
    category: 'medical',
    notes: 'Crucial negation reinforcement for pediatric prescriptions',
    createdAt: Date.now() - 86400000 * 4
  }
];

export const BENCHMARK_DATASET: BenchmarkSample[] = [
  {
    id: 'bench-1',
    domain: 'medical',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Administer 250 milligrams of Amoxicillin every 8 hours with water. Do not exceed 750 milligrams in 24 hours.',
    referenceTranslation: 'पानी के साथ हर 8 घंटे में 250 मिलीग्राम एमोक्सिसिलिन दें। 24 घंटों में 750 मिलीग्राम से अधिक न लें।'
  },
  {
    id: 'bench-2',
    domain: 'medical',
    sourceLang: 'es',
    targetLang: 'en',
    sourceText: 'Tengo un dolor opresivo muy fuerte en el pecho que se irradia hacia mi brazo izquierdo. No puedo respirar bien y soy alérgico a la penicilina.',
    referenceTranslation: 'I have a very severe squeezing pain in my chest radiating to my left arm. I cannot breathe properly and I am allergic to penicillin.'
  },
  {
    id: 'bench-3',
    domain: 'tech',
    sourceLang: 'de',
    targetLang: 'en',
    sourceText: 'Achtung: Der Transformator T-42 überhitzt bei 140 Grad Celsius. Die Notabschaltung muss innerhalb von 90 Sekunden eingeleitet werden.',
    referenceTranslation: 'Warning: Transformer T-42 is overheating at 140 degrees Celsius. Emergency shutdown must be initiated within 90 seconds.'
  },
  {
    id: 'bench-4',
    domain: 'disaster',
    sourceLang: 'ja',
    targetLang: 'en',
    sourceText: '地下室に3人が閉じ込められています。意識はありますが、ガスの臭いが漂っており、迅速な救出が必要です。',
    referenceTranslation: 'Three people are trapped in the basement. They are conscious, but gas odor is present and immediate rescue is required.'
  },
  {
    id: 'bench-5',
    domain: 'travel',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Please show me the nearest medical evacuation zone and international emergency shelter.',
    referenceTranslation: 'कृपया मुझे निकटतम चिकित्सा निकासी क्षेत्र और अंतर्राष्ट्रीय आपातकालीन आश्रय दिखाएं।'
  }
];

export const INITIAL_BENCHMARK_HISTORY: BenchmarkRun[] = [
  {
    id: 'run-101',
    timestamp: Date.now() - 86400000 * 2,
    modelProfile: 'Edge INT4 Turbo (Whisper-Tiny + MarianMT + Qwen-0.5B)',
    quantization: 'INT4',
    languagePair: 'EN ↔ HI / ES / DE',
    sampleCount: 5,
    avgLatencyMs: 345,
    avgBleuScore: 48.7,
    avgLqvScore: 94.2,
    peakRamMb: 365,
    networkKb: 0,
    errorCount: 0,
    status: 'completed'
  },
  {
    id: 'run-102',
    timestamp: Date.now() - 86400000,
    modelProfile: 'Edge FP16 Deep Quality (Whisper-Base + NLLB-600M + Qwen-1.5B)',
    quantization: 'FP16',
    languagePair: 'EN ↔ HI / ES',
    sampleCount: 5,
    avgLatencyMs: 820,
    avgBleuScore: 53.2,
    avgLqvScore: 97.4,
    peakRamMb: 780,
    networkKb: 0,
    errorCount: 0,
    status: 'completed'
  }
];
