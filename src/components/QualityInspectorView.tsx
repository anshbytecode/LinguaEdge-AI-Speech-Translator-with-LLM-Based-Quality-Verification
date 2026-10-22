import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  Check, 
  X, 
  ArrowRight, 
  Layers, 
  AlertOctagon,
  Scale,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { TranslationSession, SuggestedCorrection } from '../types';

interface QualityInspectorViewProps {
  currentSession: TranslationSession | null;
  onAcceptCorrection: (sessionId: string, newText: string) => void;
  onRejectCorrection: (sessionId: string) => void;
  onReverify: () => void;
}

export const QualityInspectorView: React.FC<QualityInspectorViewProps> = ({
  currentSession,
  onAcceptCorrection,
  onRejectCorrection,
  onReverify
}) => {
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  if (!currentSession) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <ShieldCheck size={48} color="var(--cyan-bright)" style={{ opacity: 0.4, marginBottom: '1rem' }} />
        <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Translation Quality Inspector Standby
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '480px', margin: '0.5rem auto 0 auto' }}>
          Execute a translation via the dashboard or Cockpit to trigger the autonomous LLM-based hallucination audit and quality evaluation.
        </p>
      </div>
    );
  }

  const { verification } = currentSession;
  const isCritical = verification.hallucinationRisk === 'critical' || verification.grade === 'F';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header Card */}
      <div 
        className="glass-panel" 
        style={{
          padding: '1.5rem 1.75rem',
          borderLeft: isCritical ? '4px solid var(--rose-danger)' : '4px solid var(--emerald-safe)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Translation Quality Inspector
            </h2>
            <span className={`badge ${verification.confidenceLevel === 'high' ? 'badge-emerald' : verification.confidenceLevel === 'medium' ? 'badge-cyan' : 'badge-amber'}`}>
              {verification.confidenceLevel.toUpperCase()} CONFIDENCE
            </span>
            <span className={`badge ${verification.meaningPreservation === 'intact' ? 'badge-emerald' : 'badge-rose'}`}>
              Meaning: {verification.meaningPreservation.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Verify meaning, identify errors, and review suggestions before deployment.
          </p>
        </div>

        <button
          onClick={onReverify}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', gap: '0.4rem' }}
          title="Re-run verification matrix"
        >
          <RefreshCw size={14} />
          <span>Re-verify</span>
        </button>
      </div>

      {/* 5. Quality Score Breakdown & Explanation */}
      <div 
        className="glass-panel" 
        style={{
          padding: '1.5rem 1.75rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2rem',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div 
            className="font-mono"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              background: isCritical ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
              color: isCritical ? 'var(--rose-danger)' : 'var(--emerald-safe)',
              border: `2px solid ${isCritical ? 'var(--rose-danger)' : 'var(--emerald-safe)'}`,
              boxShadow: `0 0 20px ${isCritical ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`
            }}
          >
            {verification.overallScore}%
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontWeight: 700, marginTop: '6px' }}>
            GRADE {verification.grade}
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              Model-Estimated Quality Score
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                Ref BLEU: {verification.benchmarkBleuScore}
              </span>
              <button 
                onClick={() => setShowExplanationModal(!showExplanationModal)}
                style={{ background: 'none', border: 'none', color: 'var(--cyan-bright)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                <HelpCircle size={13} />
                <span>How calculated?</span>
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
            {verification.verdictExplanation}
          </p>

          {/* Explanation note */}
          {showExplanationModal && (
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem', borderLeft: '3px solid var(--cyan-primary)' }}>
              {verification.scoreCalculationExplanation}
            </div>
          )}

          {/* Sub-Metric Progress Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                <span>Fidelity</span>
                <span style={{ color: 'var(--cyan-bright)', fontWeight: 700 }}>{verification.semanticSimilarity}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '3px' }}>
                <div style={{ width: `${verification.semanticSimilarity}%`, height: '100%', background: 'var(--cyan-primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                <span>Fluency</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{verification.fluencyScore}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '3px' }}>
                <div style={{ width: `${verification.fluencyScore}%`, height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                <span>Domain Precision</span>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{verification.domainPrecision}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '3px' }}>
                <div style={{ width: `${verification.domainPrecision}%`, height: '100%', background: '#8b5cf6' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                <span>Round-Trip Match</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{verification.backTranslationSemanticSimilarity}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '3px' }}>
                <div style={{ width: `${verification.backTranslationSemanticSimilarity}%`, height: '100%', background: '#f59e0b' }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 7. Error and Omission Detection Panel */}
      {verification.flaggedErrors.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            <AlertOctagon size={18} />
            <span>Identified Translation Anomalies ({verification.flaggedErrors.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {verification.flaggedErrors.map(err => (
              <div 
                key={err.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <span className="badge badge-rose" style={{ fontSize: '0.65rem', marginRight: '0.5rem' }}>
                    {err.type.toUpperCase()} ERROR
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#fecdd3' }}>{err.description}</span>
                </div>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: '#fb7185', background: 'rgba(244,63,94,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  {err.term}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Suggested Corrections (Original vs Refined with Accept/Reject) */}
      {verification.suggestedCorrection && (
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--cyan-bright)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cyan-bright)' }}>
                LLM-Suggested Refinement
              </span>
            </div>
            {currentSession.userAcceptedCorrection && (
              <span className="badge badge-emerald">Correction Accepted</span>
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Reason for refinement: {verification.suggestedCorrection.reason}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Original */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                Original Translation
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {verification.suggestedCorrection.original}
              </div>
            </div>

            {/* Refined */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                Refined Version
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                {verification.suggestedCorrection.refined}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!currentSession.userAcceptedCorrection ? (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => onRejectCorrection(currentSession.id)}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.35rem' }}
              >
                <X size={14} />
                <span>Reject</span>
              </button>
              <button 
                onClick={() => onAcceptCorrection(currentSession.id, verification.suggestedCorrection!.refined)}
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.35rem' }}
              >
                <Check size={14} />
                <span>Accept Suggestion</span>
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--emerald-safe)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} /> Refined translation is now active for speech synthesis and export.
            </div>
          )}
        </div>
      )}

      {/* 9. Side-by-Side Comparison */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Scale size={16} color="var(--purple-accent)" />
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Side-by-Side Verification Comparison
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Recognized Speech
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.4rem', lineHeight: 1.5 }}>
              "{currentSession.sourceText}"
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Initial Raw Translation
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
              "{currentSession.initialTranslation}"
            </p>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--cyan-bright)', textTransform: 'uppercase', fontWeight: 700 }}>
              Verified Final Translation
            </span>
            <p style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 600, marginTop: '0.4rem', lineHeight: 1.5 }}>
              "{currentSession.verifiedTranslation || currentSession.translatedText}"
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
