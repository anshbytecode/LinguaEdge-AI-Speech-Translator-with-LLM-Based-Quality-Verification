import React, { useState } from 'react';
import { 
  TestTube2, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Cpu, 
  Gauge, 
  Sparkles,
  BarChart2,
  FileCheck
} from 'lucide-react';
import { BenchmarkRun } from '../types';
import { BENCHMARK_DATASET } from '../data/modelsAndGlossary';

interface BenchmarkViewProps {
  benchmarkRuns: BenchmarkRun[];
  onRunBenchmark: (profile: string, quantization: string) => Promise<void>;
  isRunningBenchmark: boolean;
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({
  benchmarkRuns,
  onRunBenchmark,
  isRunningBenchmark
}) => {
  const [selectedProfile, setSelectedProfile] = useState<'int4' | 'fp16'>('int4');

  const handleStartRun = () => {
    if (selectedProfile === 'int4') {
      onRunBenchmark('Edge INT4 Turbo (Whisper-Tiny + MarianMT + Qwen-0.5B)', 'INT4');
    } else {
      onRunBenchmark('Edge FP16 Deep Quality (Whisper-Base + NLLB-600M + Qwen-1.5B)', 'FP16');
    }
  };

  const handleExportBenchmarks = () => {
    const jsonStr = JSON.stringify({
      system: 'LinguaEdge Academic Benchmark Suite',
      exportedAt: new Date().toISOString(),
      datasetSamplesCount: BENCHMARK_DATASET.length,
      runs: benchmarkRuns
    }, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingua-edge-benchmark-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Test & Benchmark Suite
            </h2>
            <span className="badge badge-purple">Scientific Evaluation</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Execute repeatable offline test suites across standardized medical and emergency samples.
          </p>
        </div>

        <button
          onClick={handleExportBenchmarks}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', gap: '0.35rem' }}
          title="Export benchmark report for project documentation"
        >
          <Download size={14} />
          <span>Export Report JSON</span>
        </button>
      </div>

      {/* Benchmark Execution Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.1) 0%, rgba(13, 19, 36, 0.8) 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Run Automated Evaluation Test
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Executes across {BENCHMARK_DATASET.length} clinical emergency test vectors (EN, HI, ES, DE, JA).
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quantization Profile selector */}
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value as any)}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <option value="int4">⚡ INT4 Turbo Quantized Profile</option>
              <option value="fp16">🧠 FP16 High-Precision Deep Profile</option>
            </select>

            <button
              onClick={handleStartRun}
              disabled={isRunningBenchmark}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}
            >
              {isRunningBenchmark ? (
                <>
                  <RotateCcw className="animate-spin" size={15} />
                  <span>Evaluating Vectors...</span>
                </>
              ) : (
                <>
                  <Play size={15} />
                  <span>Start Benchmark Run</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Standard Test Vectors Peek */}
        <div style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
            Standard Clinical & Emergency Test Samples ({BENCHMARK_DATASET.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {BENCHMARK_DATASET.slice(0, 3).map(sample => (
              <div key={sample.id} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                • <strong style={{ color: 'var(--cyan-bright)' }}>[{sample.sourceLang.toUpperCase()} → {sample.targetLang.toUpperCase()}]</strong> {sample.sourceText.slice(0, 80)}...
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Benchmark Runs Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
          Historical Benchmark Evaluation Results
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>Profile</th>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>Quant</th>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>Avg Latency</th>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>BLEU Score</th>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>LQV Quality</th>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>Peak RAM</th>
                <th style={{ padding: '0.65rem 0.5rem', color: 'var(--text-faint)' }}>Network Traffic</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkRuns.map(run => (
                <tr key={run.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#ffffff', fontWeight: 600 }}>{run.modelProfile}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-cyan">{run.quantization}</span>
                  </td>
                  <td className="font-mono" style={{ padding: '0.75rem 0.5rem', color: 'var(--cyan-bright)' }}>{run.avgLatencyMs} ms</td>
                  <td className="font-mono" style={{ padding: '0.75rem 0.5rem', color: '#c084fc', fontWeight: 700 }}>{run.avgBleuScore}</td>
                  <td className="font-mono" style={{ padding: '0.75rem 0.5rem', color: '#10b981', fontWeight: 700 }}>{run.avgLqvScore}%</td>
                  <td className="font-mono" style={{ padding: '0.75rem 0.5rem' }}>{run.peakRamMb} MB</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#34d399' }}>0 KB (Offline)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
