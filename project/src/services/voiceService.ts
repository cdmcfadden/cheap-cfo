export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private onTranscriptCallback: ((text: string) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(transcript);
        }
      };
    }
  }

  startListening(onTranscript: (text: string) => void) {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }
    this.onTranscriptCallback = onTranscript;
    this.recognition.start();
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  async speak(text: string): Promise<void> {
    const useOpenAI = import.meta.env.VITE_OPENAI_API_KEY;

    if (useOpenAI) {
      try {
        await this.speakWithOpenAI(text);
        return;
      } catch (error) {
        console.warn('OpenAI TTS failed, falling back to browser TTS:', error);
      }
    }

    return this.speakWithBrowser(text);
  }

  private async speakWithOpenAI(text: string): Promise<void> {
    this.stopSpeaking();

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
        speed: 1.0
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI TTS request failed');
    }

    const audioData = await response.arrayBuffer();

    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    const audioBuffer = await this.audioContext.decodeAudioData(audioData);

    return new Promise((resolve) => {
      if (!this.audioContext) return resolve();

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = () => resolve();

      this.currentAudioSource = source;
      source.start(0);
    });
  }

  private speakWithBrowser(text: string): Promise<void> {
    return new Promise((resolve) => {
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.includes('Premium') ||
        voice.name.includes('Enhanced') ||
        voice.name.includes('Google') && voice.lang === 'en-US'
      ) || voices.find(voice => voice.lang === 'en-US');

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    this.synthesis.cancel();

    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentAudioSource = null;
    }
  }

  isSupported(): boolean {
    return !!this.recognition && !!this.synthesis;
  }
}
