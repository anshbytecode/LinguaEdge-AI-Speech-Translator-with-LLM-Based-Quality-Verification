import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { TranslateCockpit } from './components/TranslateCockpit';
import { QualityInspectorView } from './components/QualityInspectorView';
import { AIQualityLabView } from './components/AIQualityLabView';
import { PhrasebookView } from './components/PhrasebookView';
import { PronunciationPracticeView } from './components/PronunciationPracticeView';
import { VisualPipelineExplorer } from './components/VisualPipelineExplorer';
import { ConversationView } from './components/ConversationView';
import { HistoryView } from './components/HistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { EdgeModelsView } from './components/EdgeModelsView';
import { GlossaryView } from './components/GlossaryView';
import { BenchmarkView } from './components/BenchmarkView';
import { SettingsView } from './components/SettingsView';

import { 
  NavigationTab, 
  DomainType, 
  TranslationSession, 
  AppSettings, 
  GlossaryItem, 
  ModelPackage, 
  BenchmarkRun 
} from './types';

import { 
  DEFAULT_SETTINGS, 
  getStoredSettings, 
  saveStoredSettings, 
  getStoredHistory, 
  addHistorySession, 
  toggleFavoriteSession, 
  renameSession, 
  deleteSession, 
  clearStoredHistory,
  getStoredGlossary,
  saveStoredGlossary,
  getStoredModels,
  saveStoredModels,
  getStoredBenchmarkRuns,
  addBenchmarkRun
} from './services/storageService';

import { executeEdgeTranslation } from './services/edgeTranslationEngine';
import { verifyTranslationQuality } from './services/llmQualityVerifier';
import { audioService } from './services/audioService';
import { BENCHMARK_DATASET } from './data/modelsAndGlossary';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Translation State
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('hi');
  const [sourceText, setSourceText] = useState<string>(
    'Administer 250 milligrams of Amoxicillin every 8 hours with water. Do not exceed 750 milligrams in 24 hours.'
  );
  const [currentDomain, setCurrentDomain] = useState<DomainType>('medical');

  // Active Execution States
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // Stored Data Collections
  const [currentSession, setCurrentSession] = useState<TranslationSession | null>(null);
  const [history, setHistory] = useState<TranslationSession[]>([]);
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [models, setModels] = useState<ModelPackage[]>([]);
  const [benchmarkRuns, setBenchmarkRuns] = useState<BenchmarkRun[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Initialize from storage & run initial demo translation
  useEffect(() => {
    const loadedSettings = getStoredSettings();
    setSettings(loadedSettings);
    setSourceLang(loadedSettings.defaultSourceLang || 'en');
    setTargetLang(loadedSettings.defaultTargetLang || 'hi');

    const loadedHistory = getStoredHistory();
    setHistory(loadedHistory);

    const loadedGlossary = getStoredGlossary();
    setGlossary(loadedGlossary);

    const loadedModels = getStoredModels();
    setModels(loadedModels);

    const loadedRuns = getStoredBenchmarkRuns();
    setBenchmarkRuns(loadedRuns);

    // Initial translation run
    handleTranslate(sourceText, loadedSettings.defaultSourceLang || 'en', loadedSettings.defaultTargetLang || 'hi');
  }, []);

  // Update theme & font size on document body
  useEffect(() => {
    document.body.className = `theme-${settings.theme} font-${settings.fontSize}`;
  }, [settings.theme, settings.fontSize]);

  // Main Translation & Verification Pipeline
  const handleTranslate = async (overrideText?: string, srcL = sourceLang, tgtL = targetLang) => {
    const textToProcess = (overrideText !== undefined ? overrideText : sourceText).trim();
    if (!textToProcess) return;

    setIsTranslating(true);
    const startTime = performance.now();

    try {
      // 1. Edge Neural Translation (with custom glossary substitution)
      const trans = await executeEdgeTranslation(
        textToProcess,
        srcL,
        tgtL,
        currentDomain,
        glossary,
        settings.processingMode
      );

      // 2. LLM-Based Quality Verification (LQV)
      const lqv = await verifyTranslationQuality(
        textToProcess,
        trans.translatedText,
        trans.backTranslation,
        srcL,
        tgtL,
        currentDomain,
        trans.sourceEntities,
        settings
      );

      const totalMs = Math.round(performance.now() - startTime);

      const newSession: TranslationSession = {
        id: `sess-${Date.now()}`,
        title: `${currentDomain.toUpperCase()} • ${textToProcess.slice(0, 32)}...`,
        timestamp: Date.now(),
        isFavorite: false,
        domain: currentDomain,
        sourceLang: srcL,
        targetLang: tgtL,
        rawTranscript: textToProcess,
        sourceText: textToProcess,
        initialTranslation: trans.initialTranslation,
        translatedText: trans.translatedText,
        verifiedTranslation: trans.translatedText,
        userAcceptedCorrection: false,
        latencies: {
          sttMs: isRecording ? 180 : 45,
          nmtMs: trans.latencyMs,
          lqvMs: lqv.latencyMs,
          ttsMs: 50,
          totalMs
        },
        verification: lqv,
        processingMode: settings.processingMode,
        networkUsageKb: 0,
        peakRamMb: settings.processingMode === 'speed' ? 385 : 780
      };

      setCurrentSession(newSession);
      const updatedHistory = addHistorySession(newSession);
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Translation pipeline error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Quick Translate trigger from Overview Dashboard
  const handleQuickTranslate = async (text: string, srcL: string, tgtL: string) => {
    setSourceLang(srcL);
    setTargetLang(tgtL);
    setSourceText(text);
    await handleTranslate(text, srcL, tgtL);
  };

  // Accept / Reject Suggested Correction
  const handleAcceptCorrection = (sessionId: string, newText: string) => {
    if (currentSession && currentSession.id === sessionId) {
      const updated = {
        ...currentSession,
        verifiedTranslation: newText,
        translatedText: newText,
        userAcceptedCorrection: true
      };
      setCurrentSession(updated);
      const updatedHistory = addHistorySession(updated);
      setHistory(updatedHistory);
    }
  };

  const handleRejectCorrection = (sessionId: string) => {
    if (currentSession && currentSession.id === sessionId) {
      const updated = {
        ...currentSession,
        userAcceptedCorrection: false
      };
      setCurrentSession(updated);
    }
  };

  const handleReverify = () => {
    if (currentSession) {
      handleTranslate(currentSession.sourceText, currentSession.sourceLang, currentSession.targetLang);
    }
  };

  // Toggle Recording from Overview
  const handleToggleRecording = async () => {
    if (isRecording) {
      const res = audioService.stopMicrophoneRecording();
      setIsRecording(false);
      audioService.playTone(520, 'sine', 0.1);
      if (sourceText.trim()) {
        handleTranslate(sourceText);
      }
    } else {
      try {
        audioService.playTone(660, 'sine', 0.12);
        const res = await audioService.startMicrophoneRecording((transcript) => {
          setSourceText(transcript);
        });
        setAnalyserNode(res.analyser);
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone permission or error:', err);
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          handleTranslate(sourceText);
        }, 3000);
      }
    }
  };

  // Session Management Handlers
  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteSession(id);
    setHistory(updated);
    if (currentSession && currentSession.id === id) {
      setCurrentSession({ ...currentSession, isFavorite: !currentSession.isFavorite });
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    const updated = renameSession(id, newTitle);
    setHistory(updated);
    if (currentSession && currentSession.id === id) {
      setCurrentSession({ ...currentSession, title: newTitle });
    }
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setHistory(updated);
    if (currentSession && currentSession.id === id) {
      setCurrentSession(updated[0] || null);
    }
  };

  const handleClearHistory = () => {
    clearStoredHistory();
    setHistory([]);
    setCurrentSession(null);
  };

  // Custom Glossary Handlers
  const handleAddGlossaryItem = (item: Omit<GlossaryItem, 'id' | 'createdAt'>) => {
    const newItem: GlossaryItem = {
      ...item,
      id: `gl-${Date.now()}`,
      createdAt: Date.now()
    };
    const updated = [newItem, ...glossary];
    setGlossary(updated);
    saveStoredGlossary(updated);
  };

  const handleDeleteGlossaryItem = (id: string) => {
    const updated = glossary.filter(g => g.id !== id);
    setGlossary(updated);
    saveStoredGlossary(updated);
  };

  // Model Package Handlers
  const handleToggleModelStatus = (modelId: string) => {
    const updated = models.map(m => {
      if (m.id === modelId) {
        return {
          ...m,
          status: (m.status === 'offline_ready' ? 'available' : 'offline_ready') as any
        };
      }
      return m;
    });
    setModels(updated);
    saveStoredModels(updated);
  };

  const handleUpdateProcessingMode = (mode: 'speed' | 'quality') => {
    const updated = { ...settings, processingMode: mode };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Automated Benchmark Runner
  const handleRunBenchmark = async (profile: string, quantization: string) => {
    setIsRunningBenchmark(true);
    try {
      // Simulate running across 5 clinical vectors
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRun: BenchmarkRun = {
        id: `run-${Date.now()}`,
        timestamp: Date.now(),
        modelProfile: profile,
        quantization,
        languagePair: 'EN ↔ HI / ES / DE / JA',
        sampleCount: BENCHMARK_DATASET.length,
        avgLatencyMs: quantization === 'INT4' ? 315 : 790,
        avgBleuScore: quantization === 'INT4' ? 51.4 : 54.8,
        avgLqvScore: quantization === 'INT4' ? 95.2 : 97.8,
        peakRamMb: quantization === 'INT4' ? 385 : 780,
        networkKb: 0,
        errorCount: 0,
        status: 'completed'
      };

      const updated = addBenchmarkRun(newRun);
      setBenchmarkRuns(updated);
    } finally {
      setIsRunningBenchmark(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', gap: '1.5rem', padding: '1.25rem 1.5rem 2rem 1.5rem' }}>
      
      {/* 3. Recommended Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOffline={settings.offlineOnlyMode}
        historyCount={history.length}
      />

      {/* Main Content Viewport */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {activeTab === 'overview' && (
          <OverviewDashboard
            currentSession={currentSession}
            onNavigateTab={setActiveTab}
            onQuickTranslate={handleQuickTranslate}
            isTranslating={isTranslating}
            currentDomain={currentDomain}
            onDomainChange={setCurrentDomain}
            analyserNode={analyserNode}
            setAnalyserNode={setAnalyserNode}
          />
        )}

        {activeTab === 'translate' && (
          <TranslateCockpit
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceLangChange={setSourceLang}
            onTargetLangChange={setTargetLang}
            onSwapLanguages={() => {
              const temp = sourceLang;
              setSourceLang(targetLang);
              setTargetLang(temp);
              if (currentSession?.translatedText) setSourceText(currentSession.translatedText);
            }}
            sourceText={sourceText}
            onSourceTextChange={setSourceText}
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
            currentSession={currentSession}
            settings={settings}
            currentDomain={currentDomain}
            analyserNode={analyserNode}
            setAnalyserNode={setAnalyserNode}
          />
        )}

        {activeTab === 'inspector' && (
          <QualityInspectorView
            currentSession={currentSession}
            onAcceptCorrection={handleAcceptCorrection}
            onRejectCorrection={handleRejectCorrection}
            onReverify={handleReverify}
          />
        )}

        {activeTab === 'quality_lab' && (
          <AIQualityLabView
            currentSession={currentSession}
            onUpdateSessionCandidate={handleAcceptCorrection}
            onSaveFeedback={(sessionId, rating, notes) => {
              if (currentSession && currentSession.id === sessionId) {
                const updated = {
                  ...currentSession,
                  verification: {
                    ...currentSession.verification,
                    userRating: rating,
                    userFeedbackNotes: notes
                  }
                };
                setCurrentSession(updated);
                setHistory(addHistorySession(updated));
              }
            }}
          />
        )}

        {activeTab === 'phrasebook' && (
          <PhrasebookView
            onSelectPhrase={(phrase, tgtL) => {
              setSourceText(phrase);
              setTargetLang(tgtL);
              setActiveTab('translate');
              handleTranslate(phrase, sourceLang, tgtL);
            }}
          />
        )}

        {activeTab === 'practice' && (
          <PronunciationPracticeView />
        )}

        {activeTab === 'pipeline' && (
          <VisualPipelineExplorer currentSession={currentSession} />
        )}

        {activeTab === 'conversation' && (
          <ConversationView currentDomain={currentDomain} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            sessions={history}
            onSelectSession={(s) => {
              setCurrentSession(s);
              setSourceLang(s.sourceLang);
              setTargetLang(s.targetLang);
              setSourceText(s.sourceText);
              setActiveTab('inspector');
            }}
            onToggleFavorite={handleToggleFavorite}
            onRenameSession={handleRenameSession}
            onDeleteSession={handleDeleteSession}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView sessions={history} benchmarkRuns={benchmarkRuns} />
        )}

        {activeTab === 'models' && (
          <EdgeModelsView
            models={models}
            onToggleModelStatus={handleToggleModelStatus}
            settings={settings}
            onUpdateProcessingMode={handleUpdateProcessingMode}
          />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView
            glossary={glossary}
            onAddGlossaryItem={handleAddGlossaryItem}
            onDeleteGlossaryItem={handleDeleteGlossaryItem}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkView
            benchmarkRuns={benchmarkRuns}
            onRunBenchmark={handleRunBenchmark}
            isRunningBenchmark={isRunningBenchmark}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={(newSettings) => {
              setSettings(newSettings);
              saveStoredSettings(newSettings);
            }}
            onClearAllData={handleClearHistory}
          />
        )}

        {/* Global Footer */}
        <footer 
          style={{ 
            marginTop: 'auto', 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            fontSize: '0.78rem', 
            color: 'var(--text-faint)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--cyan-bright)', fontWeight: 600 }}>LinguaEdge</span>
            <span>• Offline Edge-AI Speech Translator with LLM Quality Verification</span>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            © 2026 Anshul Bhilare. All rights reserved.
          </div>
        </footer>

      </main>

    </div>
  );
};

export default App;
