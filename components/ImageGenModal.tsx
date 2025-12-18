
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';

interface ImageGenModalProps {
  onClose: () => void;
}

const ImageGenModal: React.FC<ImageGenModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    // Users must select their own API key for gemini-3-pro-image-preview
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      try {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await aistudio.openSelectKey();
          // Assume success after opening dialog and proceed to avoid race condition
        }
      } catch (err) {
        console.warn("API key selection check failed:", err);
      }
    }

    setLoading(true);
    setResult(null);

    try {
      const image = await generateImage(prompt, size);
      setResult(image);
    } catch (error: any) {
      console.error("Generation failed:", error);
      // If the error indicates missing credentials, prompt for API key selection again
      if (error?.message?.includes("Requested entity was not found.") && aistudio) {
        await aistudio.openSelectKey();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      <div className="relative z-10 bg-slate-900 border-4 border-amber-600 rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-amber-700 p-3 flex justify-between items-center border-b border-amber-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h2 className="text-white font-pixel font-bold">Magic Canvas</h2>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white font-bold">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* Controls */}
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div>
              <label className="block text-amber-400 text-xs font-bold mb-1 uppercase tracking-wide">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see... (e.g., A futuristic coffee machine)"
                className="w-full bg-black/40 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-amber-500 min-h-[80px]"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-amber-400 text-xs font-bold mb-1 uppercase tracking-wide">
                Resolution
              </label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    disabled={loading}
                    className={`flex-1 py-2 rounded text-sm font-bold transition-all border-2 ${
                      size === s 
                        ? 'bg-amber-600 border-amber-400 text-white' 
                        : 'bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`w-full py-3 rounded font-pixel font-bold text-sm uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                loading || !prompt.trim()
                  ? 'bg-slate-700 text-gray-500 border-slate-900 cursor-not-allowed'
                  : 'bg-green-600 text-white border-green-800 hover:bg-green-500'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {/* Result Area */}
          <div className="mt-2 min-h-[200px] flex items-center justify-center bg-black/60 rounded border-2 border-slate-700 relative overflow-hidden group">
            {loading && (
              <div className="flex flex-col items-center gap-2 text-amber-500 animate-pulse">
                <span className="text-4xl">🖌️</span>
                <span className="text-xs font-mono">Painting pixel by pixel...</span>
              </div>
            )}

            {!loading && !result && (
              <div className="text-slate-600 text-center p-4">
                <p className="text-3xl mb-2 opacity-50">🖼️</p>
                <p className="text-xs">Your masterpiece will appear here</p>
              </div>
            )}

            {!loading && result && (
              <div className="relative w-full h-full">
                <img src={result} alt="Generated" className="w-full h-auto object-contain" />
                <a 
                   href={result} 
                   download={`magic-canvas-${Date.now()}.png`}
                   className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-xs px-3 py-1 rounded border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenModal;
