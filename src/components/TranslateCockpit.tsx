import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Square, 
  Upload, 
  Volume2, 
  ArrowRightLeft, 
  Sparkles, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  Sliders, 
  FileAudio,
  CheckCircle2,
  Edit3,
  Languages,
  Zap
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../data/languages';
import { TranslationSession, DomainType, AppSettings } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { audioService } from '../services/audioService';
import { ttsService } from '../services/speechSynthesisService';
import { detectLanguage } from '../services/edgeTranslationEngine';

interface TranslateCockpitProps {
  sourceLang: string;
  targetLang: string;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSwapLanguages: () => void;
  sourceText: string;
  onSourceTextChange: (text: string) => void;
  onTranslate: (textOverride?: string) => Promise<void>;
  isTranslating: boolean;
  currentSession: TranslationSession | null;
  settings: AppSettings;
  currentDomain: DomainType;
  analyserNode: AnalyserNode | null;
  setAnalyserNode: (node: AnalyserNode | null) => void;
}

export const TranslateCockpit: React.FC<TranslateCockpitProps> = ({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onSwapLanguages,
  sourceText,
  onSourceTextChange,
  onTranslate,
  isTranslating,
  currentSession,
  settings,
  currentDomain,
  analyserNode,
  setAnalyserNode
}) => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [highNoiseWarning, setHighNoiseWarning] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Playback & TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTtsPaused, setIsTtsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(settings.playbackSpeed || 1.0);
  const [volumeLevel, setVolumeLevel] = useState(settings.outputVolume || 100);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // File Upload State
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const timerRef = useRef<any>(null);
  const meterRef = useRef<any>(null);

  const srcLangObj = getLanguageByCode(sourceLang);
  const tgtLangObj = getLanguageByCode(targetLang);

  // Load voices
  useEffect(() => {
    const voices = ttsService.getAvailableVoices();
    setAvailableVoices(voices);
  }, []);

  // Timer & Audio meter loop
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);

      meterRef.current = setInterval(() => {
        const metrics = audioService.getAudioMetrics();
        setAudioLevel(metrics.level);
        setHighNoiseWarning(metrics.highNoiseWarning);
      }, 100);
    } else {
      clearInterval(timerRef.current);
      clearInterval(meterRef.current);
      if (!isRecording) {
        setAudioLevel(0);
        setHighNoiseWarning(false);
      }
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(meterRef.current);
    };
  }, [isRecording, isPaused]);

  // Format timer seconds to mm:ss
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Recording actions
  const handleStartRecording = async () => {
    try {
      setTimerSeconds(0);
      setRecordedAudioUrl(null);
      const res = await audioService.startMicrophoneRecording((transcript) => {
        onSourceTextChange(transcript);
      }, srcLangObj.speechLocale);
      setAnalyserNode(res.analyser);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.warn('Microphone permission denied or device not found:', err);
      alert('Microphone permission denied or unavailable. Please check browser microphone permissions.');
    }
  };

  const handlePauseRecording = () => {
    audioService.pauseRecording();
    setIsPaused(true);
  };

  const handleResumeRecording = () => {
    audioService.resumeRecording();
    setIsPaused(false);
  };

  const handleStopRecording = () => {
    const res = audioService.stopMicrophoneRecording();
    setIsRecording(false);
    setIsPaused(false);
    setRecordedAudioUrl(res.audioUrl);
    if (sourceText.trim()) {
      onTranslate(sourceText);
    }
  };

  // Language auto-detection
  const handleAutoDetect = () => {
    if (!sourceText.trim()) return;
    const detected = detectLanguage(sourceText);
    onSourceLangChange(detected);
  };

  // Audio file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const res = await audioService.validateAndReadAudioFile(file);
      if (!res.isValid) {
        setUploadError(res.error || 'Failed to read audio file.');
      } else {
        setRecordedAudioUrl(res.fileUrl);
        // Simulate speech recognition transcription on uploaded audio
        const demoTranscripts = [
          'Administer 250 milligrams of Amoxicillin every 8 hours with water. Do not exceed 750 milligrams in 24 hours.',
          'Tengo un dolor opresivo muy fuerte en el pecho que se irradia hacia mi brazo izquierdo.',
          'Attention: Transformer T-42 is overheating at 140 degrees Celsius. Emergency shutdown required.'
        ];
        const chosen = demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)];
        onSourceTextChange(chosen);
        onTranslate(chosen);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error processing audio file.');
    } finally {
      setIsUploading(false);
    }
  };

  // TTS Controls
  const handlePlayTTS = () => {
    if (!currentSession?.translatedText) return;
    setIsSpeaking(true);
    setIsTtsPaused(false);
    ttsService.speak(currentSession.translatedText, tgtLangObj.speechLocale, {
      rate: playbackSpeed,
      volume: volumeLevel,
      voiceName: selectedVoice || undefined,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setIsTtsPaused(false);
      }
    });
  };

  const handlePauseTTS = () => {
    ttsService.pause();
    setIsTtsPaused(true);
  };

  const handleResumeTTS = () => {
    ttsService.resume();
    setIsTtsPaused(false);
  };

  const handleDownloadTTS = () => {
    if (!currentSession?.translatedText) return;
    const url = ttsService.generateAudioBlobForDownload(currentSession.translatedText);
    audioService.downloadAudio(url, `lingua-edge-${tgtLangObj.code}-${Date.now()}.wav`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
      
      {/* LEFT: Speech Input & Recording Cockpit */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Language Selection Row with Auto-Detect */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
                Input Speech Language
              </label>
              <button
                onClick={handleAutoDetect}
                style={{ background: 'none', border: 'none', color: 'var(--cyan-bright)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                title="Detect language from text input"
              >
                Auto-Detect
              </button>
            </div>
            <select
              value={sourceLang}
              onChange={(e) => onSourceLangChange(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name} ({l.nativeName})</option>
              ))}
            </select>
          </div>

          <button
            onClick={onSwapLanguages}
            className="btn btn-secondary"
            style={{ width: '36px', height: '36px', padding: 0, marginTop: '1.1rem', borderRadius: '8px' }}
            title="Swap source and target"
          >
            <ArrowRightLeft size={16} />
          </button>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
              Output Language
            </label>
            <select
              value={targetLang}
              onChange={(e) => onTargetLangChange(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name} ({l.nativeName})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Audio Visualizer Canvas */}
        <AudioVisualizer
          isRecording={isRecording}
          isPlayingTTS={isSpeaking}
          analyserNode={analyserNode}
          height={85}
        />

        {/* Recording Status Bar: Timer, VU Meter, Noise Warning */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isRecording ? (isPaused ? '#fbbf24' : '#ef4444') : '#475569',
                boxShadow: isRecording && !isPaused ? '0 0 10px #ef4444' : 'none'
              }}
            />
            <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              {formatTimer(timerSeconds)}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
              {isRecording ? (isPaused ? 'Paused' : 'Recording Live') : 'Standby'}
            </span>
          </div>

          {/* VU Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>VU:</div>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${audioLevel}%`, 
                  background: audioLevel > 80 ? 'var(--rose-danger)' : audioLevel > 50 ? 'var(--amber-warn)' : 'var(--cyan-primary)',
                  transition: 'width 0.1s ease'
                }} 
              />
            </div>
          </div>

          {/* Noise Warning Alert */}
          {highNoiseWarning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 600 }}>
              <AlertTriangle size={13} />
              <span>High Noise</span>
            </div>
          )}

        </div>

        {/* Editable Recognized Text Area */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
              Recognized Speech Transcript (Editable)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {recordedAudioUrl && (
                <audio src={recordedAudioUrl} controls style={{ height: '24px', maxWidth: '170px' }} />
              )}
              {sourceText && (
                <button
                  onClick={() => onSourceTextChange('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={sourceText}
            onChange={(e) => onSourceTextChange(e.target.value)}
            rows={4}
            placeholder={`Speak into the microphone or paste text in ${srcLangObj.name}...`}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.85rem',
              fontSize: '0.925rem',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5
            }}
          />
        </div>

        {/* Action Controls: Start/Pause/Resume/Stop Mic + Upload Audio + Translate Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="btn btn-record"
                title="Start Recording"
              >
                <Mic size={22} />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {isPaused ? (
                  <button onClick={handleResumeRecording} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Resume">
                    <Play size={16} color="var(--emerald-safe)" />
                  </button>
                ) : (
                  <button onClick={handlePauseRecording} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Pause">
                    <Pause size={16} color="#fbbf24" />
                  </button>
                )}
                <button onClick={handleStopRecording} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Stop & Transcribe">
                  <Square size={16} color="#ef4444" />
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".wav,.mp3,.ogg,.m4a"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', gap: '0.4rem' }}
              title="Import audio file (WAV, MP3, OGG, M4A)"
            >
              <Upload size={14} />
              <span>{isUploading ? 'Reading...' : 'Import Audio'}</span>
            </button>
          </div>

          <button
            onClick={() => onTranslate()}
            disabled={!sourceText.trim() || isTranslating}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            {isTranslating ? <span>Translating...</span> : (
              <>
                <Zap size={16} />
                <span>Translate & Audit</span>
              </>
            )}
          </button>

        </div>

        {uploadError && (
          <div style={{ color: '#fb7185', fontSize: '0.75rem', background: 'rgba(244,63,94,0.1)', padding: '0.5rem', borderRadius: '6px' }}>
            {uploadError}
          </div>
        )}

      </div>

      {/* RIGHT: Output, Speech Synthesis (TTS), Playback Controls & Download */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Verified Target Output
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
              {tgtLangObj.flag} {tgtLangObj.name} ({tgtLangObj.nativeName})
            </div>
          </div>

          {currentSession && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleDownloadTTS}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                title="Download synthesized audio as WAV"
              >
                <Download size={13} />
                <span>Audio WAV</span>
              </button>
            </div>
          )}
        </div>

        {/* Translation Output Box */}
        <div
          style={{
            minHeight: '175px',
            background: 'var(--bg-input)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {currentSession ? (
            <div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#ffffff', fontWeight: 500, margin: 0 }}>
                {currentSession.verifiedTranslation || currentSession.translatedText}
              </p>
              {currentSession.phoneticGuide && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
                  Phonetics: {currentSession.phoneticGuide}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-faint)', textAlign: 'center' }}>
              <Languages size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
              <div style={{ fontSize: '0.85rem' }}>Waiting for speech input or translation</div>
            </div>
          )}

          {/* Inline TTS Playback toolbar */}
          {currentSession && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {!isSpeaking ? (
                  <button onClick={handlePlayTTS} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    <Play size={13} /> Speak Audio
                  </button>
                ) : isTtsPaused ? (
                  <button onClick={handleResumeTTS} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    <Play size={13} /> Resume
                  </button>
                ) : (
                  <button onClick={handlePauseTTS} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    <Pause size={13} /> Pause
                  </button>
                )}
                <button onClick={() => ttsService.stop()} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  <RotateCcw size={13} /> Replay
                </button>
              </div>

              {/* Speed selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-faint)' }}>Speed:</span>
                {[0.75, 1.0, 1.25].map(s => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    style={{
                      background: playbackSpeed === s ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.05)',
                      color: playbackSpeed === s ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TTS Customization Drawer: Voices & Volume */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>
              Voice & Synthesis Controls
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Vol: {volumeLevel}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-faint)', display: 'block', marginBottom: '0.2rem' }}>Voice Profile</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.75rem',
                  outline: 'none'
                }}
              >
                <option value="">Default Offline Voice</option>
                {availableVoices.map(v => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-faint)', display: 'block', marginBottom: '0.2rem' }}>Volume Slider</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevel}
                onChange={(e) => setVolumeLevel(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--cyan-primary)', marginTop: '6px' }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
