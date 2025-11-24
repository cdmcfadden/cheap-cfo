import { useEffect, useState } from 'react';
import { MessageCircle, User, Bot } from 'lucide-react';
import { supabase, type Message } from '../lib/supabase';

interface ConversationHistoryProps {
  sessionId: string | null;
}

export default function ConversationHistory({ sessionId }: ConversationHistoryProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    loadMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  if (!sessionId) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Start a call to see your conversation history</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[600px] overflow-y-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <MessageCircle className="w-6 h-6 mr-2" />
        Conversation History
      </h2>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No messages yet</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-slate-700 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
