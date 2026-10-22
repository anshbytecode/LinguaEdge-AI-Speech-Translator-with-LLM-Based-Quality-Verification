import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'med-cardiac-emergency',
    title: 'Severe Chest Pain & Medication Triage',
    category: 'medical',
    sourceLang: 'es',
    targetLang: 'en',
    urgency: 'critical',
    description: 'Patient in field clinic reporting acute angina with severe hypertension and penicillin allergy.',
    sourceText: 'Tengo un dolor opresivo muy fuerte en el pecho que se irradia hacia mi brazo izquierdo. No puedo respirar bien y soy alérgico a la penicilina.',
    expectedTranslation: 'I have a very severe pressing pain in my chest radiating to my left arm. I cannot breathe properly and I am allergic to penicillin.',
    keyEntities: ['pecho / chest', 'brazo izquierdo / left arm', 'penicilina / penicillin', 'no puedo respirar / cannot breathe']
  },
  {
    id: 'disaster-building-collapse',
    title: 'Post-Earthquake Survivor Extraction',
    category: 'disaster',
    sourceLang: 'ja',
    targetLang: 'en',
    urgency: 'critical',
    description: 'First responders locating trapped individuals underneath rubble with gas leak suspicion.',
    sourceText: '地下室に3人が閉じ込められています。意識はありますが、ガスの臭いが漂っており、迅速な救出が必要です。',
    expectedTranslation: 'Three people are trapped in the basement. They are conscious, but there is a strong smell of gas and immediate extraction is required.',
    keyEntities: ['3人 / 3 people', '地下室 / basement', 'ガス / gas leak', '迅速な救出 / immediate extraction']
  },
  {
    id: 'travel-lost-passport-embassy',
    title: 'Stolen Diplomatic Bag & Border Clearance',
    category: 'diplomatic',
    sourceLang: 'fr',
    targetLang: 'en',
    urgency: 'high',
    description: 'Traveler reporting stolen transit documents and diplomatic visa credentials at checkpoint.',
    sourceText: 'Mon sac diplomatique contenant mon passeport et mes autorisations d’accès sécurisé a été dérobé à la gare centrale.',
    expectedTranslation: 'My diplomatic bag containing my passport and high-security clearance credentials was stolen at the central station.',
    keyEntities: ['sac diplomatique / diplomatic bag', 'passeport / passport', 'gare centrale / central station']
  },
  {
    id: 'tech-high-voltage-failure',
    title: 'Substation Transformer Overheating Alert',
    category: 'tech',
    sourceLang: 'de',
    targetLang: 'en',
    urgency: 'high',
    description: 'Field engineer warning of critical 140°C thermal overload in turbine cooling circuit.',
    sourceText: 'Achtung: Der Transformator T-42 überhitzt bei 140 Grad Celsius. Die Notabschaltung muss innerhalb von 90 Sekunden eingeleitet werden.',
    expectedTranslation: 'Attention: Transformer T-42 is overheating at 140 degrees Celsius. Emergency shutdown must be initiated within 90 seconds.',
    keyEntities: ['Transformator T-42 / Transformer T-42', '140 Grad Celsius / 140°C', '90 Sekunden / 90 seconds', 'Notabschaltung / Emergency shutdown']
  },
  {
    id: 'med-pediatric-dosage',
    title: 'Pediatric Antibiotic Dosage Verification',
    category: 'medical',
    sourceLang: 'en',
    targetLang: 'es',
    urgency: 'critical',
    description: 'Pediatrician prescribing exact dosage with strict warning against exceeding limits.',
    sourceText: 'Administer exactly 250 milligrams of Amoxicillin every 8 hours with water. Do not exceed 750 milligrams in 24 hours.',
    expectedTranslation: 'Administre exactamente 250 miligramos de amoxicilina cada 8 horas con agua. No exceda los 750 miligramos en 24 horas.',
    keyEntities: ['250 milligrams / 250 miligramos', '8 hours / 8 horas', '750 milligrams / 750 miligramos', 'Do not exceed / No exceda']
  },
  {
    id: 'travel-customs-inquiry',
    title: 'Biosecurity & Agricultural Declaration',
    category: 'travel',
    sourceLang: 'zh',
    targetLang: 'en',
    urgency: 'routine',
    description: 'Airport passenger carrying packaged seeds and medicinal dried herbs requiring inspection.',
    sourceText: '我随身行李中有供个人使用的干草药和密封种子，我需要向海关检疫人员主动申报。',
    expectedTranslation: 'I have dried herbs and sealed seeds for personal use in my carry-on luggage, and I need to declare them to customs quarantine.',
    keyEntities: ['干草药 / dried herbs', '密封种子 / sealed seeds', '海关检疫 / customs quarantine']
  }
];
