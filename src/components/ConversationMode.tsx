import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  UserCheck,
  Send
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { DomainType } from '../types';
import { executeEdgeTranslation } from '../services/edgeTranslationEngine';
import { verifyTranslationQuality } from '../services/llmQualityVerifier';

interface ConversationTurn {
  id: string;
  speaker: 'A' | 'B';
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  grade: string;
  score: number;
  timestamp: string;
}

interface ConversationModeProps {
  currentDomain: DomainType;
  onSpeak: (text: string, locale: string) => void;
  isSpeaking: boolean;
}

export const ConversationMode: React.FC<ConversationModeProps> = ({
  currentDomain,
  onSpeak,
  isSpeaking
}) => {
  const [speakerALang, setSpeakerALang] = useState<string>('en');
  const [speakerBLang, setSpeakerBLang] = useState<string>('es');
  const [inputA, setInputA] = useState<string>('');
  const [inputB, setInputB] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [dialogue, setDialogue] = useState<ConversationTurn[]>([
    {
      id: 'turn-1',
      speaker: 'A',
      sourceText: 'Hello, can you tell me where it hurts and when the pain started?',
      translatedText: 'Hola, ¿puede decirme dónde le duele y cuándo empezó el dolor?',
      sourceLang: 'en',
      targetLang: 'es',
      grade: 'A+',
      score: 98,
      timestamp: '10:42 AM'
    },
    {
      id: 'turn-2',
      speaker: 'B',
      sourceText: 'Tengo un dolor muy fuerte en el pecho que empezó hace dos horas.',
      translatedText: 'I have a very severe pain in my chest that started two hours ago.',
      sourceLang: 'es',
      targetLang: 'en',
      grade: 'A+',
      score: 97,
      timestamp: '10:43 AM'
    }
  ]);

  const langAObj = SUPPORTED_LANGUAGES.find(l => l.code === speakerALang) || SUPPORTED_LANGUAGES[0];
  const langBObj = SUPPORTED_LANGUAGES.find(l => l.code === speakerBLang) || SUPPORTED_LANGUAGES[1];

  const handleSendA = async () => {
    if (!inputA.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const trans = await executeEdgeTranslation(inputA, speakerALang, speakerBLang, currentDomain);
      const lqv = await verifyTranslationQuality(
        inputA, 
        trans.translatedText, 
        trans.backTranslation, 
        speakerALang, 
        speakerBLang, 
        currentDomain, 
        trans.sourceEntities
      );

      const newTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'A',
        sourceText: inputA,
        translatedText: trans.translatedText,
        sourceLang: speakerALang,
        targetLang: speakerBLang,
        grade: lqv.grade,
        score: lqv.overallScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDialogue(prev => [...prev, newTurn]);
      setInputA('');
      // Auto-speak translated output to Speaker B
      onSpeak(trans.translatedText, langBObj.speechLocale);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendB = async () => {
    if (!inputB.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const trans = await executeEdgeTranslation(inputB, speakerBLang, speakerALang, currentDomain);
      const lqv = await verifyTranslationQuality(
        inputB, 
        trans.translatedText, 
        trans.backTranslation, 
        speakerBLang, 
        speakerALang, 
        currentDomain, 
        trans.sourceEntities
      );

      const newTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'B',
        sourceText: inputB,
        translatedText: trans.translatedText,
        sourceLang: speakerBLang,
        targetLang: speakerALang,
        grade: lqv.grade,
        score: lqv.overallScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDialogue(prev => [...prev, newTurn]);
      setInputB('');
      // Auto-speak translated output to Speaker A
      onSpeak(trans.translatedText, langAObj.speechLocale);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Two-Way Conversational Dialogue
            </h2>
            <span className="badge badge-cyan">Walkie-Talkie Mode</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Simultaneous face-to-face cross-language dialogue with real-time LLM quality verification
          </p>
        </div>

        {/* Language Pair Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Speaker A: {langAObj.flag} {langAObj.name}
          </div>
          <ArrowRightLeft size={16} color="var(--text-muted)" />
          <div className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Speaker B: {langBObj.flag} {langBObj.name}
          </div>
        </div>
      </div>

      {/* Dialogue Chat Stream */}
      <div 
        style={{
          minHeight: '360px',
          maxHeight: '440px',
          overflowY: 'auto',
          background: 'var(--bg-input)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {dialogue.map(turn => {
          const isA = turn.speaker === 'A';
          return (
            <div
              key={turn.id}
              style={{
                alignSelf: isA ? 'flex-start' : 'flex-end',
                maxWidth: '82%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  alignSelf: isA ? 'flex-start' : 'flex-end',
                  fontSize: '0.72rem',
                  color: 'var(--text-faint)' 
                }}
              >
                <span>{isA ? `Speaker A (${langAObj.name})` : `Speaker B (${langBObj.name})`}</span>
                <span>• {turn.timestamp}</span>
                <span className={`badge ${turn.score >= 90 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  Grade {turn.grade} ({turn.score}%)
                </span>
              </div>

              <div
                style={{
                  background: isA 
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(13, 19, 36, 0.9) 100%)' 
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(13, 19, 36, 0.9) 100%)',
                  border: isA ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: isA ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                  padding: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                {/* Original utterance */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.35rem' }}>
                  "{turn.sourceText}"
                </div>

                {/* Translated output */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.975rem', fontWeight: 600, color: '#ffffff' }}>
                    {turn.translatedText}
                  </div>
                  <button
                    onClick={() => onSpeak(turn.translatedText, isA ? langBObj.speechLocale : langAObj.speechLocale)}
                    disabled={isSpeaking}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '6px' }}
                    title="Play Audio"
                  >
                    <Volume2 size={14} color="var(--cyan-bright)" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Input Controls: Speaker A (Left) & Speaker B (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Speaker A input */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
              SPEAKER A ({langAObj.flag} {langAObj.name})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Translates to {langBObj.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendA()}
              placeholder="Type or click send..."
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendA}
              disabled={!inputA.trim() || isProcessing}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1rem' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Speaker B input */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple-accent)' }}>
              SPEAKER B ({langBObj.flag} {langBObj.name})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Translates to {langAObj.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendB()}
              placeholder="Escriba o presione enviar..."
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendB}
              disabled={!inputB.trim() || isProcessing}
              className="btn btn-accent"
              style={{ padding: '0.55rem 1rem' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
