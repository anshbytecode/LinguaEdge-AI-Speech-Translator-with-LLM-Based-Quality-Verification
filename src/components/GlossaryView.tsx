import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  Tag, 
  Languages, 
  Sparkles 
} from 'lucide-react';
import { GlossaryItem, DomainType } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface GlossaryViewProps {
  glossary: GlossaryItem[];
  onAddGlossaryItem: (item: Omit<GlossaryItem, 'id' | 'createdAt'>) => void;
  onDeleteGlossaryItem: (id: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  glossary,
  onAddGlossaryItem,
  onDeleteGlossaryItem
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // New item form
  const [term, setTerm] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [preferredTranslation, setPreferredTranslation] = useState('');
  const [category, setCategory] = useState<DomainType>('medical');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !preferredTranslation.trim()) return;

    onAddGlossaryItem({
      term: term.trim(),
      sourceLang,
      targetLang,
      preferredTranslation: preferredTranslation.trim(),
      category,
      notes: notes.trim()
    });

    setTerm('');
    setPreferredTranslation('');
    setNotes('');
    setShowAddForm(false);
  };

  const filtered = glossary.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return item.term.toLowerCase().includes(q) || item.preferredTranslation.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Custom Translation Glossary
            </h2>
            <span className="badge badge-purple">{glossary.length} Preferred Terms</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Enforce strict domain terminology for medical drugs, technical IDs, and critical commands.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <Plus size={15} />
          <span>Add Custom Term</span>
        </button>
      </div>

      {/* Add New Term Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-glow)' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
            Define Preferred Translation Terminology
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Source Term / Phrase
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Amoxicillin or Transformer T-42"
                required
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Preferred Target Translation
              </label>
              <input
                type="text"
                value={preferredTranslation}
                onChange={(e) => setPreferredTranslation(e.target.value)}
                placeholder="e.g. एमोक्सिसिलिन or No exceda"
                required
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Domain Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DomainType)}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
              >
                <option value="medical">Medical Triage</option>
                <option value="tech">Tech & Engineering</option>
                <option value="disaster">Disaster Relief</option>
                <option value="diplomatic">Diplomatic / Legal</option>
                <option value="travel">Travel</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Usage Notes & Safeguard Reason
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Clinical pediatric dosage preservation"
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.55rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save to Edge Glossary
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '220px' }}>
          <Search size={14} color="var(--text-faint)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search glossary terms or translations..."
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
        >
          <option value="all">All Domains</option>
          <option value="medical">Medical Triage</option>
          <option value="tech">Tech & Engineering</option>
          <option value="disaster">Disaster Relief</option>
          <option value="travel">Travel</option>
        </select>
      </div>

      {/* Glossary Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(item => (
          <div 
            key={item.id} 
            className="glass-panel"
            style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {item.term}
                </span>
                <span style={{ color: 'var(--text-faint)' }}>→</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
                  {item.preferredTranslation}
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                  {item.category.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {item.notes} • Language Route: [{item.sourceLang.toUpperCase()} → {item.targetLang.toUpperCase()}]
              </div>
            </div>

            <button
              onClick={() => onDeleteGlossaryItem(item.id)}
              style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '4px' }}
              title="Delete term"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
