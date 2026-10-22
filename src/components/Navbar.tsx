import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Settings as SettingsIcon, 
  History, 
  Activity, 
  WifiOff, 
  Layers,
  Sparkles
} from 'lucide-react';
import { DomainType } from '../types';

interface NavbarProps {
  currentDomain: DomainType;
  onDomainChange: (domain: DomainType) => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onToggleHardwareModal: () => void;
  mode: 'single' | 'conversation';
  onModeChange: (mode: 'single' | 'conversation') => void;
  isOffline: boolean;
}

const DOMAIN_OPTIONS: { id: DomainType; label: string; icon: string; color: string }[] = [
  { id: 'medical', label: 'Medical Triage', icon: '🩺', color: '#10b981' },
  { id: 'disaster', label: 'Disaster Relief', icon: '🚨', color: '#f43f5e' },
  { id: 'travel', label: 'Border & Travel', icon: '🛂', color: '#06b6d4' },
  { id: 'diplomatic', label: 'Diplomatic / Legal', icon: '⚖️', color: '#8b5cf6' },
  { id: 'tech', label: 'Tech & Engineering', icon: '⚡', color: '#f59e0b' },
  { id: 'general', label: 'General / Daily', icon: '🌐', color: '#94a3b8' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentDomain,
  onDomainChange,
  onOpenHistory,
  onOpenSettings,
  onToggleHardwareModal,
  mode,
  onModeChange,
  isOffline
}) => {
  return (
    <header className="glass-panel" style={{ marginTop: '1.25rem', padding: '0.85rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Lingua<span style={{ color: 'var(--cyan-bright)' }}>Edge</span>
              </span>
              <span className="badge badge-cyan">v2.4 Offline Edge</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Speech Translator with LLM-Based Quality Verification
            </p>
          </div>
        </div>

        {/* Mode Selector & Domain Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Single vs Two-Way Conversation */}
          <div 
            style={{ 
              display: 'flex', 
              background: 'rgba(255, 255, 255, 0.04)', 
              borderRadius: '10px', 
              padding: '3px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => onModeChange('single')}
              style={{
                background: mode === 'single' ? 'var(--cyan-primary)' : 'transparent',
                color: mode === 'single' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Translation Cockpit
            </button>
            <button
              onClick={() => onModeChange('conversation')}
              style={{
                background: mode === 'conversation' ? 'var(--cyan-primary)' : 'transparent',
                color: mode === 'conversation' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Two-Way Dialogue
            </button>
          </div>

          {/* Domain Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>
              Domain:
            </span>
            <select
              value={currentDomain}
              onChange={(e) => onDomainChange(e.target.value as DomainType)}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.825rem',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {DOMAIN_OPTIONS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right utility buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Status Badge */}
          <div 
            className={`badge ${isOffline ? 'badge-emerald' : 'badge-cyan'}`}
            title="Runs locally without external cloud dependency"
            style={{ cursor: 'help' }}
          >
            <WifiOff size={13} />
            <span>{isOffline ? 'Edge Offline' : 'Hybrid Assist'}</span>
          </div>

          {/* Hardware Inspector */}
          <button 
            className="btn btn-secondary" 
            onClick={onToggleHardwareModal}
            title="Inspect Edge Hardware, WebGPU & Latency Diagnostics"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Cpu size={15} color="var(--cyan-bright)" />
            <span>Edge Diagnostics</span>
          </button>

          {/* History Modal */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenHistory}
            title="View Audit Records"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <History size={15} />
            <span>Audit</span>
          </button>

          {/* Settings */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenSettings}
            title="Application Settings"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <SettingsIcon size={15} />
          </button>
        </div>

      </div>
    </header>
  );
};
