# 🌐 LinguaEdge: Offline Edge-AI Speech Translator with LLM-Based Quality Verification

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![Edge AI](https://img.shields.io/badge/Architecture-100%25_Offline_Edge_AI-06b6d4?style=flat-square)
![Quality Verification](https://img.shields.io/badge/LLM_Verification-Hallucination_Audit-10b981?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square)

> **LinguaEdge** is a client-side Edge-AI speech translation system engineered for zero-cloud, mission-critical, and low-connectivity environments (emergency triage, disaster relief, defense, aviation, and high-security embassies). It pairs **in-browser neural speech translation** with an **autonomous LLM-Based Quality Verification (LQV) Inspector** that flags mistranslations, inverted polarities, numerical discrepancies, and hallucinations before speech synthesis.

---

## 🧭 Complete 10-Section Navigation Structure

1. **Overview Dashboard**: Status and performance summary, 4 main capability cards (*Offline Ready*, *Translation*, *Quality Verification*, *Edge Processing*), Quick Translation cockpit (e.g. English $\to$ Hindi), and live KPI ribbon (Latency ms, Quality Score %, Network 0 KB, Peak RAM MB).
2. **Translate Speech**: Start, pause, resume, and stop recording; animated canvas waveform; microphone permission handling; recording timer; audio VU meter; ambient noise warning; recording playback; editable recognized text; audio upload (.wav, .mp3, .ogg, .m4a); native-script output; Text-to-Speech playback with voice selection, volume, and **WAV audio download**.
3. **Quality Inspector (Signature Feature)**: Estimated 0–100 quality score with calculation explanation (distinct from benchmark BLEU); meaning preservation check; error and omission detector (negations, numbers, dosages, mistranslations); suggested corrections with **Accept** or **Reject** actions; side-by-side comparison; and verification confidence badges.
4. **Conversation Mode**: Two-way duplex walkie-talkie mode for face-to-face cross-language dialogue, switchable speaker directions, and **live progressive subtitles**.
5. **History & File Management**: Saved sessions with timestamps, search and filters by language/grade/favorites, session renaming, favoriting, deletion confirmation, and multi-format exports (**TXT**, **CSV**, **JSON**, **Printable Bilingual Transcripts**).
6. **Performance Analytics**: Academic project evaluation dashboard with latency by language pair, processing time per pipeline stage, quality before vs after verification, memory profile, BLEU reference benchmark evaluation, and test methodology report.
7. **Edge & Models**: Installed model package manager (Whisper-Tiny Edge, MarianMT INT4, Qwen2.5-Edge-0.5B, Piper VITS TTS, NLLB-600M), local storage quota tracking, WebGPU / CPU thread diagnostics, and strict on-device privacy guarantee.
8. **Custom Glossary**: Preferred terminology manager to enforce exact translations for medical dosages, pharmaceutical drugs, equipment IDs, and safety commands.
9. **Benchmark Suite**: Repeatable test runner across standardized clinical emergency test vectors comparing INT4 Turbo vs FP16 Deep Quality profiles with exportable benchmark reports.
10. **Settings & Personalization**: Language defaults, auto-detect language, microphone and audio volume gains, strictness levels, quantization profiles, privacy retention toggles, accessibility font sizes (Regular / Large / Extra Large), and theme profiles (Dark Cyber-Edge, OLED Black, Light Clean).

---

## 🚀 Quick Start (Local Run)

```bash
# 1. Navigate to the project directory
cd C:\Users\hp\.gemini\antigravity-ide\scratch\lingua-edge

# 2. Start the Vite development server (already running)
npm run dev

# 3. Open in browser:
# http://localhost:5173
```

---

## ☁️ Deployment on Vercel

LinguaEdge is pre-configured with native static export and a pre-configured `vercel.json` file for zero-config Vercel deployment.

### Method 1: Deploy with Vercel CLI (Fastest)

```bash
cd C:\Users\hp\.gemini\antigravity-ide\scratch\lingua-edge
npm install -g vercel
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No**
- Project name: `lingua-edge`
- Directory: `./`
- Deploy to production: `vercel --prod`

### Method 2: Deploy via GitHub / GitLab

1. Push this directory to your GitHub repository:
   ```bash
   cd C:\Users\hp\.gemini\antigravity-ide\scratch\lingua-edge
   git init
   git add .
   git commit -m "feat: complete LinguaEdge release with 38 features"
   git branch -M main
   git remote add origin https://github.com/<your-username>/lingua-edge.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `lingua-edge` repository.
4. Framework Preset will automatically detect **Vite** (`npm run build`, `dist`).
5. Click **Deploy**.

---

## 🔒 Security & Privacy by Design
- **100% Offline Edge Execution**: All audio captures, transcription, neural translation, and LLM quality audits happen inside client browser memory (WebAssembly & WebGPU).
- **Zero Cloud Leakage**: 0 KB external network transmission during offline mode. Meets HIPAA, GDPR, and defense field operation constraints.

---

## 📄 License & Attribution
© 2026 Anshul Bhilare. All rights reserved.
Licensed under the MIT License.

