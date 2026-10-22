import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  WifiOff, 
  Layers, 
  Zap, 
  RefreshCw,
  Sliders,
  Battery
} from 'lucide-react';
import { ModelPackage, AppSettings } from '../types';

interface EdgeModelsViewProps {
  models: ModelPackage[];
  onToggleModelStatus: (modelId: string) => void;
  settings: AppSettings;
  onUpdateProcessingMode: (mode: 'speed' | 'quality') => void;
}

export const EdgeModelsView: React.FC<EdgeModelsViewProps> = ({
  models,
  onToggleModelStatus,
  settings,
  onUpdateProcessingMode
}) => {
  const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
  const ramEstimate = (navigator as any)?.deviceMemory ? `${(navigator as any).deviceMemory} GB` : '8+ GB';

  const totalStorageMb = models.reduce((acc, m) => acc + (m.status === 'offline_ready' ? m.sizeMb : 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Processing Mode Selector */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Edge & Models Manager
            </h2>
            <span className="badge badge-emerald">
              <WifiOff size={11} /> 100% Offline Edge
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Monitor on-device inference engines, hardware acceleration, and manage offline model weights.
          </p>
        </div>

        {/* 18. Processing Mode Toggle (Speed vs Quality-Optimized) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => onUpdateProcessingMode('speed')}
            style={{
              background: settings.processingMode === 'speed' ? 'var(--cyan-primary)' : 'transparent',
              color: settings.processingMode === 'speed' ? '#000' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ⚡ Turbo Speed Mode (INT4)
          </button>
          <button
            onClick={() => onUpdateProcessingMode('quality')}
            style={{
              background: settings.processingMode === 'quality' ? 'var(--purple-accent)' : 'transparent',
              color: settings.processingMode === 'quality' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🧠 Deep Quality Mode (FP16)
          </button>
        </div>
      </div>

      {/* 14. Edge Device Hardware Monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              WebGPU Acceleration
            </span>
            <Cpu size={16} color="var(--cyan-bright)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
              {hasWebGPU ? 'Hardware Active' : 'Wasm SIMD Ready'}
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Shader compilation enabled
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              CPU Threads
            </span>
            <Layers size={16} color="var(--cyan-bright)" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {cores} Worker Cores
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Concurrent worker threads
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Device RAM Allocation
            </span>
            <HardDrive size={16} color="var(--purple-accent)" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--purple-accent)', marginTop: '4px' }}>
            {ramEstimate}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            System memory available
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Edge Cache Storage
            </span>
            <HardDrive size={16} color="#fbbf24" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {totalStorageMb.toFixed(1)} MB
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            IndexedDB storage used
          </div>
        </div>

      </div>

      {/* 16. Privacy & Zero-Cloud Explainer Banner */}
      <div 
        className="glass-panel" 
        style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={24} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
            Privacy Indicator: Strict On-Device Edge Execution
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0', lineHeight: 1.5 }}>
            All audio captures, intermediate phonemes, translation matrices, and LLM verification critiques execute entirely within your local device memory. No voice biometric data or transcripts ever leave this device.
          </p>
        </div>
      </div>

      {/* 13. Installed Model Packages Manager */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Installed Edge Model Packages
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Quantized weights deployed for local offline WebAssembly execution
            </p>
          </div>
          <span className="badge badge-cyan">{models.length} Total Packages</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {models.map(m => {
            const isReady = m.status === 'offline_ready';
            return (
              <div 
                key={m.id}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{m.name}</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{m.task}</span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{m.quantization}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Version: {m.version} • Size: {m.sizeMb} MB • RAM: ~{m.memoryRequiredMb} MB • Route: {m.languagePair}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className={`badge ${isReady ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                    {isReady ? 'Offline Ready' : 'Available (Click to Download)'}
                  </span>

                  <button
                    onClick={() => onToggleModelStatus(m.id)}
                    className={`btn ${isReady ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                  >
                    {isReady ? 'Uninstall' : 'Download Pack'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
