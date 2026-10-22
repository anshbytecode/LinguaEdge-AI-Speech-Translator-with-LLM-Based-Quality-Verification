import { PhrasebookItem } from '../types';

export const INITIAL_PHRASEBOOK: PhrasebookItem[] = [
  // Medical & Triage Emergency Phrases
  {
    id: 'ph-1',
    category: 'medical',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Where does it hurt? Point to the pain.',
    translatedText: 'कहाँ दर्द हो रहा है? दर्द वाली जगह पर इशारा करें।',
    phoneticGuide: 'Kahaan dard ho raha hai? Dard waali jagah par ishara karein.',
    isEmergency: true
  },
  {
    id: 'ph-2',
    category: 'medical',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Are you allergic to penicillin or any medications?',
    translatedText: 'क्या आपको पेनिसिलिन या किसी दवा से एलर्जी है?',
    phoneticGuide: 'Kya aapko penicillin ya kisi dawa se allergy hai?',
    isEmergency: true
  },
  {
    id: 'ph-3',
    category: 'medical',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Administer 250 milligrams with water. Do not exceed 750 milligrams.',
    translatedText: 'पानी के साथ 250 मिलीग्राम लें। 750 मिलीग्राम से अधिक न लें।',
    phoneticGuide: 'Paani ke saath 250 miligram lein. 750 miligram se adhik na lein.',
    isEmergency: true
  },
  {
    id: 'ph-4',
    category: 'medical',
    sourceLang: 'en',
    targetLang: 'es',
    sourceText: 'Where does it hurt? Take deep breaths.',
    translatedText: '¿Dónde le duele? Respire profundamente.',
    phoneticGuide: '¿Dónde le duele? Respire profundamente.',
    isEmergency: true
  },
  // Disaster Relief & Evacuation
  {
    id: 'ph-5',
    category: 'disaster',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Evacuate immediately. Follow the emergency rescue team.',
    translatedText: 'तुरंत खाली करें। आपातकालीन बचाव दल के पीछे चलें।',
    phoneticGuide: 'Turant khaali karein. Aapaatkaleen bachaav dal ke peeche chalein.',
    isEmergency: true
  },
  {
    id: 'ph-6',
    category: 'disaster',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Is anyone trapped under the rubble or building collapse?',
    translatedText: 'क्या मलबे या इमारत के मलबे के नीचे कोई फंसा हुआ है?',
    phoneticGuide: 'Kya malbe ya imaarat ke malbe ke neeche koi phansa hua hai?',
    isEmergency: true
  },
  // Travel & Checkpoints
  {
    id: 'ph-7',
    category: 'travel',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Please show your passport and international quarantine declaration.',
    translatedText: 'कृपया अपना पासपोर्ट और अंतर्राष्ट्रीय क्वारंटाइन घोषणा दिखाएं।',
    phoneticGuide: 'Kripya apna passport aur antarraashtriya quarantine ghoshana dikhayein.',
    isEmergency: false
  },
  // Tech & High-Voltage Engineering
  {
    id: 'ph-8',
    category: 'tech',
    sourceLang: 'en',
    targetLang: 'hi',
    sourceText: 'Transformer T-42 thermal overload warning: initiate emergency shutdown.',
    translatedText: 'ट्रांसफार्मर T-42 थर्मल ओवरलोड चेतावनी: आपातकालीन शटडाउन शुरू करें।',
    phoneticGuide: 'Transformer T-42 thermal overload chetavni: aapaatkaleen shutdown shuru karein.',
    isEmergency: true
  }
];
