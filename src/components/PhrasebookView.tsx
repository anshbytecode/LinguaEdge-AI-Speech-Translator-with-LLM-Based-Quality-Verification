import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  AlertTriangle, 
  Search, 
  Send, 
  ShieldAlert, 
  Sparkles,
  Play
} from 'lucide-react';
import { PhrasebookItem, DomainType } from '../types';
import { INITIAL_PHRASEBOOK } from '../data/phrasebookData';
import { ttsService } from '../services/speechSynthesisService';

interface PhrasebookViewProps {
  onSelectPhrase: (sourceText: string, targetLang: string) => void;
}

export const PhrasebookView: React.FC<PhrasebookViewProps> = ({ onSelectPhrase }) => {
  const [phrases] = useState<PhrasebookItem[]>(INITIAL_PHRASEBOOK);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = phrases.filter(p => {
    if (emergencyOnly && !p.isEmergency) return false;
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.sourceText.toLowerCase().includes(q) || p.translatedText.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSpeak = (text: string, locale = 'hi-IN') => {
    ttsService.speak(text, locale);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 88. Emergency Phrase Mode Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'radial-gradient(circle at 10% 20%, rgba(244, 63, 94, 0.12) 0%, rgba(13, 19, 36, 0.85) 60%)',
          borderLeft: '4px solid var(--rose-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(244,63,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="#fb7185" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              88. Emergency Phrase & Triage Communication Mode
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Pre-validated, safety-audited clinical and disaster phrases for instantaneous zero-latency playback.
            </div>
          </div>
        </div>

        <button
          onClick={() => setEmergencyOnly(!emergencyOnly)}
          className={`btn ${emergencyOnly ? 'btn-record' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem' }}
        >
          {emergencyOnly ? 'Showing Emergency Only' : 'Filter Emergency Triage'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '220px' }}>
          <Search size={14} color="var(--text-faint)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search phrasebook..."
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'medical', 'disaster', 'tech', 'travel'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat ? '#000' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phrasebook Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => (
          <div 
            key={item.id}
            className="glass-panel"
            style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                  {item.category.toUpperCase()}
                </span>
                {item.isEmergency && (
                  <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>Critical</span>
                )}
              </div>

              <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                "{item.sourceText}"
              </div>

              <div style={{ fontSize: '0.95rem', color: 'var(--cyan-bright)', fontWeight: 500, marginTop: '0.35rem' }}>
                "{item.translatedText}"
              </div>

              {item.phoneticGuide && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontStyle: 'italic', marginTop: '4px' }}>
                  {item.phoneticGuide}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
              <button
                onClick={() => handleSpeak(item.translatedText, 'hi-IN')}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                title="Play Audio"
              >
                <Volume2 size={13} color="var(--cyan-bright)" />
                <span>Play Voice</span>
              </button>

              <button
                onClick={() => onSelectPhrase(item.sourceText, item.targetLang)}
                className="btn btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                title="Load into Translation Cockpit"
              >
                Load Cockpit
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
