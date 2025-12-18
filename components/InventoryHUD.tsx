import React, { useState } from 'react';
import { Item, VocabularyItem } from '../types';

interface InventoryHUDProps {
  items: Item[];
  vocabulary: VocabularyItem[];
  isOpen: boolean;
  onToggle: () => void;
  onUseItem: (item: Item) => void;
}

const InventoryHUD: React.FC<InventoryHUDProps> = ({ items, vocabulary, isOpen, onToggle, onUseItem }) => {
  const [activeTab, setActiveTab] = useState<'backpack' | 'grimoire'>('grimoire');

  const totalSlots = 9;
  const slots = Array(totalSlots).fill(null);
  items.forEach((item, index) => {
    if (index < totalSlots) slots[index] = item;
  });

  return (
    <div className={`flex flex-col items-end transition-all duration-300 pointer-events-auto ${!isOpen ? 'w-auto' : 'w-72 md:w-96'}`}>
       <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden text-white w-full transition-all duration-300">
         
         <button onClick={onToggle} className="w-full bg-slate-800 p-4 flex justify-between items-center hover:bg-slate-700 transition-all outline-none">
           <div className="flex items-center gap-3">
             <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-lg shadow-blue-500/20">
                {activeTab === 'grimoire' ? '📜' : '🎒'}
             </div>
             <div className="text-left">
                <h3 className="font-bold font-pixel text-[10px] tracking-widest text-blue-400">
                    {activeTab === 'grimoire' ? 'GRIMOIRE' : 'BACKPACK'}
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5">{vocabulary.length} words learned</p>
             </div>
           </div>
           <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}>▼</span>
         </button>

         {isOpen && (
             <div className="animate-fade-in flex flex-col h-[500px]">
                 <div className="flex bg-slate-800/50 p-1 m-4 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('grimoire')} className={`flex-1 py-2 text-center text-[10px] font-bold rounded-lg transition-all ${activeTab === 'grimoire' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>WORDS</button>
                    <button onClick={() => setActiveTab('backpack')} className={`flex-1 py-2 text-center text-[10px] font-bold rounded-lg transition-all ${activeTab === 'backpack' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>ITEMS</button>
                 </div>

                 <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
                    {activeTab === 'grimoire' && (
                        <>
                             {vocabulary.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-20 grayscale">
                                    <span className="text-5xl mb-4">📖</span>
                                    <p className="font-pixel text-[10px]">No knowledge yet</p>
                                </div>
                            ) : (
                                [...vocabulary].reverse().map((v, i) => (
                                    <div key={i} className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl group hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-blue-400 font-bold text-sm tracking-tight">{v.word}</h3>
                                                <span className="text-[9px] text-slate-500 italic uppercase">{v.partOfSpeech}</span>
                                            </div>
                                            <span className="text-[8px] text-slate-600 font-mono">#{vocabulary.length - i}</span>
                                        </div>
                                        <p className="text-slate-200 text-xs leading-relaxed border-l-2 border-blue-500/20 pl-3 mb-3">{v.definition}</p>
                                        <div className="bg-black/20 rounded-lg p-2">
                                            <p className="text-[10px] text-slate-400 italic leading-snug">"{v.example}"</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'backpack' && (
                        <div className="grid grid-cols-3 gap-3">
                             {slots.map((item, i) => (
                                <div key={i} onClick={() => item && onUseItem(item)} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all ${item ? 'bg-slate-800 border-white/10 hover:border-blue-400 cursor-pointer shadow-lg' : 'bg-black/20 border-white/5'}`}>
                                    {item ? (
                                        <>
                                            <span className="text-2xl mb-1">{item.icon}</span>
                                            <span className="text-[7px] font-pixel text-slate-500 uppercase">{item.name}</span>
                                        </>
                                    ) : (
                                        <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                    )}
                                </div>
                             ))}
                        </div>
                    )}
                 </div>
                 <div className="p-3 text-center border-t border-white/5 bg-black/20">
                    <p className="text-[8px] text-slate-600 font-pixel">KEY 'I' TO CLOSE</p>
                 </div>
             </div>
         )}
       </div>
    </div>
  );
};

export default InventoryHUD;