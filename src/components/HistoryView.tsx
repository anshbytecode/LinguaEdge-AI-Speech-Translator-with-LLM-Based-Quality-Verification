import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Star, 
  Trash2, 
  Edit2, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  Check, 
  X, 
  Printer, 
  Volume2, 
  Copy,
  AlertTriangle
} from 'lucide-react';
import { TranslationSession } from '../types';
import { 
  exportAuditReportJSON, 
  exportSessionsCSV, 
  exportSessionsTXT 
} from '../services/storageService';
import { ttsService } from '../services/speechSynthesisService';
import { getLanguageByCode } from '../data/languages';

interface HistoryViewProps {
  sessions: TranslationSession[];
  onSelectSession: (session: TranslationSession) => void;
  onToggleFavorite: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onSelectSession,
  onToggleFavorite,
  onRenameSession,
  onDeleteSession,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter sessions
  const filtered = sessions.filter(s => {
    if (onlyFavorites && !s.isFavorite) return false;
    if (filterLang !== 'all' && s.sourceLang !== filterLang && s.targetLang !== filterLang) return false;
    if (filterGrade !== 'all' && s.verification.grade !== filterGrade) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchText = s.sourceText.toLowerCase().includes(q) || s.translatedText.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (session: TranslationSession) => {
    const text = `Source (${session.sourceLang.toUpperCase()}):\n${session.sourceText}\n\nVerified Translation (${session.targetLang.toUpperCase()}):\n${session.verifiedTranslation || session.translatedText}\n\nQuality Score: ${session.verification.overallScore}% (Grade ${session.verification.grade})`;
    navigator.clipboard.writeText(text);
    setCopiedId(session.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleStartRename = (s: TranslationSession) => {
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header & Export Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Translation History & File Management
            </h2>
            <span className="badge badge-cyan">{sessions.length} Saved Sessions</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Search past translations, review audit records, and export bilingual reports.
          </p>
        </div>

        {/* Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleDownload(exportSessionsTXT(sessions), `lingua-edge-${Date.now()}.txt`, 'text/plain')}
            disabled={sessions.length === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            title="Export as TXT transcript"
          >
            <FileText size={14} />
            <span>TXT</span>
          </button>

          <button
            onClick={() => handleDownload(exportSessionsCSV(sessions), `lingua-edge-${Date.now()}.csv`, 'text/csv')}
            disabled={sessions.length === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            title="Export as CSV spreadsheet"
          >
            <FileSpreadsheet size={14} />
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleDownload(exportAuditReportJSON(sessions), `lingua-edge-audit-${Date.now()}.json`, 'application/json')}
            disabled={sessions.length === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            title="Export as JSON audit report"
          >
            <FileJson size={14} />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={sessions.length === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            title="Print bilingual transcripts"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={sessions.length === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', color: '#fb7185' }}
            title="Clear all stored sessions"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '220px' }}>
          <Search size={15} color="var(--text-faint)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transcripts, translations, or keywords..."
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.825rem', outline: 'none', width: '100%' }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`btn ${onlyFavorites ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
          >
            <Star size={13} fill={onlyFavorites ? '#ffffff' : 'none'} />
            <span>Favorites</span>
          </button>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.4rem 0.65rem',
              fontSize: '0.75rem',
              outline: 'none'
            }}
          >
            <option value="all">All Grades</option>
            <option value="A+">Grade A+ (Exemplary)</option>
            <option value="A">Grade A (Accurate)</option>
            <option value="B">Grade B (Acceptable)</option>
            <option value="C">Grade C (Review)</option>
            <option value="F">Grade F (Hallucination Flag)</option>
          </select>
        </div>

      </div>

      {/* Sessions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-faint)' }}>
            No translation sessions found matching this filter.
          </div>
        ) : (
          filtered.map(s => {
            const srcLangObj = getLanguageByCode(s.sourceLang);
            const tgtLangObj = getLanguageByCode(s.targetLang);

            return (
              <div 
                key={s.id} 
                className="glass-panel"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {/* Session Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      onClick={() => onToggleFavorite(s.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.isFavorite ? '#fbbf24' : 'var(--text-faint)', padding: '2px' }}
                      title="Favorite session"
                    >
                      <Star size={16} fill={s.isFavorite ? '#fbbf24' : 'none'} />
                    </button>

                    {editingId === s.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(s.id)}
                          style={{ background: 'var(--bg-input)', border: '1px solid var(--cyan-primary)', borderRadius: '4px', color: '#fff', padding: '2px 6px', fontSize: '0.85rem' }}
                        />
                        <button onClick={() => handleSaveRename(s.id)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{s.title}</span>
                        <button onClick={() => handleStartRename(s)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '2px' }}>
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Route & Quality Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                      {srcLangObj.flag} {srcLangObj.name} → {tgtLangObj.flag} {tgtLangObj.name}
                    </span>
                    <span className={`badge ${s.verification.grade === 'A+' || s.verification.grade === 'A' ? 'badge-emerald' : s.verification.grade === 'B' ? 'badge-cyan' : 'badge-rose'}`}>
                      Grade {s.verification.grade} ({s.verification.overallScore}%)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>Source Transcript</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>"{s.sourceText}"</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--cyan-bright)', textTransform: 'uppercase', fontWeight: 700 }}>Verified Translation</div>
                    <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 500, marginTop: '2px' }}>"{s.verifiedTranslation || s.translatedText}"</div>
                  </div>
                </div>

                {/* Footer Toolbar: Load, Listen, Copy, Delete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                    Latency: {s.latencies.totalMs}ms • Network: 0 KB (Offline)
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => ttsService.speak(s.verifiedTranslation || s.translatedText, tgtLangObj.speechLocale)}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', gap: '0.3rem' }}
                      title="Speak"
                    >
                      <Volume2 size={13} />
                      <span>Listen</span>
                    </button>

                    <button
                      onClick={() => handleCopy(s)}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', gap: '0.3rem' }}
                      title="Copy text"
                    >
                      <Copy size={13} />
                      <span>{copiedId === s.id ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => onSelectSession(s)}
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem' }}
                      title="Load into Cockpit"
                    >
                      Inspect
                    </button>

                    <button
                      onClick={() => onDeleteSession(s.id)}
                      style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '4px' }}
                      title="Delete session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Delete All Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={20} />
              <span>Confirm Clear All History</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete all {sessions.length} saved offline translation sessions? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowClearConfirm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }} 
                className="btn" 
                style={{ background: '#ef4444', color: '#fff' }}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
