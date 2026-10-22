import React, { useState } from 'react';
import { 
  Layers, 
  Mic, 
  Cpu, 
  ShieldCheck, 
  Volume2, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { TranslationSession } from '../types';

interface VisualPipelineExplorerProps {
  currentSession: TranslationSession | null;
}

export const VisualPipelineExplorer: React.FC<VisualPipelineExplorerProps> = ({ currentSession }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('lqv');

  const nodes = [
    {
      id: 'capture',
      name: 'Audio Capture',
      stage: 'Stage 1',
      engine: 'Web Audio API',
      latency: '15 ms',
      status: 'Ready',
      color: '#06b6d4',
      input: 'PCM 44.1 kHz stream from input hardware device',
      output: 'Float32Array buffer with real-time FFT spectrum',
      description: 'Captures raw micro-samples, applies noise attenuation filter, and buffers PCM frames.'
    },
    {
      id: 'vad',
      name: 'Voice Activity Detection',
      stage: 'Stage 2',
      engine: 'Silero-VAD Wasm',
      latency: '22 ms',
      status: 'Active',
      color: '#3b82f6',
      input: 'Buffered PCM audio frames',
      output: 'Speech onset & silence segmentation markers',
      description: 'Filters ambient background noise and prevents inferencing on empty silence intervals.'
    },
    {
      id: 'stt',
      name: 'Speech-to-Text',
      stage: 'Stage 3',
      engine: 'Whisper-Edge Tiny INT4',
      latency: `${currentSession?.latencies.sttMs || 65} ms`,
      status: 'Ready',
      color: '#8b5cf6',
      input: 'Speech segments from VAD gate',
      output: currentSession?.sourceText || 'Recognized token stream with timestamps',
      description: 'Quantized acoustic encoder-decoder predicting phoneme tokens directly in browser WebAssembly.'
    },
    {
      id: 'nmt',
      name: 'Neural Translation',
      stage: 'Stage 4',
      engine: 'MarianMT Edge INT4',
      latency: `${currentSession?.latencies.nmtMs || 140} ms`,
      status: 'Active',
      color: '#a855f7',
      input: currentSession?.sourceText || 'Source language token sequence',
      output: currentSession?.initialTranslation || 'Target language draft translation',
      description: 'Bilingual translation matrix with custom glossary phrase preservation overrides.'
    },
    {
      id: 'lqv',
      name: 'LLM Quality Verification',
      stage: 'Stage 5 (Signature)',
      engine: 'Qwen-Edge-0.5B Judge',
      latency: `${currentSession?.latencies.lqvMs || 110} ms`,
      status: 'Verified',
      color: '#10b981',
      input: 'Target draft + round-trip back-translation',
      output: currentSession ? `Grade ${currentSession.verification.grade} (${currentSession.verification.overallScore}%)` : 'Scorecard & attention heatmap',
      description: 'Audits for dropped negations, medical dosage units, and hallucinations before speech synthesis.'
    },
    {
      id: 'tts',
      name: 'Neural Speech Synthesis',
      stage: 'Stage 6',
      engine: 'Piper VITS Edge',
      latency: `${currentSession?.latencies.ttsMs || 50} ms`,
      status: 'Ready',
      color: '#f59e0b',
      input: currentSession?.verifiedTranslation || 'Verified target output text',
      output: 'WAV PCM audio buffer & speech playback',
      description: 'Synthesizes offline speech waveform matching native dialect locale.'
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[4];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Visual AI Pipeline Explorer
            </h2>
            <span className="badge badge-cyan">6 End-to-End Stages</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Inspect each processing node, isolate error origin, and trace latency breakdown across the edge pipeline.
          </p>
        </div>
      </div>

      {/* Interactive Node Graph */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '850px', gap: '0.75rem' }}>
          {nodes.map((node, idx) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    flex: 1,
                    background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-input)',
                    border: isSelected ? `2px solid ${node.color}` : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 0 15px ${node.color}40` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {node.stage}
                    </span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                      {node.latency}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                    {node.name}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: node.color, fontFamily: 'var(--font-mono)' }}>
                    {node.engine}
                  </div>
                </div>

                {idx < nodes.length - 1 && (
                  <ArrowRight size={18} color="var(--text-faint)" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${activeNode.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Stage Inspector: {activeNode.stage}
            </span>
            <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2px 0 0 0', color: '#ffffff' }}>
              {activeNode.name} ({activeNode.engine})
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Execution Overhead</div>
            <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: activeNode.color }}>
              {activeNode.latency}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
          {activeNode.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
              Input Payload
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {activeNode.input}
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: activeNode.color, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
              Output Result
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
              {activeNode.output}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
