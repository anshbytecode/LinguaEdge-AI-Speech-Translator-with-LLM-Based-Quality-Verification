import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Cpu, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { QualityVerificationResult, TokenAlignment, VerificationGrade } from '../types';

interface QualityVerificationCardProps {
  verification: QualityVerificationResult;
  sourceText: string;
  translatedText: string;
}

export const QualityVerificationCard: React.FC<QualityVerificationCardProps> = ({
  verification,
  sourceText,
  translatedText
}) => {
  const [showDetailedTokens, setShowDetailedTokens] = useState<boolean>(true);
  const [hoveredToken, setHoveredToken] = useState<TokenAlignment | null>(null);

  const getGradeClass = (grade: VerificationGrade) => {
    switch (grade) {
      case 'A+': return 'grade-aplus';
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      case 'F': return 'grade-f';
      default: return 'grade-a';
    }
  };

  const isCritical = verification.hallucinationRisk === 'critical' || verification.grade === 'F';

  return (
    <div 
      className={`glass-panel ${isCritical ? '' : 'glass-panel-glow'}`}
      style={{
        padding: '1.75rem',
        border: isCritical ? '1px solid var(--rose-danger)' : undefined,
        background: isCritical 
          ? 'radial-gradient(circle at 10% 20%, rgba(244, 63, 94, 0.15) 0%, rgba(13, 19, 36, 0.85) 60%)' 
          : undefined
      }}
    >
      {/* Header with Title and Engine Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isCritical ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isCritical ? '1px solid var(--rose-danger)' : '1px solid var(--emerald-safe)'
            }}
          >
            {isCritical ? (
              <AlertOctagon size={20} color="var(--rose-danger)" />
            ) : (
              <ShieldCheck size={20} color="var(--emerald-safe)" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                LLM-Based Quality Verification
              </h2>
              <span className={`badge ${isCritical ? 'badge-rose' : 'badge-emerald'}`}>
                {verification.verdict.replace(/_/g, ' ')}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Autonomous Hallucination Detection & Multi-Metric Semantic Audit
            </p>
          </div>
        </div>

        {/* Engine metadata pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            <Cpu size={12} />
            {verification.verificationEngine === 'deep-cloud-llm' ? 'Deep Cloud LLM' : 'Offline Edge-LQV'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            Audit latency: {verification.latencyMs}ms
          </span>
        </div>
      </div>

      {/* Main Scorecard Row */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr', 
          gap: '2rem', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem'
        }}
      >
        {/* Huge Grade Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div className={`grade-badge-huge ${getGradeClass(verification.grade)}`}>
            {verification.grade}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
            Quality Tier
          </span>
        </div>

        {/* 4 Score Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          
          {/* Semantic Similarity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Semantic Fidelity</span>
              <span style={{ color: 'var(--cyan-bright)', fontWeight: 700 }}>{verification.semanticSimilarity}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${verification.semanticSimilarity}%`, 
                  background: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
                  borderRadius: '3px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />
            </div>
          </div>

          {/* Fluency Score */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Syntactic Fluency</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{verification.fluencyScore}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${verification.fluencyScore}%`, 
                  background: 'linear-gradient(90deg, #059669, #10b981)',
                  borderRadius: '3px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />
            </div>
          </div>

          {/* Domain Precision */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Domain Terminology</span>
              <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{verification.domainPrecision}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${verification.domainPrecision}%`, 
                  background: 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
                  borderRadius: '3px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />
            </div>
          </div>

          {/* Back-Translation Consistency */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Round-Trip Invariance</span>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{verification.backTranslationSemanticSimilarity}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${verification.backTranslationSemanticSimilarity}%`, 
                  background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                  borderRadius: '3px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />
            </div>
          </div>

        </div>
      </div>

      {/* Hallucination / Omission Alerts */}
      {verification.droppedEntities.length > 0 && (
        <div 
          style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid rgba(244, 63, 94, 0.3)', 
            borderRadius: '10px', 
            padding: '1rem', 
            marginBottom: '1.25rem' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontWeight: 600, fontSize: '0.85rem' }}>
            <AlertTriangle size={18} />
            <span>CRITICAL ENTITY DISCREPANCY DETECTED:</span>
          </div>
          <ul style={{ margin: '0.5rem 0 0 1.5rem', color: '#fecdd3', fontSize: '0.8rem', lineHeight: 1.5 }}>
            {verification.droppedEntities.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Token-Level Alignment Heatmap */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '0.75rem',
            cursor: 'pointer' 
          }}
          onClick={() => setShowDetailedTokens(!showDetailedTokens)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} color="var(--cyan-bright)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Token-Level Attention Alignment Matrix ({verification.tokenAlignments.length} tokens)
            </span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}>
            {showDetailedTokens ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showDetailedTokens && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {verification.tokenAlignments.map((token, i) => (
                <div
                  key={i}
                  className={`token-chip ${token.isEntity ? 'entity' : ''} ${token.status === 'omitted' ? 'omitted' : ''}`}
                  onMouseEnter={() => setHoveredToken(token)}
                  onMouseLeave={() => setHoveredToken(null)}
                  style={{
                    borderColor: token.confidence > 0.85 
                      ? 'rgba(16, 185, 129, 0.4)' 
                      : token.confidence > 0.7 
                      ? 'rgba(6, 182, 212, 0.4)' 
                      : 'rgba(244, 63, 94, 0.5)'
                  }}
                >
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {token.sourceToken}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    <span>→ {token.targetToken}</span>
                    <span style={{ color: token.confidence > 0.85 ? '#34d399' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(token.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hover details tooltip */}
            {hoveredToken && (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Source Token: <span style={{ color: '#ffffff' }}>"{hoveredToken.sourceToken}"</span> | 
                Target Alignment: <span style={{ color: 'var(--cyan-bright)' }}>"{hoveredToken.targetToken}"</span> | 
                Alignment Status: <span style={{ color: hoveredToken.status === 'matched' ? '#34d399' : '#f87171' }}>{hoveredToken.status.toUpperCase()}</span> | 
                Attention Confidence: <span style={{ color: '#ffffff' }}>{hoveredToken.confidence}</span>
                {hoveredToken.isEntity && <span style={{ color: '#c084fc', marginLeft: '0.5rem' }}>[Critical Entity Flag]</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LLM Linguistic Critique Notes */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Sparkles size={16} color="var(--purple-accent)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--purple-accent)' }}>
            LLM Auditor Linguistic Critique & Verification Log
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.6rem', fontWeight: 500 }}>
          {verification.verdictExplanation}
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {verification.linguisticCritique.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};
