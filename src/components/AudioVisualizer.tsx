import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  isPlayingTTS: boolean;
  analyserNode: AnalyserNode | null;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  isPlayingTTS,
  analyserNode,
  height = 90
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (isRecording || isPlayingTTS) {
        if (analyserNode && isRecording) {
          analyserNode.getByteFrequencyData(dataArray);
        } else {
          // Synthetic procedural audio pulses when simulated or speaking
          for (let i = 0; i < bufferLength; i++) {
            const v = Math.sin(phase + i * 0.25) * 45 + Math.cos(phase * 0.7 + i * 0.1) * 30 + 80;
            dataArray[i] = Math.max(10, Math.min(255, v));
          }
        }

        const barCount = 48;
        const barWidth = (width / barCount) * 0.65;
        const step = Math.floor(bufferLength / barCount) || 1;

        // Gradient for active bars
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#22d3ee');
        gradient.addColorStop(1, '#8b5cf6');

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#06b6d4';

        for (let i = 0; i < barCount; i++) {
          const rawVal = dataArray[i * step] || 20;
          const barHeight = Math.max(4, (rawVal / 255) * (h * 0.85));
          const x = i * (width / barCount) + (width / barCount - barWidth) / 2;
          const y = centerY - barHeight / 2;

          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 4);
          ctx.fill();
        }

        // Draw center pulse line
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < width; i += 8) {
          const wave = Math.sin(i * 0.04 + phase * 2) * (isRecording ? 10 : 6);
          if (i === 0) ctx.moveTo(i, centerY + wave);
          else ctx.lineTo(i, centerY + wave);
        }
        ctx.stroke();

        phase += 0.06;
      } else {
        // Idle ambient state: gentle slow-breathing cyber wave
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < width; i += 6) {
          const wave = Math.sin(i * 0.025 + phase) * 6;
          if (i === 0) ctx.moveTo(i, centerY + wave);
          else ctx.lineTo(i, centerY + wave);
        }
        ctx.stroke();

        phase += 0.02;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRecording, isPlayingTTS, analyserNode]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', background: 'rgba(5, 8, 18, 0.8)' }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={height}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '6px', 
          right: '12px', 
          fontSize: '0.65rem', 
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)' 
        }}
      >
        {isRecording ? 'LIVE MIC SPECTRUM 44.1kHz' : isPlayingTTS ? 'TTS AUDIO SYNTHESIS' : 'AUDIO INPUT IDLE'}
      </div>
    </div>
  );
};
