import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { VoiceService } from '../services/voiceService';
import { getAIResponse } from '../services/aiService';
import { supabase, type Message } from '../lib/supabase';

interface CallInterfaceProps {
  sessionId: string | null;
  onSessionStart: (id: string) => void;
  onSessionEnd: () => void;
}

export default function CallInterface({ sessionId, onSessionStart, onSessionEnd }: CallInterfaceProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Ready to start your CFO tutoring session');
  const [callDuration, setCallDuration] = useState(0);

  const voiceServiceRef = useRef<VoiceService | null>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  const conversationHistoryRef = useRef<Array<{role: string, content: string}>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    voiceServiceRef.current = new VoiceService();

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
        voiceServiceRef.current.stopSpeaking();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const duration = Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000);
          setCallDuration(duration);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!voiceServiceRef.current?.isSupported()) {
      setStatus('Voice features not supported in your browser');
      return;
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({ created_at: new Date().toISOString() })
      .select()
      .single();

    if (error || !data) {
      setStatus('Failed to start session');
      return;
    }

    setIsCallActive(true);
    callStartTimeRef.current = new Date();
    conversationHistoryRef.current = [];
    onSessionStart(data.id);
    setStatus('Call active - Click the microphone to ask a question');

    setTimeout(() => {
      const greeting = "Hello! I'm your CFO tutor. Ask me anything about finance, accounting, cash flow, EBITDA, investments, or any other financial concept.";
      speakResponse(greeting, data.id);
    }, 500);
  };

  const endCall = async () => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopListening();
      voiceServiceRef.current.stopSpeaking();
    }

    if (sessionId && callStartTimeRef.current) {
      const duration = Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000);
      await supabase
        .from('sessions')
        .update({
          ended_at: new Date().toISOString(),
          session_duration: duration
        })
        .eq('id', sessionId);
    }

    setIsCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript('');
    setStatus('Call ended');
    callStartTimeRef.current = null;
    conversationHistoryRef.current = [];
    onSessionEnd();
  };

  const toggleListening = () => {
    if (!isCallActive || !voiceServiceRef.current) return;

    if (isListening) {
      voiceServiceRef.current.stopListening();
      setIsListening(false);
      setStatus('Stopped listening');
    } else {
      if (isSpeaking) {
        voiceServiceRef.current.stopSpeaking();
        setIsSpeaking(false);
      }

      setStatus('Listening...');
      setIsListening(true);

      voiceServiceRef.current.startListening(async (text) => {
        setTranscript(text);
        setIsListening(false);
        setStatus('Processing your question...');

        await saveMessage(text, 'user');
        conversationHistoryRef.current.push({ role: 'user', content: text });

        const response = await getAIResponse(text, conversationHistoryRef.current);
        conversationHistoryRef.current.push({ role: 'assistant', content: response });

        await saveMessage(response, 'assistant');
        await speakResponse(response, sessionId!);
      });
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!sessionId) return;

    await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        created_at: new Date().toISOString()
      });
  };

  const speakResponse = async (text: string, currentSessionId: string) => {
    if (!voiceServiceRef.current || !currentSessionId) return;

    setIsSpeaking(true);
    setStatus('Speaking...');

    await voiceServiceRef.current.speak(text);

    setIsSpeaking(false);
    setStatus('Call active - Click the microphone to ask a question');
  };

  const toggleSpeaking = () => {
    if (!isSpeaking || !voiceServiceRef.current) return;

    voiceServiceRef.current.stopSpeaking();
    setIsSpeaking(false);
    setStatus('Call active - Click the microphone to ask a question');
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
          isCallActive ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl scale-105' : 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-xl'
        }`}>
          {isCallActive ? (
            <Phone className="w-24 h-24 text-white" />
          ) : (
            <PhoneOff className="w-24 h-24 text-slate-300" />
          )}
        </div>

        {isCallActive && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded-full text-sm font-medium">
            {formatDuration(callDuration)}
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-slate-700">{status}</p>
        {transcript && (
          <p className="text-sm text-slate-500 italic max-w-md">"{transcript}"</p>
        )}
      </div>

      <div className="flex space-x-6">
        {!isCallActive ? (
          <button
            onClick={startCall}
            className="flex flex-col items-center space-y-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Phone className="w-8 h-8" />
            <span className="text-sm font-medium">Start Call</span>
          </button>
        ) : (
          <>
            <button
              onClick={toggleListening}
              disabled={isSpeaking}
              className={`flex flex-col items-center space-y-2 px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              <span className="text-sm font-medium">
                {isListening ? 'Stop' : 'Ask'}
              </span>
            </button>

            <button
              onClick={toggleSpeaking}
              disabled={!isSpeaking}
              className={`flex flex-col items-center space-y-2 px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 ${
                isSpeaking
                  ? 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
              <span className="text-sm font-medium">Mute</span>
            </button>

            <button
              onClick={endCall}
              className="flex flex-col items-center space-y-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PhoneOff className="w-8 h-8" />
              <span className="text-sm font-medium">End Call</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
