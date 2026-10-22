/**
 * Enhanced Audio Service for LinguaEdge
 * Handles:
 * - Start, pause, resume, stop recording
 * - Recording timer & audio level (VU meter)
 * - High ambient noise warning detection
 * - Recording playback (listening back to recorded buffer)
 * - Audio file upload validation (.wav, .mp3, .ogg, .m4a)
 * - Real-time Web Audio API Analyser
 * - Audio download (.wav export)
 */

export class AudioService {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private lastRecordedBlob: Blob | null = null;
  private lastRecordedUrl: string | null = null;
  
  private isRecording = false;
  private isPaused = false;
  private recordingStartTime = 0;
  private pausedDuration = 0;
  private pauseTimestamp = 0;
  private speechRecognition: any = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public async startMicrophoneRecording(
    onTranscriptChunk?: (transcript: string, isFinal: boolean) => void,
    langLocale: string = 'en-US'
  ): Promise<{ analyser: AnalyserNode }> {
    const ctx = this.getAudioContext();
    this.recordedChunks = [];
    this.pausedDuration = 0;
    this.recordingStartTime = Date.now();

    this.micStream = await navigator.mediaDevices.getUserMedia({ 
      audio: { 
        echoCancellation: true, 
        noiseSuppression: true, 
        autoGainControl: true 
      } 
    });

    const sourceNode = ctx.createMediaStreamSource(this.micStream);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    sourceNode.connect(this.analyser);

    // Set up MediaRecorder to capture audio for playback & download
    try {
      this.mediaRecorder = new MediaRecorder(this.micStream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        if (this.recordedChunks.length > 0) {
          this.lastRecordedBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          if (this.lastRecordedUrl) URL.revokeObjectURL(this.lastRecordedUrl);
          this.lastRecordedUrl = URL.createObjectURL(this.lastRecordedBlob);
        }
      };
      this.mediaRecorder.start(200);
    } catch (err) {
      console.warn('MediaRecorder not available or restricted:', err);
    }

    this.isRecording = true;
    this.isPaused = false;

    // Speech recognition setup
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec && onTranscriptChunk) {
      try {
        this.speechRecognition = new SpeechRec();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = langLocale;

        this.speechRecognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            onTranscriptChunk(finalTranscript, true);
          } else if (interimTranscript) {
            onTranscriptChunk(interimTranscript, false);
          }
        };

        this.speechRecognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e.error);
        };

        this.speechRecognition.start();
      } catch (err) {
        console.warn('SpeechRecognition failed:', err);
      }
    }

    return { analyser: this.analyser };
  }

  public pauseRecording(): void {
    if (this.isRecording && !this.isPaused) {
      this.isPaused = true;
      this.pauseTimestamp = Date.now();
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.pause();
      }
      if (this.speechRecognition) {
        try { this.speechRecognition.stop(); } catch {}
      }
    }
  }

  public resumeRecording(): void {
    if (this.isRecording && this.isPaused) {
      this.isPaused = false;
      this.pausedDuration += (Date.now() - this.pauseTimestamp);
      if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.resume();
      }
      if (this.speechRecognition) {
        try { this.speechRecognition.start(); } catch {}
      }
    }
  }

  public stopMicrophoneRecording(): { audioUrl: string | null; durationSec: number } {
    this.isRecording = false;
    this.isPaused = false;
    const durationSec = Math.max(1, Math.round((Date.now() - this.recordingStartTime - this.pausedDuration) / 1000));

    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch {}
      this.speechRecognition = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch {}
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }

    return {
      audioUrl: this.lastRecordedUrl,
      durationSec
    };
  }

  /**
   * Calculates instantaneous audio volume level (0-100) and detects high ambient noise
   */
  public getAudioMetrics(): { level: number; highNoiseWarning: boolean } {
    if (!this.analyser || !this.isRecording || this.isPaused) {
      return { level: 0, highNoiseWarning: false };
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const level = Math.min(100, Math.round((average / 128) * 100));
    const highNoiseWarning = level > 82; // Threshold for noisy field conditions

    return { level, highNoiseWarning };
  }

  /**
   * Validates and reads an uploaded audio file
   */
  public async validateAndReadAudioFile(file: File): Promise<{
    isValid: boolean;
    durationSec: number;
    error?: string;
    fileUrl: string;
  }> {
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/x-m4a', 'audio/m4a'];
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB limit

    if (!validTypes.includes(file.type) && !/\.(wav|mp3|ogg|m4a)$/i.test(file.name)) {
      return {
        isValid: false,
        durationSec: 0,
        error: 'Unsupported audio format. Supported: WAV, MP3, OGG, M4A.',
        fileUrl: ''
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        durationSec: 0,
        error: 'File size exceeds 25 MB limit for offline edge processing.',
        fileUrl: ''
      };
    }

    const fileUrl = URL.createObjectURL(file);
    return {
      isValid: true,
      durationSec: Math.round(file.size / 32000), // estimated duration
      fileUrl
    };
  }

  /**
   * Generates a downloadable synthetic WAV file of speech for export
   */
  public downloadAudio(blobUrl: string, filename = 'lingua-edge-audio.wav'): void {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public playTone(frequency = 440, type: OscillatorType = 'sine', duration = 0.15): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getLastRecordedUrl(): string | null {
    return this.lastRecordedUrl;
  }
}

export const audioService = new AudioService();
