import React, { useEffect, useRef } from 'react';
import { Message, ChatMode, Topic, FollowUp } from '../types';
import { PERSONAS } from '../constants';
import { Target } from 'lucide-react';
import { RESEARCH_TOPICS } from '../data/topics';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  mode: ChatMode;
  currentTopicId: string | null;
  onSelectTopic: (topic: Topic) => void;
  onSelectFollowUp: (followUp: FollowUp) => void;
  onBackToTopics: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  mode,
  currentTopicId,
  onSelectTopic,
  onSelectFollowUp,
  onBackToTopics
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getPersonaImage = (name?: string) => {
    if (!name) return null;
    return PERSONAS.find(p => p.name.toUpperCase() === name.toUpperCase())?.imageUrl;
  };

  const currentTopic = RESEARCH_TOPICS.find((t: Topic) => t.id === currentTopicId);

  return (<div className="flex flex-col h-full bg-[#050505]/50">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {messages.length === 0 && (<div className="h-full flex flex-col items-center justify-center text-stone-400 text-center px-12 space-y-6">
            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#222] shadow-sm">
              <Target className="w-8 h-8 text-white opacity-40" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-2">Awaiting Parameters</h2>
              <p className="text-xs font-medium leading-relaxed max-w-xs text-stone-500 uppercase tracking-widest">
                Select a target audience segment to begin extraction of qualitative insights.
              </p>
            </div>
          </div>)}

        {messages.map((msg: Message) => (<div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-3 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar for Model */}
              {msg.role === 'model' && (<div className="h-8 w-8 rounded-full overflow-hidden border border-[#222] bg-[#0a0a0a] flex-shrink-0 mb-1">
                  {getPersonaImage(msg.senderName) ? (<img src={getPersonaImage(msg.senderName)!} alt="" className="h-full w-full object-cover" />) : (<div className="h-full w-full flex items-center justify-center text-[10px] font-bold">NS</div>)}
                </div>)}

              <div className="flex flex-col">
                {msg.senderName && (<span className="text-[9px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1 ml-1">
                    {msg.senderName}
                  </span>)}
                <div
                  className={`
                    p-5 rounded-2xl text-[13px] leading-relaxed tracking-wide
                    ${msg.role === 'user'
                      ? 'bg-white text-black rounded-br-none shadow-[0_4px_12px_rgba(255,255,255,0.1)]'
                      : 'bg-[#0a0a0a] border border-[#222] text-stone-200 rounded-bl-none shadow-none'
                    }
                  `}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                <div className={`text-[8px] mt-1.5 uppercase tracking-[0.2em] font-bold opacity-30 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>))}

        {isLoading && (<div className="flex justify-start w-full">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#0a0a0a] border border-[#222] rounded-2xl rounded-bl-none">
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
            </div>
          </div>)}
        <div ref={messagesEndRef} />
      </div>

      {/* Choice Area */}
      <div className="p-8 bg-[#0a0a0a] border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          {!currentTopicId ? (<>
              <h3 className="text-[10px] font-bold uppercase text-stone-500 tracking-[0.25em] mb-6 text-center">
                Select Inquiry Topic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESEARCH_TOPICS.map((topic: Topic) => (<button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic)}
                    disabled={isLoading}
                    className="group relative flex items-center justify-between p-4 bg-[#050505] border border-[#222] rounded-xl hover:border-white transition-all text-left disabled:opacity-50"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform">
                      {topic.label}
                    </span>
                    <Target className="w-4 h-4 text-stone-600 group-hover:text-white transition-colors" />
                  </button>))}
              </div>
            </>) : (<>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={onBackToTopics}
                  disabled={isLoading}
                  className="text-[9px] font-bold uppercase tracking-widest text-stone-500 hover:text-white transition-colors flex items-center gap-2 outline-none"
                >
                  &larr; Back to Topics
                </button>
                <h3 className="text-[10px] font-bold uppercase text-stone-500 tracking-[0.25em]">
                  Follow-up Inquiries
                </h3>
                <div className="w-20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentTopic?.followUps.map((fu: FollowUp) => (<button
                    key={fu.id}
                    onClick={() => onSelectFollowUp(fu)}
                    disabled={isLoading}
                    className="p-4 bg-[#050505] border border-[#222] rounded-xl hover:border-white transition-all text-center disabled:opacity-50 outline-none"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
                      {fu.question}
                    </span>
                  </button>))}
              </div>
            </>)}
        </div>
        <div className="text-center mt-8">
          <p className="text-[9px] text-stone-300 font-bold uppercase tracking-[0.3em]">
            POWERED BY NIKE BRAND INTEL ENGINE
          </p>
        </div>
      </div>
    </div>);
};