import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Trash2, 
  X, 
  FileJson, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { TranslationSession } from '../types';
import { clearStoredHistory, exportAuditReportJSON } from '../services/storageService';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TranslationSession[];
  onSelectSession: (session: TranslationSession) => void;
  onClearHistory: () => void;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onClearHistory
}) => {
  const [filterDomain, setFilterDomain] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = filterDomain === 'all' 
    ? sessions 
    : sessions.filter(s => s.domain === filterDomain);

  const handleDownloadJSON = () => {
    const jsonStr = exportAuditReportJSON(sessions);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingua-edge-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <History size={22} color="var(--cyan-bright)" />
            <div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Translation & Quality Audit Logs
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {sessions.length} mission-critical session records stored offline in browser IndexedDB
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

        {/* Toolbar: Filter + Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600 }}>Filter:</span>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="all">All Domains</option>
              <option value="medical">Medical Triage</option>
              <option value="disaster">Disaster Relief</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="tech">Tech & Engineering</option>
              <option value="travel">Travel</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleDownloadJSON}
              disabled={sessions.length === 0}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
              title="Export complete session logs to JSON"
            >
              <Download size={14} />
              <span>Export Audit JSON</span>
            </button>
            <button
              onClick={onClearHistory}
              disabled={sessions.length === 0}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#fb7185' }}
              title="Clear all stored logs"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-faint)' }}>
              No audit logs found for this filter.
            </div>
          ) : (
            filtered.map(s => (
              <div
                key={s.id}
                onClick={() => {
                  onSelectSession(s);
                  onClose();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--cyan-bright)', fontWeight: 600 }}>
                    <span style={{ textTransform: 'uppercase' }}>{s.sourceLang} → {s.targetLang}</span>
                    <span style={{ color: 'var(--text-faint)' }}>• {s.domain.toUpperCase()}</span>
                    <span style={{ color: 'var(--text-faint)' }}>• {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className={`badge ${s.verification.grade === 'A+' || s.verification.grade === 'A' ? 'badge-emerald' : s.verification.grade === 'B' ? 'badge-cyan' : 'badge-rose'}`}>
                    Grade {s.verification.grade} ({s.verification.overallScore}%)
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  "{s.sourceText.slice(0, 90)}{s.sourceText.length > 90 ? '...' : ''}"
                </div>

                <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 500 }}>
                  "{s.translatedText.slice(0, 95)}{s.translatedText.length > 95 ? '...' : ''}"
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
