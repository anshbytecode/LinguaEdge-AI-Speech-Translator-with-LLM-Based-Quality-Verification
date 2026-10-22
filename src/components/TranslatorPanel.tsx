import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowRightLeft, 
  Sparkles, 
  FileText, 
  Play, 
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { PRESET_SCENARIOS } from '../data/presets';
import { DomainType, PresetScenario, TranslationSession } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { getPhoneticGuide } from '../services/edgeTranslationEngine';

interface TranslatorPanelProps {
  sourceLang: string;
  targetLang: string;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSwapLanguages: () => void;
  sourceText: string;
  onSourceTextChange: (text: string) => void;
  onTranslate: (textOverride?: string) => Promise<void>;
  isTranslating: boolean;
  currentSession: TranslationSession | null;
  onSpeak: (text: string, langLocale: string) => void;
  isSpeaking: boolean;
  currentDomain: DomainType;
  isRecording: boolean;
  onToggleRecording: () => void;
  analyserNode: AnalyserNode | null;
}

export const TranslatorPanel: React.FC<TranslatorPanelProps> = ({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onSwapLanguages,
  sourceText,
  onSourceTextChange,
  onTranslate,
  isTranslating,
  currentSession,
  onSpeak,
  isSpeaking,
  currentDomain,
  isRecording,
  onToggleRecording,
  analyserNode
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const currentSourceLangObj = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang) || SUPPORTED_LANGUAGES[0];
  const currentTargetLangObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[1];

  const filteredPresets = PRESET_SCENARIOS.filter(p => p.category === currentDomain || currentDomain === 'general');

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    onSourceLangChange(preset.sourceLang);
    onTargetLangChange(preset.targetLang);
    onSourceTextChange(preset.sourceText);
    // Automatically trigger translation and quality verification
    onTranslate(preset.sourceText);
  };

  const phonetic = currentSession ? getPhoneticGuide(currentSession.translatedText, targetLang) : undefined;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
      
      {/* LEFT COLUMN: Input Cockpit */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Language selector toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          
          {/* Source Lang */}
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
              Input Speech Language
            </label>
            <select
              value={sourceLang}
              onChange={(e) => onSourceLangChange(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={onSwapLanguages}
            className="btn btn-secondary"
            title="Swap Source and Target Languages"
            style={{ width: '40px', height: '40px', padding: 0, marginTop: '1.2rem', borderRadius: '10px' }}
          >
            <ArrowRightLeft size={16} />
          </button>

          {/* Target Lang */}
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
              Output Language
            </label>
            <select
              value={targetLang}
              onChange={(e) => onTargetLangChange(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Audio Visualizer */}
        <div>
          <AudioVisualizer
            isRecording={isRecording}
            isPlayingTTS={isSpeaking}
            analyserNode={analyserNode}
            height={85}
          />
        </div>

        {/* Text Input Area */}
        <div style={{ position: 'relative' }}>
          <textarea
            value={sourceText}
            onChange={(e) => onSourceTextChange(e.target.value)}
            placeholder={`Speak or type in ${currentSourceLangObj.name}... e.g. "Tengo dolor en el pecho" or choose a mission scenario below.`}
            rows={5}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: isRecording ? '1px solid var(--rose-danger)' : '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-body)',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.6,
              transition: 'border 0.2s ease'
            }}
          />
          {sourceText && (
            <button
              onClick={() => onSourceTextChange('')}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'var(--text-faint)',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Controls Bar: Mic Button + Translate Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={onToggleRecording}
              className={`btn btn-record ${isRecording ? 'recording' : ''}`}
              title={isRecording ? 'Stop Recording' : 'Start Microphone Speech Input'}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {isRecording ? 'Recording Speech...' : 'Microphone STT'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isRecording ? 'Click to finish' : 'Click to speak edge audio'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onTranslate()}
            disabled={!sourceText.trim() || isTranslating}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              opacity: !sourceText.trim() || isTranslating ? 0.6 : 1,
              cursor: !sourceText.trim() || isTranslating ? 'not-allowed' : 'pointer'
            }}
          >
            {isTranslating ? (
              <>
                <RotateCcw className="animate-spin" size={18} />
                <span>Edge NMT + Verifying...</span>
              </>
            ) : (
              <>
                <Zap size={18} />
                <span>Translate & Verify</span>
              </>
            )}
          </button>
        </div>

        {/* Mission-Critical Scenarios Tray */}
        <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Field Scenarios ({filteredPresets.length})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--cyan-bright)' }}>
              1-Click Speech Tests
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredPresets.slice(0, 3).map(preset => (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  background: selectedPresetId === preset.id ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedPresetId === preset.id ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {preset.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {preset.description}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className={`badge ${preset.urgency === 'critical' ? 'badge-rose' : 'badge-amber'}`}>
                    {preset.urgency}
                  </span>
                  <Play size={14} color="var(--cyan-bright)" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Output & Live Speech Playback */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Output Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>
              Edge Translated Output
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
              {currentTargetLangObj.flag} {currentTargetLangObj.name}
            </div>
          </div>

          {currentSession && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onSpeak(currentSession.translatedText, currentTargetLangObj.speechLocale)}
                disabled={isSpeaking}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
                title="Play Audio with Edge Text-to-Speech"
              >
                <Volume2 size={16} color="var(--cyan-bright)" />
                <span>{isSpeaking ? 'Speaking...' : 'Play TTS Voice'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Translation Output Box */}
        <div
          style={{
            minHeight: '170px',
            background: 'var(--bg-input)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          {currentSession ? (
            <div>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#ffffff', fontWeight: 500 }}>
                {currentSession.translatedText}
              </p>

              {phonetic && (
                <div style={{ marginTop: '0.85rem', padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '3px solid var(--purple-accent)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Phonetic Guide / Transliteration:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
                    {phonetic}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-faint)', textAlign: 'center', padding: '2rem 1rem' }}>
              <Sparkles size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Ready for offline translation & quality audit
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Press the microphone or select a mission scenario to begin
              </div>
            </div>
          )}

          {/* Quick Metrics Ribbon */}
          {currentSession && (
            <div 
              style={{ 
                marginTop: '1rem', 
                borderTop: '1px solid var(--border-subtle)', 
                paddingTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}
            >
              <div>
                NMT Latency: <span style={{ color: 'var(--cyan-bright)' }}>{currentSession.latencies.nmtMs}ms</span>
              </div>
              <div>
                LQV Latency: <span style={{ color: 'var(--purple-accent)' }}>{currentSession.latencies.lqvMs}ms</span>
              </div>
              <div>
                Total Edge Time: <span style={{ color: 'var(--emerald-safe)' }}>{currentSession.latencies.totalMs}ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Back-Translation Quick Peek */}
        {currentSession && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
                🔄 Round-Trip Back-Translation ({currentSession.verification.backTranslationSemanticSimilarity}% Match)
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                Self-Audit
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{currentSession.verification.backTranslation}"
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
