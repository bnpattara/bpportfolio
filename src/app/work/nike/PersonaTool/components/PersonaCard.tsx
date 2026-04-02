import React from 'react';
import { Persona } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onToggle: (id: string) => void;
  multiSelect?: boolean;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, isSelected, onToggle }) => {
  return (<div 
      onClick={() => onToggle(persona.id)}
      className={`
        group relative p-4 rounded-xl border cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-[#0a0a0a] border-black shadow-none ring-1 ring-black/5' 
          : 'bg-[#0a0a0a] border-[#222] hover:border-stone-400'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="h-14 w-14 rounded-full overflow-hidden border border-[#1a1a1a] bg-[#050505]">
            <img 
              src={persona.imageUrl} 
              alt={persona.name} 
              className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
            />
          </div>
          <div className="absolute -bottom-1 -right-1">
            {isSelected ? (<div className="bg-white rounded-full p-0.5 border-2 border-white">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>) : (<div className="bg-[#0a0a0a] rounded-full p-0.5 border border-[#222] group-hover:border-stone-400">
                <Circle className="w-4 h-4 text-stone-300 group-hover:text-stone-400" />
              </div>)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold tracking-[0.08em] text-white uppercase truncate">
            {persona.name}
          </h3>
          <p className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-1 truncate">
            {persona.role}
          </p>
          <p className="text-[11px] text-stone-500 leading-tight line-clamp-2 italic">
            "{persona.tagline}"
          </p>
        </div>
      </div>
    </div>);
};