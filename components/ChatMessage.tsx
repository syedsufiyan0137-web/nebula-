import React from 'react';
import { Message, Role } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div 
      className={`flex w-full mb-6 animate-slide-up ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          shadow-lg border
          ${isUser 
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400/30' 
            : 'bg-slate-800 border-slate-600/50'
          }
        `}>
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-cyan-400" />
          )}
        </div>

        {/* Bubble */}
        <div className={`
          flex flex-col 
          ${isUser ? 'items-end' : 'items-start'}
        `}>
          <div className={`
            px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-md backdrop-blur-md
            ${isUser 
              ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-50 rounded-tr-none' 
              : 'bg-slate-800/40 border border-slate-700/50 text-slate-200 rounded-tl-none'
            }
          `}>
             {/* 
                In a full production app, use 'react-markdown' here. 
                For this demo, we use whitespace-pre-wrap to preserve formatting.
             */}
            <span className="whitespace-pre-wrap font-sans">{message.text}</span>
            {message.isStreaming && (
               <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-cyan-400 animate-pulse"></span>
            )}
          </div>
          
          <span className="text-xs text-slate-500 mt-2 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;