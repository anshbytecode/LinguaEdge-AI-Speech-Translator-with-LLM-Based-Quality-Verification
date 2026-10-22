import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Mic, 
  Volume2, 
  Send, 
  Sparkles, 
  Captions, 
  User, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../data/languages';
import { DomainType } from '../types';
import { executeEdgeTranslation } from '../services/edgeTranslationEngine';
import { verifyTranslationQuality } from '../services/llmQualityVerifier';
import { ttsService } from '../services/speechSynthesisService';

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

interface ConversationViewProps {
  currentDomain: DomainType;
}

export const ConversationView: React.FC<ConversationViewProps> = ({ currentDomain }) => {
  const [langA, setLangA] = useState('en');
  const [langB, setLangB] = useState('hi');
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [showLiveCaptions, setShowLiveCaptions] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [dialogue, setDialogue] = useState<ConversationTurn[]>([
    {
      id: 'turn-1',
      speaker: 'A',
      sourceText: 'Hello, please take 250 milligrams of this medicine with water.',
      translatedText: 'नमस्ते, कृपया पानी के साथ इस दवा की 250 मिलीग्राम लें।',
      sourceLang: 'en',
      targetLang: 'hi',
      grade: 'A+',
      score: 98,
      timestamp: '10:45 AM'
    },
    {
      id: 'turn-2',
      speaker: 'B',
      sourceText: 'धन्यवाद डॉक्टर, क्या मुझे इसे भोजन से पहले या बाद में लेना चाहिए?',
      translatedText: 'Thank you doctor, should I take this before or after meals?',
      sourceLang: 'hi',
      targetLang: 'en',
      grade: 'A+',
      score: 96,
      timestamp: '10:46 AM'
    }
  ]);

  const langAObj = getLanguageByCode(langA);
  const langBObj = getLanguageByCode(langB);

  const handleSwapRoles = () => {
    const temp = langA;
    setLangA(langB);
    setLangB(temp);
  };

  const handleSendA = async () => {
    if (!inputA.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const trans = await executeEdgeTranslation(inputA, langA, langB, currentDomain);
      const lqv = await verifyTranslationQuality(
        inputA, trans.translatedText, trans.backTranslation, langA, langB, currentDomain, trans.sourceEntities
      );

      const newTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'A',
        sourceText: inputA,
        translatedText: trans.translatedText,
        sourceLang: langA,
        targetLang: langB,
        grade: lqv.grade,
        score: lqv.overallScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDialogue(prev => [...prev, newTurn]);
      setInputA('');
      ttsService.speak(trans.translatedText, langBObj.speechLocale);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendB = async () => {
    if (!inputB.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const trans = await executeEdgeTranslation(inputB, langB, langA, currentDomain);
      const lqv = await verifyTranslationQuality(
        inputB, trans.translatedText, trans.backTranslation, langB, langA, currentDomain, trans.sourceEntities
      );

      const newTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'B',
        sourceText: inputB,
        translatedText: trans.translatedText,
        sourceLang: langB,
        targetLang: langA,
        grade: lqv.grade,
        score: lqv.overallScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDialogue(prev => [...prev, newTurn]);
      setInputB('');
      ttsService.speak(trans.translatedText, langAObj.speechLocale);
    } finally {
      setIsProcessing(false);
    }
  };

  const latestTurn = dialogue[dialogue.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header with Language Role Swap & Subtitles Toggle */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Two-Way Conversational Speech Translation
            </h2>
            <span className="badge badge-cyan">Duplex Mode</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Bilingual walkie-talkie interface with instant translation and inline quality confidence stamps.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowLiveCaptions(!showLiveCaptions)}
            className={`btn ${showLiveCaptions ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
          >
            <Captions size={14} />
            <span>{showLiveCaptions ? 'Live Subtitles ON' : 'Subtitles OFF'}</span>
          </button>

          <button 
            onClick={handleSwapRoles}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            title="Swap Speaker A and B languages"
          >
            <ArrowRightLeft size={14} />
            <span>Swap Directions</span>
          </button>
        </div>
      </div>

      {/* 34. Live Subtitles Overlay Bar */}
      {showLiveCaptions && latestTurn && (
        <div style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--cyan-bright)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            LIVE STREAMING SUBTITLES • {latestTurn.speaker === 'A' ? `${langAObj.name} → ${langBObj.name}` : `${langBObj.name} → ${langAObj.name}`}
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff' }}>
            "{latestTurn.translatedText}"
          </div>
        </div>
      )}

      {/* Dialogue Turns Stream */}
      <div
        className="glass-panel"
        style={{
          minHeight: '360px',
          maxHeight: '420px',
          overflowY: 'auto',
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
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: isA ? 'flex-start' : 'flex-end', fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                <span>{isA ? `Speaker A (${langAObj.name})` : `Speaker B (${langBObj.name})`}</span>
                <span>• {turn.timestamp}</span>
                <span className={`badge ${turn.score >= 90 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  Grade {turn.grade} ({turn.score}%)
                </span>
              </div>

              <div
                style={{
                  background: isA 
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(13, 19, 36, 0.95) 100%)' 
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(13, 19, 36, 0.95) 100%)',
                  border: isA ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: isA ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                  padding: '1rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.35rem' }}>
                  "{turn.sourceText}"
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                    {turn.translatedText}
                  </div>
                  <button
                    onClick={() => ttsService.speak(turn.translatedText, isA ? langBObj.speechLocale : langAObj.speechLocale)}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '6px' }}
                    title="Play audio utterance"
                  >
                    <Volume2 size={13} color="var(--cyan-bright)" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Input Trays */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        
        {/* Speaker A */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
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
              placeholder={`Type in ${langAObj.name}...`}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                padding: '0.55rem 0.75rem',
                fontSize: '0.85rem',
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

        {/* Speaker B */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--purple-accent)' }}>
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
              placeholder={`Type in ${langBObj.name}...`}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                padding: '0.55rem 0.75rem',
                fontSize: '0.85rem',
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
