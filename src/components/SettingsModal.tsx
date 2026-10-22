import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  X, 
  Key, 
  Cpu, 
  Volume2, 
  Sliders, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(formData);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SettingsIcon size={22} color="var(--cyan-bright)" />
            <div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                LinguaEdge System Configuration
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Edge runtime, LLM verification providers, and TTS voice parameters
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
          
          {/* Offline Mode Switch */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  100% Strict Offline Edge Mode
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Restricts all NMT and LLM verification to client-side browser runtime (Zero API calls)
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.offlineOnlyMode}
                onChange={(e) => setFormData({ ...formData, offlineOnlyMode: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* LLM Quality Verification Provider */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
              LLM Quality Verification Engine
            </label>
            <select
              value={formData.llmProvider}
              onChange={(e) => setFormData({ ...formData, llmProvider: e.target.value as any })}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.85rem',
                outline: 'none',
                marginBottom: '0.75rem'
              }}
            >
              <option value="offline-heuristic">Offline Edge-LQV (Recommended: Zero-Cloud, Built-in)</option>
              <option value="gemini">Google Gemini 2.0 / 1.5 Flash (Hybrid API)</option>
              <option value="openai">OpenAI GPT-4o / GPT-4o-mini (Hybrid API)</option>
              <option value="groq">Groq Llama-3-70B Extreme Speed (Hybrid API)</option>
              <option value="ollama">Ollama Local Instance (localhost:11434)</option>
            </select>

            {formData.llmProvider !== 'offline-heuristic' && (
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'block', marginBottom: '0.3rem' }}>
                  API Key or Endpoint Token (Stored locally only)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="password"
                    value={formData.apiKey || ''}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Enter API key..."
                    style={{
                      flex: 1,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Voice & TTS Controls */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  Auto-Speak Translations
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Automatically pronounce target translation after processing
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoSpeakTranslation}
                onChange={(e) => setFormData({ ...formData, autoSpeakTranslation: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Speed slider */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Voice Speed Rate ({formData.playbackSpeed || formData.speechRate || 1.0}x)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={formData.playbackSpeed || formData.speechRate || 1.0}
                onChange={(e) => setFormData({ ...formData, playbackSpeed: parseFloat(e.target.value), speechRate: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--cyan-primary)' }}
              />
            </div>

            {/* Quality threshold slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Quality Pass Threshold ({formData.confidenceThreshold}%)</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={formData.confidenceThreshold}
                onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--emerald-safe)' }}
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            {showSavedFeedback ? (
              <>
                <Check size={16} />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
