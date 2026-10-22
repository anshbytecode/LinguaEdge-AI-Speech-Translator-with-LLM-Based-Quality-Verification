import React from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  ShieldCheck, 
  ArrowRightLeft, 
  History, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  TestTube2, 
  Settings, 
  Sparkles,
  WifiOff,
  Activity,
  Layers,
  GraduationCap
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isOffline: boolean;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOffline,
  historyCount
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'translate', label: 'Translate Speech', icon: <Mic size={17} /> },
    { id: 'inspector', label: 'Quality Inspector', icon: <ShieldCheck size={17} />, badge: 'Core' },
    { id: 'quality_lab', label: 'AI Quality Lab', icon: <Sparkles size={17} />, badge: 'Lab' },
    { id: 'conversation', label: 'Conversation Mode', icon: <ArrowRightLeft size={17} /> },
    { id: 'phrasebook', label: 'Phrasebook & Triage', icon: <BookOpen size={17} /> },
    { id: 'practice', label: 'Shadow Practice', icon: <GraduationCap size={17} /> },
    { id: 'history', label: 'History & Export', icon: <History size={17} />, badge: historyCount > 0 ? String(historyCount) : undefined },
    { id: 'analytics', label: 'Performance Analytics', icon: <BarChart3 size={17} /> },
    { id: 'pipeline', label: 'Pipeline Explorer', icon: <Layers size={17} /> },
    { id: 'models', label: 'Edge & Models', icon: <Cpu size={17} /> },
    { id: 'glossary', label: 'Custom Glossary', icon: <Activity size={17} /> },
    { id: 'benchmark', label: 'Benchmark Suite', icon: <TestTube2 size={17} />, badge: 'Eval' },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  return (
    <aside 
      className="glass-panel"
      style={{
        width: '260px',
        minWidth: '260px',
        padding: '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 2.5rem)',
        position: 'sticky',
        top: '1.25rem',
        overflowY: 'auto'
      }}
    >
      <div>
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.5rem 1.25rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Lingua<span style={{ color: 'var(--cyan-bright)' }}>Edge</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Offline Edge-AI Translator
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%)' : 'transparent',
                  color: isActive ? 'var(--cyan-bright)' : 'var(--text-muted)',
                  borderLeft: isActive ? '3px solid var(--cyan-primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span 
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: isActive ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#000000' : 'var(--text-faint)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Offline System Status */}
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '0.75rem',
          fontSize: '0.72rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>System State</span>
          <div className={`badge ${isOffline ? 'badge-emerald' : 'badge-cyan'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
            <WifiOff size={10} />
            {isOffline ? '100% Offline' : 'Hybrid'}
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          Wasm SIMD & WebGPU Active
        </div>
        <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600 }}>
          © 2026 Anshul Bhilare. All rights reserved.
        </div>
      </div>
    </aside>
  );
};
