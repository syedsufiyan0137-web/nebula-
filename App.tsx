import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from './types';
import { streamMessage, resetSession } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { Terminal, Zap, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, initialBotMessage]);

    await streamMessage({
      message: text,
      onStreamUpdate: (currentText) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, text: currentText } 
              : msg
          )
        );
      },
      onComplete: (fullText) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, text: fullText, isStreaming: false } 
              : msg
          )
        );
        setIsLoading(false);
      },
      onError: (error) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { 
                  ...msg, 
                  text: `**System Alert:** An error occurred while processing your request. \n\n*Error details: ${error.message}*`, 
                  isStreaming: false, 
                  isError: true 
                } 
              : msg
          )
        );
        setIsLoading(false);
      },
    });
  };

  const handleClearChat = () => {
    setMessages([]);
    resetSession();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#020617] text-slate-200 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      {/* Header */}
      <header className="flex-shrink-0 z-10 px-6 py-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-white">Siri<span className="text-cyan-400">-AI</span></h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-mono tracking-wider">ONLINE</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {messages.length > 0 && (
            <button 
              onClick={handleClearChat}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-900/20"
              title="Clear Session"
            >
              <Trash2 size={20} />
            </button>
           )}
          <a href="#" className="hidden md:flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors border border-slate-800 rounded-full px-3 py-1">
            <Terminal size={12} />
            <span>v2.5</span>
          </a>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto relative z-0 scroll-smooth">
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center pt-20 pb-10 opacity-0 animate-fade-in text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700 shadow-2xl">
                <SparklesIcon />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Welcome to Siri-AI</h2>
              <p className="text-slate-400 max-w-md mb-8">
                Your smart, friendly voice-assistant companion. How can I help you today?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                <SuggestionCard 
                  title="Tell me a joke" 
                  subtitle="Something funny"
                  onClick={() => handleSendMessage("Tell me a funny joke to brighten my day")}
                />
                <SuggestionCard 
                  title="What is Quantum Computing?" 
                  subtitle="Explain simply"
                  onClick={() => handleSendMessage("Explain Quantum Computing like I'm five years old")}
                />
                <SuggestionCard 
                  title="Write a poem" 
                  subtitle="About space and stars"
                  onClick={() => handleSendMessage("Write a short poem about the stars in the night sky")}
                />
                <SuggestionCard 
                  title="Help me with code" 
                  subtitle="Debug a React hook"
                  onClick={() => handleSendMessage("Help me debug a React useEffect hook loop")}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role !== Role.MODEL && (
                 <div className="flex justify-start animate-fade-in pl-14">
                    <TypingIndicator />
                 </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 z-20">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

// Helper Components for Empty State
const SparklesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.3636 9.63636L22 12L14.3636 14.3636L12 22L9.63636 14.3636L2 12L9.63636 9.63636L12 2Z" className="fill-cyan-400" />
  </svg>
);

const SuggestionCard: React.FC<{title: string; subtitle: string; onClick: () => void}> = ({ title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="text-left p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all group"
  >
    <div className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{title}</div>
    <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
  </button>
);

export default App;