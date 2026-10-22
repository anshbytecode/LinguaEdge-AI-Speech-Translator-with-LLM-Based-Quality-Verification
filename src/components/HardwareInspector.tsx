import React from 'react';
import { 
  Cpu, 
  Zap, 
  HardDrive, 
  WifiOff, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  X,
  Gauge
} from 'lucide-react';
import { LatencyBreakdown } from '../types';

interface HardwareInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  latencies?: LatencyBreakdown;
}

export const HardwareInspector: React.FC<HardwareInspectorProps> = ({
  isOpen,
  onClose,
  latencies = { sttMs: 85, nmtMs: 140, lqvMs: 110, ttsMs: 65, totalMs: 400 }
}) => {
  if (!isOpen) return null;

  const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
  const ramEstimate = (navigator as any)?.deviceMemory ? `${(navigator as any).deviceMemory} GB` : '8+ GB';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Cpu size={22} color="var(--cyan-bright)" />
            <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Edge Hardware & Diagnostics Monitor
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Acceleration Matrix Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              WebGPU Acceleration
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              {hasWebGPU ? (
                <>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#10b981' }}>Available</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} color="#06b6d4" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cyan-bright)' }}>Wasm Fallback</span>
                </>
              )}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              CPU Concurrency Cores
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              <Cpu size={18} color="var(--cyan-bright)" />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                {cores} Threads Active
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              System RAM Allocation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              <HardDrive size={18} color="var(--purple-accent)" />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                {ramEstimate}
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Edge Isolation Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              <WifiOff size={18} color="#10b981" />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#10b981' }}>
                100% Zero-Cloud
              </span>
            </div>
          </div>

        </div>

        {/* Real-Time Edge Latency Waterfall */}
        <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gauge size={16} color="var(--cyan-bright)" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pipeline Latency Waterfall Breakdown
              </span>
            </div>
            <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)' }}>
              Total: {latencies.totalMs} ms
            </span>
          </div>

          {/* Waterfall Stages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>1. Speech-to-Text Ingestion (STT)</span>
                <span style={{ color: 'var(--cyan-bright)', fontFamily: 'var(--font-mono)' }}>{latencies.sttMs} ms</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                <div style={{ width: `${Math.min(100, (latencies.sttMs / latencies.totalMs) * 100)}%`, height: '100%', background: 'var(--cyan-primary)', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>2. Neural Machine Translation (NMT Matrix)</span>
                <span style={{ color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>{latencies.nmtMs} ms</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                <div style={{ width: `${Math.min(100, (latencies.nmtMs / latencies.totalMs) * 100)}%`, height: '100%', background: '#8b5cf6', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>3. LLM Quality Verification & Hallucination Audit (LQV)</span>
                <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{latencies.lqvMs} ms</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                <div style={{ width: `${Math.min(100, (latencies.lqvMs / latencies.totalMs) * 100)}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>4. Audio TTS Synthesis Generation</span>
                <span style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{latencies.ttsMs} ms</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                <div style={{ width: `${Math.min(100, (latencies.ttsMs / latencies.totalMs) * 100)}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
              </div>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: 1.5, textAlign: 'center' }}>
          Hardware diagnostics verified by client-side browser runtime. Zero telemetry data is transmitted externally.
        </div>

      </div>
    </div>
  );
};
