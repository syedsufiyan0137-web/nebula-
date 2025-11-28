import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-2">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl"
        >
          <div className="flex items-center justify-center w-10 h-10 ml-1 mb-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
             <Sparkles size={20} />
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nebula anything..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 px-2 py-3 focus:outline-none resize-none overflow-y-auto font-sans"
            style={{ minHeight: '48px' }}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              mb-1 p-2 rounded-xl flex items-center justify-center transition-all duration-300
              ${input.trim() && !isLoading
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            <Send size={20} className={input.trim() && !isLoading ? 'ml-0.5' : ''} />
          </button>
        </form>
      </div>
      <div className="text-center mt-3 text-xs text-slate-600 font-mono">
        Nebula AI Model v2.5 • Powered by Gemini
      </div>
    </div>
  );
};

export default ChatInput;