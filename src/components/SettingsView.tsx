import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Check, 
  ShieldCheck, 
  Volume2, 
  Sliders, 
  HardDrive, 
  Download, 
  Trash2, 
  Sun, 
  Moon, 
  Eye, 
  Cpu,
  FileCheck
} from 'lucide-react';
import { AppSettings } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onClearAllData
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSave = () => {
    onSaveSettings(formData);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleExportDiagnostics = () => {
    const report = {
      system: 'LinguaEdge Edge Diagnostic Report',
      timestamp: new Date().toISOString(),
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      concurrencyThreads: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 8,
      memoryEstimate: (navigator as any)?.deviceMemory ? `${(navigator as any).deviceMemory} GB` : '8+ GB',
      webGpuSupport: typeof navigator !== 'undefined' && 'gpu' in navigator,
      settings: formData
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingua-edge-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Settings & Personalization
            </h2>
            <span className="badge badge-cyan">Full Configuration</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Configure default languages, quantization models, audio gains, strictness, and privacy.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
          {showSavedFeedback ? (
            <>
              <Check size={16} />
              <span>Saved!</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* 24. Language Preferences */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            24. Language Preferences
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              Default Input Speech Language
            </label>
            <select
              value={formData.defaultSourceLang}
              onChange={(e) => setFormData({ ...formData, defaultSourceLang: e.target.value })}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              Default Target Output Language
            </label>
            <select
              value={formData.defaultTargetLang}
              onChange={(e) => setFormData({ ...formData, defaultTargetLang: e.target.value })}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>Automatic Language Detection</span>
            <input
              type="checkbox"
              checked={formData.autoDetectLang}
              onChange={(e) => setFormData({ ...formData, autoDetectLang: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 25. Audio Settings */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            25. Audio & Voice Settings
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Input Gain Volume ({formData.inputVolume}%)</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={formData.inputVolume}
              onChange={(e) => setFormData({ ...formData, inputVolume: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Output Speech Volume ({formData.outputVolume}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.outputVolume}
              onChange={(e) => setFormData({ ...formData, outputVolume: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>TTS Playback Speed ({formData.playbackSpeed}x)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={formData.playbackSpeed}
              onChange={(e) => setFormData({ ...formData, playbackSpeed: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>Auto-Speak Translated Speech</span>
            <input
              type="checkbox"
              checked={formData.autoSpeakTranslation}
              onChange={(e) => setFormData({ ...formData, autoSpeakTranslation: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 26 & 27. Verification & Strictness Settings */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            26 & 27. Verification & Strictness
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Enable LLM Quality Verification</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Intercepts mistranslations and dosage changes</div>
            </div>
            <input
              type="checkbox"
              checked={formData.enableVerification}
              onChange={(e) => setFormData({ ...formData, enableVerification: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-safe)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              Verification Strictness Level
            </label>
            <select
              value={formData.verificationStrictness}
              onChange={(e) => setFormData({ ...formData, verificationStrictness: e.target.value as any })}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
            >
              <option value="strict">Strict (Flags all minor dosage & negation ambiguities)</option>
              <option value="balanced">Balanced (Standard conversational edge verification)</option>
              <option value="relaxed">Relaxed (Minimal flagging of semantic drift)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>Suggest Refined Corrections</span>
            <input
              type="checkbox"
              checked={formData.suggestCorrections}
              onChange={(e) => setFormData({ ...formData, suggestCorrections: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 28. Model & Quantization Settings */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            28. Model & Quantization Profile
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              Execution Quantization Profile
            </label>
            <select
              value={formData.quantizationProfile}
              onChange={(e) => setFormData({ ...formData, quantizationProfile: e.target.value as any })}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
            >
              <option value="INT4">⚡ INT4 Block-Wise (Fastest, ~385 MB RAM)</option>
              <option value="INT8">⚖️ INT8 Balanced (Medium, ~540 MB RAM)</option>
              <option value="FP16">🧠 FP16 Full Precision (Highest Quality, ~780 MB RAM)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              Quality Verification Engine
            </label>
            <select
              value={formData.llmProvider}
              onChange={(e) => setFormData({ ...formData, llmProvider: e.target.value as any })}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
            >
              <option value="offline-heuristic">Offline Edge-LQV (Default, Zero-Cloud, Safe)</option>
              <option value="gemini">Google Gemini 2.0 Flash (Hybrid Cloud Assist)</option>
              <option value="openai">OpenAI GPT-4o-mini (Hybrid Cloud Assist)</option>
              <option value="groq">Groq Llama-3-70B (Hybrid Cloud Assist)</option>
            </select>
          </div>
        </div>

        {/* 29. Privacy & Data Retention */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            29. Privacy & Storage Retention
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>Retain Audio Recordings Locally</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Store recorded audio in browser memory for playback</div>
            </div>
            <input
              type="checkbox"
              checked={formData.retainAudioRecordings}
              onChange={(e) => setFormData({ ...formData, retainAudioRecordings: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>Retain Session Transcripts Locally</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Save history in IndexedDB</div>
            </div>
            <input
              type="checkbox"
              checked={formData.retainTranscripts}
              onChange={(e) => setFormData({ ...formData, retainTranscripts: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button
              onClick={onClearAllData}
              className="btn btn-secondary"
              style={{ color: '#fb7185', fontSize: '0.75rem', width: '100%', gap: '0.4rem' }}
            >
              <Trash2 size={13} /> Clear All Local Data & Sessions
            </button>
          </div>
        </div>

        {/* 30, 31 & 32. Theme, Accessibility & Diagnostics */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            30-32. Theme, Accessibility & Diagnostics
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Theme Profile
              </label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
              >
                <option value="dark">🌙 Dark Cyber-Edge</option>
                <option value="oled">⬛ Pure OLED Black</option>
                <option value="light">☀️ Light Clean</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Font Size Accessibility
              </label>
              <select
                value={formData.fontSize}
                onChange={(e) => setFormData({ ...formData, fontSize: e.target.value as any })}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
              >
                <option value="regular">Regular Font</option>
                <option value="large">Large (+15%)</option>
                <option value="xlarge">Extra Large (+30%)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExportDiagnostics}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', gap: '0.4rem', marginTop: '0.5rem' }}
          >
            <Download size={14} />
            <span>Export Edge System Diagnostics Report</span>
          </button>
        </div>

      </div>

    </div>
  );
};
