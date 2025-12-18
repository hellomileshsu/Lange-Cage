
import React from 'react';
import { GAME_MAP, TILE_SIZE, MENU_ITEMS } from '../constants';
import { TileType, Position, NPC, CharacterVariant } from '../types';
import CharacterSprite from './CharacterSprite';

interface GameMapProps {
  playerPosition: Position;
  playerDirection: 'left' | 'right';
  moveDuration: number;
  npcs: NPC[];
  showInteractionPrompt: boolean;
}

const encodeSVG = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const PALETTE = {
  WOOD_DARK: '#3e2723',
  WOOD_MED: '#5d4037',
  WOOD_LIGHT: '#8d6e63',
  WALL_BASE: '#5c4033',
  WALL_HIGHLIGHT: '#795548',
  FLOOR_BASE: '#282220',
  FLOOR_HIGHLIGHT: '#3e2723',
};

const TEXTURES = {
  FLOOR: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="${PALETTE.FLOOR_BASE}"/><rect x="0" y="0" width="16" height="1" fill="${PALETTE.FLOOR_HIGHLIGHT}" opacity="0.3"/></svg>`),
  WALL: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="${PALETTE.WALL_BASE}"/><rect x="0" y="14" width="16" height="2" fill="#1a120b"/></svg>`),
  COUNTER: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#3e2723"/><rect x="0" y="0" width="16" height="6" fill="#5d4037"/></svg>`),
  TABLE_SQUARE: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" fill="#8d6e63" rx="1"/></svg>`),
  TABLE_ROUND: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" fill="#fef3c7" stroke="#d97706" stroke-width="0.5"/></svg>`),
  SOFA_LEFT: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 2h10v12h-10z" fill="#7f1d1d"/><rect x="2" y="2" width="3" height="12" fill="#991b1b" rx="1"/></svg>`),
  SOFA_RIGHT: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 2h10v12h-10z" fill="#7f1d1d"/><rect x="11" y="2" width="3" height="12" fill="#991b1b" rx="1"/></svg>`),
  CHAIR: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="8" height="8" fill="#5d4037" rx="2"/></svg>`),
  PLANT: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="11" r="3.5" fill="#d97706"/><path d="M8 11 L3 4 L7 6 L11 3 Z" fill="#15803d"/></svg>`),
  COFFEE_MACHINE: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="14" height="14" fill="#18181b"/></svg>`),
  REGISTER: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="12" height="9" fill="#9ca3af"/></svg>`),
  GRASS: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#14532d"/></svg>`),
  PATIO_TILE: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#d1d5db"/></svg>`),
  UMBRELLA: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" fill="#dc2626"/></svg>`),
  FENCE: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="2" width="2" height="14" fill="#451a03"/></svg>`),
  WC: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#94a3b8"/><rect x="4" y="3" width="8" height="9" fill="#fff" rx="2"/></svg>`),
  WC_SINK: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#94a3b8"/></svg>`),
  DOOR: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#451a03"/></svg>`),
  TRASH_BIN: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="8" height="10" fill="#374151"/></svg>`),
  WINDOW: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#dbeafe"/></svg>`),
  MENU_BOARD: encodeSVG(`<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#1f2937"/></svg>`),
};

const GameMap: React.FC<GameMapProps> = ({ playerPosition, playerDirection, moveDuration, npcs, showInteractionPrompt }) => {
  const getBackgroundStyle = (type: number) => {
    const texture = (TEXTURES as any)[TileType[type]];
    return { backgroundImage: texture ? `url('${texture}')` : 'none' };
  };

  const renderTile = (type: number, x: number, y: number) => (
    <div
      key={`${x}-${y}`}
      className="absolute"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        imageRendering: 'pixelated',
        ...getBackgroundStyle(type)
      }}
    />
  );

  return (
    <div 
      className="relative overflow-hidden bg-[#1a120b]"
      style={{ width: GAME_MAP[0].length * TILE_SIZE, height: GAME_MAP.length * TILE_SIZE }}
    >
      <div className="absolute inset-0 pointer-events-none z-30 mix-blend-multiply bg-[radial-gradient(circle_at_40%_40%,_rgba(255,230,200,0.15)_0%,_rgba(0,0,0,0.2)_60%,_rgba(0,0,0,0.7)_100%)] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />

      {GAME_MAP.map((row, y) => row.map((tileType, x) => renderTile(tileType, x, y)))}

      {npcs.map((npc) => {
        if (npc.role === 'Object') return null;
        const isMoving = npc.movementState === 'moving';
        const isClose = Math.abs(npc.position.x - playerPosition.x) <= 1 && Math.abs(npc.position.y - playerPosition.y) <= 1;
        const hasBeverage = !!npc.beverage;
        const isWaiting = !!npc.pendingOrder;
        
        // "Ready to order" state: Not the barista, not currently waiting for a drink, and not currently drinking.
        const needsToOrder = npc.id !== 'barista' && !isWaiting && !hasBeverage && !npc.isLeaving;

        // Fading effect for NPCs who are leaving
        const opacity = npc.isLeaving ? (npc.leavingTimer ? npc.leavingTimer / 5 : 0) : 1;

        return (
            <div
                key={npc.id}
                className="absolute flex flex-col items-center justify-center transition-all duration-[800ms] ease-linear z-10"
                style={{
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    left: npc.position.x * TILE_SIZE,
                    top: npc.position.y * TILE_SIZE,
                    opacity: opacity,
                }}
            >
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    {/* Floating Icons */}
                    {hasBeverage && (
                        <div className="relative w-10 h-10 flex items-center justify-center bg-blue-600/20 backdrop-blur rounded-full border border-blue-400/50 shadow-lg">
                            <span className="text-xl animate-bounce-slow">{npc.beverage?.icon}</span>
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="20" cy="20" r="18" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="113" strokeDashoffset={113 - (113 * (npc.consumptionTimer || 0) / 60)} />
                            </svg>
                        </div>
                    )}
                    {isWaiting && !hasBeverage && (
                        <div className="flex items-center gap-1 bg-amber-600/80 px-2 py-1 rounded-full border border-amber-400 animate-pulse">
                            <span className="text-xs">⏳</span>
                            <span className="text-sm">{MENU_ITEMS.find(m => m.name === npc.pendingOrder)?.icon || '❓'}</span>
                        </div>
                    )}
                    
                    {/* Persistent Order Icon for Customers who haven't ordered yet */}
                    {needsToOrder && (
                        <div className="bg-yellow-500/90 border-2 border-yellow-300 w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow pulse-yellow">
                            <span className="text-sm font-bold text-yellow-900">💬</span>
                        </div>
                    )}

                    {/* Goodbye text for leaving NPCs */}
                    {npc.isLeaving && (
                        <div className="bg-slate-800 text-white text-[8px] font-pixel px-2 py-1 rounded border border-white/20 animate-fade-out">
                            BYE! 👋
                        </div>
                    )}

                    {isClose && !npc.isLeaving && (
                        <div className={`px-2 py-0.5 rounded text-[8px] font-pixel uppercase shadow-md border animate-fade-in ${hasBeverage ? 'bg-blue-600 border-blue-400 text-white' : isWaiting ? 'bg-green-600 border-green-400 text-white' : 'bg-amber-600 border-amber-400 text-white'}`}>
                            {hasBeverage ? 'Small Talk' : isWaiting ? 'Deliver Order' : 'Take Order'}
                        </div>
                    )}
                </div>

                <CharacterSprite variant={npc.variant || 'staff'} isMoving={isMoving} idleVariant={npc.idleVariant || 'breath'} delay={(npc.id.charCodeAt(0) % 5) * 0.5} />
                <div className="absolute bottom-1 w-6 h-1 bg-black/30 rounded-full blur-[1px]"></div>
            </div>
        );
      })}

      <div
        className="absolute flex items-center justify-center z-20"
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          left: playerPosition.x * TILE_SIZE,
          top: playerPosition.y * TILE_SIZE,
          transition: `all ${moveDuration}ms linear`,
        }}
      >
        <div className={`transform ${playerDirection === 'left' ? 'scale-x-[-1]' : ''}`}>
           <CharacterSprite variant="player" isMoving={true} />
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
        
        .pulse-yellow { animation: pulse-yellow-anim 2s infinite; }
        @keyframes pulse-yellow-anim {
            0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(234, 179, 8, 0); }
            100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }

        @keyframes fade-out {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-out { animation: fade-out 2s forwards; }
      `}</style>
    </div>
  );
};

export default GameMap;
