
import React, { useState, useEffect, useRef } from 'react';
import { NPC, ChatMessage, CharacterVariant, VocabularyItem, Item } from '../types';
import { generateNPCResponse, generateGreeting, updateNPCMemory } from '../services/geminiService';
import CharacterSprite from './CharacterSprite';

interface DialogModalProps {
  npc: NPC;
  existingVocabulary: VocabularyItem[];
  inventory: Item[];
  onClose: (updatedMemory?: string) => void;
  onMissionComplete: (missionId: string) => void;
  onAddXp: (amount: number) => void;
  onLearnVocabulary: (items: VocabularyItem[]) => void;
  onReceiveItem: (item: Item) => void;
  onRemoveItem: (itemId: string) => void;
  onOrderTaken?: (itemName: string) => void;
  onOrderFulfilled?: (itemName: string) => void;
}

const emotionEmojiMap: Record<string, string> = {
  happy: '😊', sad: '😢', angry: '😠', surprised: '😲', neutral: '😐', thinking: '🤔',
};

const DialogModal: React.FC<DialogModalProps> = ({ 
    npc, existingVocabulary, inventory, onClose, onAddXp, onLearnVocabulary, onReceiveItem, onRemoveItem, onOrderTaken, onOrderFulfilled
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showGiftMenu, setShowGiftMenu] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initDialog = async () => {
        setIsLoading(true);
        const greetingData = await generateGreeting(npc);
        setMessages([{ role: 'model', text: greetingData.text }]);
        setCurrentEmotion(greetingData.emotion);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };
    initDialog();
  }, [npc]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, itemToGive?: Item) => {
    e?.preventDefault();
    // Allow sending if there is text OR an item being given
    if ((!inputText.trim() && !itemToGive) || isLoading || isSaving) return;

    const userMsg: ChatMessage = { role: 'user', text: inputText, giftItem: itemToGive };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setShowGiftMenu(false);

    if (itemToGive) onRemoveItem(itemToGive.id);

    const result = await generateNPCResponse(npc, [...messages, userMsg], inputText, itemToGive);
    setIsLoading(false);
    
    if (result.score > 0) onAddXp(result.score);
    setCurrentEmotion(result.emotion);

    if (result.vocabulary.length > 0) onLearnVocabulary(result.vocabulary);
    if (result.rewardItem) onReceiveItem(result.rewardItem);
    
    // Track if an order was just placed
    if (result.orderedItemName && onOrderTaken) {
        onOrderTaken(result.orderedItemName);
    }

    // Check if a correct order was fulfilled
    if (result.isMissionComplete && itemToGive && onOrderFulfilled) {
        onOrderFulfilled(itemToGive.name);
    }

    setMessages((prev) => [
        ...prev, 
        { 
            role: 'model', text: result.text, feedback: result.feedback,
            score: result.score, newVocabulary: result.vocabulary, rewardItem: result.rewardItem
        }
    ]);
  };

  const handleGiveItem = (item: Item) => {
      handleSendMessage(undefined, item);
  };

  const renderMessageText = (msg: ChatMessage) => {
    if (msg.role === 'user' || !msg.newVocabulary || msg.newVocabulary.length === 0) return msg.text;
    let parts: (string | React.ReactNode)[] = [msg.text];
    msg.newVocabulary.forEach(vocab => {
        const word = vocab.word;
        const newParts: (string | React.ReactNode)[] = [];
        parts.forEach(part => {
            if (typeof part !== 'string') { newParts.push(part); return; }
            const regex = new RegExp(`\\b(${word}[a-z]*)\\b`, 'gi'); 
            const split = part.split(regex);
            split.forEach((s, i) => {
                if (regex.test(s)) {
                    newParts.push(<span key={`${word}-${i}`} className="text-blue-500 font-bold border-b-2 border-blue-400 cursor-help">{s}</span>);
                } else newParts.push(s);
            });
        });
        parts = newParts;
    });
    return <>{parts}</>;
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 flex items-end justify-center h-full">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => !isSaving && onClose()}></div>
      <div className="relative z-50 w-full md:w-[95%] h-[45%] mb-4 flex flex-row bg-[#0c162d]/95 border-4 border-[#3b82f6] rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Left: Avatar Section */}
        <div className="w-[120px] md:w-[180px] bg-slate-900/40 border-r-4 border-[#3b82f6]/30 flex flex-col items-center pt-4 relative shrink-0">
             <div className="flex flex-col items-center gap-1 mb-4 w-full px-2">
                <div className="bg-blue-600 text-white text-[10px] font-pixel px-3 py-1.5 rounded-md border border-blue-400 w-full text-center tracking-tight">
                    {npc.name}
                </div>
                <div className="text-slate-300 text-[8px] italic font-medium uppercase tracking-widest">{npc.role}</div>
             </div>
             <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#0f172a] border-2 border-[#3b82f6]/50 rounded-lg flex items-center justify-center shadow-inner mb-6 transition-all">
                <span className="text-4xl md:text-5xl">{isLoading ? '🧠' : (emotionEmojiMap[currentEmotion] || '😐')}</span>
             </div>
             <div className="mt-auto mb-6 transform scale-[1.8] origin-bottom">
                 <CharacterSprite variant={npc.variant || 'staff'} width={100} height={100} isTalking={isLoading} />
             </div>
        </div>

        {/* Right: Chat Section */}
        <div className="flex-1 flex flex-col relative bg-[#0a0f1e]">
            <button onClick={() => !isSaving && onClose()} className="absolute top-4 right-4 z-50 px-5 py-2 rounded-full text-[10px] border font-pixel uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/80 transition-colors">
                {isSaving ? 'MEMORIZING...' : 'END CHAT'}
            </button>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pt-16">
                 {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.role === 'user' && msg.giftItem && (
                            <div className="mb-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-0.5 shadow-lg animate-fade-in">
                                <div className="bg-slate-900 rounded-[14px] px-3 py-2 flex items-center gap-3">
                                    <div className="text-xl">{msg.giftItem.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-[7px] font-pixel text-amber-500 uppercase">GIVING ITEM</span>
                                        <span className="text-[11px] font-bold text-white">{msg.giftItem.name}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={`px-5 py-3 rounded-2xl text-sm md:text-base shadow-xl ${
                            msg.role === 'user' 
                                ? 'bg-[#1d4ed8] text-white rounded-tr-none border border-blue-400/30' 
                                : 'bg-[#f8fafc] text-[#0f172a] rounded-tl-none border border-slate-200'
                        }`}>
                            {renderMessageText(msg)}
                        </div>
                        {msg.role === 'model' && msg.feedback && (
                            <div className="mt-2 text-[10px] text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 italic">
                                {msg.feedback}
                            </div>
                        )}
                    </div>
                 ))}
                 <div ref={messagesEndRef} />
            </div>

            {/* Gift Menu Overlay (The Fixed Part) */}
            {showGiftMenu && (
                <div className="absolute inset-x-0 bottom-[80px] bg-[#0f172a]/95 border-t border-blue-500/30 p-5 animate-slide-up z-[60] backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[9px] font-pixel text-blue-400 uppercase tracking-widest">Select Item to Give</h4>
                        <button onClick={() => setShowGiftMenu(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {inventory.length === 0 ? (
                            <div className="flex flex-col items-center py-6 w-full opacity-30">
                                <p className="text-3xl mb-2">🎒</p>
                                <p className="text-[10px] text-slate-400 uppercase font-pixel tracking-tighter">Your backpack is empty</p>
                            </div>
                        ) : (
                            inventory.map(item => (
                                <button 
                                    key={item.id} 
                                    onClick={() => handleGiveItem(item)} 
                                    className="flex-shrink-0 flex flex-col items-center gap-2 group transition-transform active:scale-95"
                                >
                                    <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-amber-600 transition-all border border-white/5 shadow-lg group-hover:shadow-amber-500/20">
                                        {item.icon}
                                    </div>
                                    <span className="text-[8px] text-slate-400 uppercase max-w-[56px] text-center leading-tight truncate font-bold group-hover:text-white">
                                        {item.name}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-4 h-[80px] items-center">
                <button 
                    type="button" 
                    onClick={() => setShowGiftMenu(!showGiftMenu)} 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg transition-all ${
                        showGiftMenu ? 'bg-amber-600 border-amber-400 scale-105' : 'bg-slate-800 border-white/10 hover:bg-slate-700'
                    }`}
                >
                    <span className="text-2xl">🎒</span>
                </button>
                <div className="flex-1">
                    <input 
                        ref={inputRef} 
                        type="text" 
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all" 
                        placeholder={npc.id === 'barista' ? "Ask Ben to prepare an order..." : npc.pendingOrder ? `Deliver the ${npc.pendingOrder}...` : "Type to talk..."} 
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)} 
                        disabled={isLoading || isSaving} 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading || isSaving || !inputText.trim()} 
                    className="bg-[#1d4ed8] hover:bg-blue-600 text-white font-pixel px-6 h-12 rounded-xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-30"
                >
                    Send
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default DialogModal;
