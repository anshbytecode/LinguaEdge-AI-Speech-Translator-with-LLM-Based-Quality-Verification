import { DomainType, GlossaryItem } from '../types';

// Multilingual lexicon matrix for offline edge translation
const LEXICON_DATABASE: Record<string, Record<string, string>> = {
  // English to Hindi
  'en-hi': {
    'hello': 'नमस्ते (Namaste)',
    'please': 'कृपया',
    'help': 'मदद',
    'emergency': 'आपातकालीन',
    'danger': 'खतरा',
    'hospital': 'अस्पताल',
    'doctor': 'डॉक्टर',
    'water': 'पानी',
    'medicine': 'दवा',
    'pain': 'दर्द',
    'chest': 'छाती',
    'chest pain': 'छाती में दर्द',
    'i have': 'मुझे है',
    'fever': 'बुखार',
    'blood': 'खून',
    'administer': 'दें',
    '250 milligrams': '250 मिलीग्राम',
    'amoxicillin': 'एमोक्सिसिलिन (Amoxicillin)',
    'every 8 hours': 'हर 8 घंटे में',
    'with water': 'पानी के साथ',
    'do not exceed': 'इससे अधिक न लें',
    '750 milligrams': '750 मिलीग्राम',
    'in 24 hours': '24 घंटों में',
    'evacuate immediately': 'तुरंत खाली करें',
    'transformer t-42': 'ट्रांसफार्मर T-42',
    'overheating': 'अत्यधिक गर्म हो रहा है',
    'emergency shutdown': 'आपातकालीन शटडाउन'
  },
  // Hindi to English
  'hi-en': {
    'नमस्ते': 'hello',
    'कृपया मेरी मदद करें': 'please help me',
    'मुझे डॉक्टर की जरूरत है': 'I need a doctor',
    'अस्पताल कहाँ है': 'where is the hospital?',
    'आपातकालीन स्थिति': 'emergency situation',
    'यहाँ खतरा है': 'there is danger here',
    'मुझे छाती में बहुत दर्द है': 'I have severe pain in my chest',
    'सांस लेने में तकलीफ': 'difficulty breathing',
    'दवा चाहिए': 'need medication'
  },
  // Spanish to English
  'es-en': {
    'tengo': 'I have',
    'un dolor': 'a pain',
    'opresivo': 'pressing / squeezing',
    'muy fuerte': 'very severe',
    'en el pecho': 'in the chest',
    'que se irradia': 'radiating',
    'hacia mi brazo izquierdo': 'to my left arm',
    'no puedo respirar': 'I cannot breathe',
    'bien': 'properly',
    'y soy alérgico': 'and I am allergic',
    'a la penicilina': 'to penicillin',
    'hola': 'hello',
    'por favor': 'please',
    'ayuda': 'help',
    'dónde está': 'where is',
    'el hospital': 'the hospital',
    'médico': 'doctor',
    'medicamento': 'medication',
    'fiebre': 'fever',
    'sangre': 'blood',
    'emergencia': 'emergency',
    'agua': 'water',
    'comida': 'food',
    'refugio': 'shelter',
    'peligro': 'danger',
    'estoy herido': 'I am injured',
    'necesito una ambulancia': 'I need an ambulance'
  },
  // English to Spanish
  'en-es': {
    'i have': 'tengo',
    'a very severe pressing pain': 'un dolor opresivo muy fuerte',
    'in my chest': 'en el pecho',
    'radiating to my left arm': 'irradiándose hacia mi brazo izquierdo',
    'i cannot breathe properly': 'no puedo respirar bien',
    'and i am allergic to penicillin': 'y soy alérgico a la penicilina',
    'administer exactly': 'administre exactamente',
    '250 milligrams': '250 miligramos',
    'of amoxicillin': 'de amoxicilina',
    'every 8 hours': 'cada 8 horas',
    'with water': 'con agua',
    'do not exceed': 'no exceda',
    '750 milligrams': '750 miligramos',
    'in 24 hours': 'en 24 horas',
    'hello': 'hola',
    'please': 'por favor',
    'help': 'ayuda',
    'where is': 'dónde está',
    'the hospital': 'el hospital',
    'emergency': 'emergencia',
    'danger': 'peligro',
    'take this medication': 'tome este medicamento',
    'stay calm': 'mantenga la calma',
    'evacuate immediately': 'evacúe de inmediato'
  },
  // Japanese to English
  'ja-en': {
    '地下室に': 'in the basement',
    '3人が閉じ込められています': '3 people are trapped',
    '意識はありますが': 'they are conscious, but',
    'ガスの臭いが漂っており': 'there is a smell of gas',
    '迅速な救出が必要です': 'and immediate extraction is required',
    'こんにちは': 'hello',
    '助けてください': 'please help',
    '避難してください': 'please evacuate',
    '病院はどこですか': 'where is the hospital?',
    '怪我をしています': 'I am injured',
    '危険です': 'it is dangerous'
  },
  // French to English
  'fr-en': {
    'mon sac diplomatique': 'my diplomatic bag',
    'contenant mon passeport': 'containing my passport',
    'et mes autorisations d’accès sécurisé': 'and my high-security clearance credentials',
    'a été dérobé': 'was stolen',
    'à la gare centrale': 'at the central station',
    'bonjour': 'hello',
    's’il vous plaît': 'please',
    'au secours': 'help',
    'urgence': 'emergency',
    'où est l’ambassade': 'where is the embassy?',
    'je suis blessé': 'I am injured'
  },
  // German to English
  'de-en': {
    'achtung:': 'attention:',
    'der transformator t-42 überhitzt': 'transformer T-42 is overheating',
    'bei 140 grad celsius': 'at 140 degrees Celsius',
    'die notabschaltung muss': 'emergency shutdown must',
    'innerhalb von 90 sekunden': 'within 90 seconds',
    'eingeleitet werden': 'be initiated',
    'hallo': 'hello',
    'hilfe': 'help',
    'gefahr': 'danger',
    'krankenhaus': 'hospital',
    'bitte sofort evakuieren': 'please evacuate immediately'
  },
  // Chinese to English
  'zh-en': {
    '我随身行李中有': 'in my carry-on luggage I have',
    '供个人使用的干草药': 'dried herbs for personal use',
    '和密封种子': 'and sealed seeds',
    '我需要向海关检疫人员主动申报': 'I need to declare them to customs quarantine',
    '你好': 'hello',
    '请帮助我': 'please help me',
    '洗手间在哪里': 'where is the restroom?',
    '紧急情况': 'emergency',
    '我需要医生': 'I need a doctor'
  }
};

/**
 * Phonetic transliteration helper for non-Latin scripts
 */
export function getPhoneticGuide(text: string, langCode: string): string | undefined {
  if (langCode === 'hi') {
    if (text.includes('एमोक्सिसिलिन')) return 'Paani ke saath har aath ghante mein 250 miligram Amoxicillin dein. Chaubees ghanto mein...';
    if (text.includes('नमस्ते')) return 'Namaste, kripya meri madad karein.';
    return 'Kripya aapaatkaleen nirdeshon ka paalan karein.';
  }
  if (langCode === 'ja') {
    if (text.includes('地下室')) return 'Chikashitsu ni 3-nin ga tojikome rarete imasu. Ishiki wa arimasu ga...';
    return 'Konnichiwa, tasukete kudasai.';
  }
  if (langCode === 'zh') {
    if (text.includes('行李')) return 'Wǒ suíshēn xínglǐ zhōng yǒu gōng gèrén shǐyòng de gān cǎoyào...';
    return 'Nǐ hǎo, qǐng bāngzhù wǒ.';
  }
  if (langCode === 'ar') {
    return 'Marhaban, ahtaju ila musa\'adah fi haalati tawari\'.';
  }
  return undefined;
}

/**
 * Simple client-side language detection heuristic
 */
export function detectLanguage(text: string): string {
  const t = text.trim();
  if (/[\u0900-\u097F]/.test(t)) return 'hi'; // Devanagari (Hindi)
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(t)) {
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(t)) return 'ja'; // Japanese Kana
    return 'zh'; // Chinese
  }
  if (/[\u0600-\u06FF]/.test(t)) return 'ar'; // Arabic
  if (/[\u0400-\u04FF]/.test(t)) return 'ru'; // Russian Cyrillic
  if (/\b(tengo|dolor|pecho|brazo|respirar|hola|por favor|ayuda)\b/i.test(t)) return 'es';
  if (/\b(bonjour|merci|dérobé|passeport|urgence|suis)\b/i.test(t)) return 'fr';
  if (/\b(achtung|überhitzt|notabschaltung|hilfe|krankenhaus)\b/i.test(t)) return 'de';
  return 'en';
}

/**
 * Extracts key numerical, dosage, and warning entities that must never be altered or dropped
 */
export function extractCriticalEntities(text: string): string[] {
  const entities: string[] = [];
  
  // Numbers & measurements (e.g. 250 mg, 140°C, 3 people, 90 seconds, T-42)
  const numbersWithUnits = text.match(/\b\d+(\.\d+)?\s*(mg|milligrams|miligramos|mili|hours|horas|sekunden|seconds|grad|celsius|°C|people|人)?\b/gi);
  if (numbersWithUnits) {
    numbersWithUnits.forEach(match => {
      if (match.trim().length > 0) entities.push(match.trim());
    });
  }

  // Model codes / IDs like T-42, COVID-19, etc.
  const codeMatches = text.match(/\b[A-Z]+-\d+\b/g);
  if (codeMatches) {
    codeMatches.forEach(c => entities.push(c));
  }

  // Negations (critical for medical/disaster safety)
  const negations = text.match(/\b(not|never|no|cannot|do not|ne pas|nicht|नहीं|मत|बिल्कुल नहीं|いいえ)\b/gi);
  if (negations) {
    entities.push(...negations.map(n => `[Negation: ${n.toLowerCase()}]`));
  }

  return Array.from(new Set(entities));
}

/**
 * Offline Edge Neural Machine Translation Simulation.
 * Supports custom glossaries, speed vs quality quantization modes,
 * back-translation, and entity preservation.
 */
export async function executeEdgeTranslation(
  sourceText: string,
  sourceLang: string,
  targetLang: string,
  domain: DomainType,
  glossary: GlossaryItem[] = [],
  processingMode: 'speed' | 'quality' = 'speed'
): Promise<{
  initialTranslation: string;
  translatedText: string;
  backTranslation: string;
  sourceEntities: string[];
  latencyMs: number;
}> {
  const startTime = performance.now();
  const trimmed = sourceText.trim();
  const lower = trimmed.toLowerCase();

  // Simulated latency reflecting quantized Edge model inference
  const simulatedDelay = processingMode === 'speed' 
    ? 70 + Math.random() * 50 
    : 160 + Math.random() * 90;
  await new Promise(resolve => setTimeout(resolve, simulatedDelay));

  let translated = '';

  // 1. High-accuracy preset scenario matches
  if (sourceLang === 'en' && targetLang === 'hi') {
    if (lower.includes('amoxicillin') || lower.includes('250 milligrams') || lower.includes('administer')) {
      translated = 'पानी के साथ हर 8 घंटे में ठीक 250 मिलीग्राम एमोक्सिसिलिन दें। 24 घंटों में 750 मिलीग्राम से अधिक न लें।';
    } else if (lower.includes('transformer t-42') || lower.includes('overheating')) {
      translated = 'सावधान: ट्रांसफार्मर T-42 140 डिग्री सेल्सियस पर अत्यधिक गर्म हो रहा है। आपातकालीन शटडाउन 90 सेकंड के भीतर शुरू किया जाना चाहिए।';
    } else if (lower.includes('chest pain') || lower.includes('severe pain')) {
      translated = 'मुझे छाती में बहुत तेज दर्द हो रहा है जो बाएं हाथ की तरफ फैल रहा है।';
    } else {
      translated = `पानी और भोजन के साथ यह दवा लें। [Hindi अनुवादित]: ${trimmed}`;
    }
  } else if (sourceLang === 'hi' && targetLang === 'en') {
    if (lower.includes('छाती में बहुत दर्द') || lower.includes('दर्द')) {
      translated = 'I have a very severe pressing chest pain radiating to my left arm. I need emergency medical attention.';
    } else if (lower.includes('डॉक्टर की जरूरत')) {
      translated = 'I need a doctor urgently. Where is the nearest hospital?';
    } else {
      translated = `[EN Translated from Hindi]: ${trimmed}`;
    }
  } else if (sourceLang === 'es' && targetLang === 'en') {
    if (lower.includes('dolor opresivo')) {
      translated = 'I have a very severe pressing pain in my chest radiating to my left arm. I cannot breathe properly and I am allergic to penicillin.';
    } else {
      translated = `I have medical symptoms: ${trimmed}`;
    }
  } else if (sourceLang === 'en' && targetLang === 'es') {
    if (lower.includes('amoxicillin') || lower.includes('250 milligrams')) {
      translated = 'Administre exactamente 250 miligramos de amoxicilina cada 8 horas con agua. No exceda los 750 miligramos en 24 horas.';
    } else {
      translated = `[ES Traducido]: ${trimmed}`;
    }
  } else if (sourceLang === 'de' && targetLang === 'en') {
    if (lower.includes('transformator t-42')) {
      translated = 'Attention: Transformer T-42 is overheating at 140 degrees Celsius. Emergency shutdown must be initiated within 90 seconds.';
    } else {
      translated = `[EN Translated]: ${trimmed}`;
    }
  } else if (sourceLang === 'ja' && targetLang === 'en') {
    if (lower.includes('地下室')) {
      translated = 'Three people are trapped in the basement. They are conscious, but there is a smell of gas and immediate extraction is required.';
    } else {
      translated = `[EN Translated]: ${trimmed}`;
    }
  } else if (sourceLang === 'fr' && targetLang === 'en') {
    if (lower.includes('sac diplomatique')) {
      translated = 'My diplomatic bag containing my passport and high-security clearance credentials was stolen at the central station.';
    } else {
      translated = `[EN Translated]: ${trimmed}`;
    }
  } else {
    // General token-wise translation lookup
    const pairKey = `${sourceLang}-${targetLang}`;
    const dict = LEXICON_DATABASE[pairKey] || {};
    let workingText = trimmed;

    for (const [phrase, trans] of Object.entries(dict)) {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      if (regex.test(workingText)) {
        workingText = workingText.replace(regex, trans);
      }
    }
    translated = workingText !== trimmed ? workingText : `[${targetLang.toUpperCase()} Translated]: ${trimmed}`;
  }

  // 2. Custom Glossary substitutions override
  const relevantGlossary = glossary.filter(g => g.sourceLang === sourceLang && g.targetLang === targetLang);
  relevantGlossary.forEach(item => {
    const termRegex = new RegExp(`\\b${item.term}\\b`, 'gi');
    if (termRegex.test(sourceText)) {
      // Ensure the preferred translation is preserved in the target
      if (!translated.includes(item.preferredTranslation)) {
        translated = translated.replace(new RegExp(item.term, 'gi'), item.preferredTranslation);
      }
    }
  });

  const initialTranslation = translated;

  // 3. Generate Back-Translation for round-trip LLM verification
  let backTranslation = '';
  if (sourceLang === 'en' && targetLang === 'hi') {
    if (translated.includes('एमोक्सिसिलिन')) {
      backTranslation = 'Administer 250 milligrams of Amoxicillin every 8 hours with water. Do not take more than 750 milligrams in 24 hours.';
    } else if (translated.includes('ट्रांसफार्मर T-42')) {
      backTranslation = 'Attention: Transformer T-42 is overheating at 140 degrees Celsius. Emergency shutdown must be initiated within 90 seconds.';
    } else {
      backTranslation = sourceText;
    }
  } else if (sourceLang === 'es' && targetLang === 'en') {
    backTranslation = 'Tengo un dolor opresivo muy fuerte en el pecho que se irradia hacia mi brazo izquierdo. No puedo respirar bien y soy alérgico a la penicilina.';
  } else if (sourceLang === 'de' && targetLang === 'en') {
    backTranslation = 'Achtung: Der Transformator T-42 überhitzt bei 140 Grad Celsius. Die Notabschaltung muss in 90 Sekunden eingeleitet werden.';
  } else {
    backTranslation = sourceText;
  }

  const entities = extractCriticalEntities(sourceText);
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    initialTranslation,
    translatedText: translated,
    backTranslation,
    sourceEntities: entities,
    latencyMs
  };
}
