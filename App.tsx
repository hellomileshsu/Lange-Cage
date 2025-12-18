
import React, { useState, useCallback, useEffect } from 'react';
import GameMap from './components/GameMap';
import DialogModal from './components/DialogModal';
import MissionHUD from './components/MissionHUD';
import InventoryHUD from './components/InventoryHUD';
import PlayerStatsHUD from './components/PlayerStatsHUD';
import { useInputHandler } from './hooks/useInputHandler';
import { GAME_MAP, INITIAL_PLAYER_POS, NPCS, MISSIONS, TILE_SIZE, POINTS_OF_INTEREST, MENU_ITEMS } from './constants';
import { GameState, Position, TileType, Mission, NPC, Item, VocabularyItem } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.EXPLORING);
  const [playerPos, setPlayerPos] = useState<Position>(INITIAL_PLAYER_POS);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [missions, setMissions] = useState<Mission[]>(MISSIONS);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [showInteractionPrompt, setShowInteractionPrompt] = useState<boolean>(false);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [npcs, setNpcs] = useState<NPC[]>(NPCS);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [xp, setXp] = useState<number>(0);
  const [moveDuration, setMoveDuration] = useState<number>(200);

  const level = Math.floor(xp / 50) + 1;

  const getNpcAt = (x: number, y: number): NPC | undefined => 
    npcs.find((npc) => npc.position.x === x && npc.position.y === y);

  const isWalkable = (x: number, y: number, currentNpcs: NPC[]): boolean => {
    if (y < 0 || y >= GAME_MAP.length || x < 0 || x >= GAME_MAP[0].length) return false;
    const tile = GAME_MAP[y][x];
    const isObstacle = [TileType.WALL, TileType.COUNTER, TileType.FENCE].includes(tile);
    const npcHere = currentNpcs.some(n => n.position.x === x && n.position.y === y);
    return !isObstacle && !npcHere;
  };

  const getNextStep = (start: Position, target: Position, currentNpcs: NPC[]): Position => {
    if (start.x === target.x && start.y === target.y) return start;
    const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
    let best = start;
    let minDist = Math.hypot(start.x - target.x, start.y - target.y);
    for (const d of dirs) {
      const next = { x: start.x + d.x, y: start.y + d.y };
      if (isWalkable(next.x, next.y, currentNpcs)) {
        const dist = Math.hypot(next.x - target.x, next.y - target.y);
        if (dist < minDist) {
          minDist = dist;
          best = next;
        }
      }
    }
    return best;
  };

  // Logic for decrementing NPC timers (consumption and leaving)
  useEffect(() => {
    const timerId = setInterval(() => {
      setNpcs(prevNpcs => {
        const nextNpcs = prevNpcs.map(npc => {
          // Handle Leaving State
          if (npc.isLeaving) {
            const nextLeavingTimer = (npc.leavingTimer || 0) - 1;
            return { ...npc, leavingTimer: nextLeavingTimer };
          }

          // Handle Consumption State
          if (!npc.beverage || !npc.consumptionTimer) return npc;
          const newTimer = npc.consumptionTimer - 1;
          
          if (newTimer > 0) {
            return { ...npc, consumptionTimer: newTimer };
          } else {
            // Consumption finished
            if (npc.isPermanent) {
              return { ...npc, beverage: undefined, consumptionTimer: undefined, pendingOrder: undefined };
            } else {
              // Non-permanent NPCs start leaving
              return { ...npc, isLeaving: true, leavingTimer: 5, beverage: undefined, consumptionTimer: undefined, pendingOrder: undefined };
            }
          }
        });

        // Filter out NPCs who finished leaving
        return nextNpcs.filter(npc => !npc.isLeaving || (npc.leavingTimer && npc.leavingTimer > 0));
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (gameState !== GameState.EXPLORING) return;
    const intervalId = setInterval(() => {
        setNpcs(currentNpcs => currentNpcs.map(npc => {
            if (npc.isStationary || (activeNPC && activeNPC.id === npc.id) || npc.beverage || npc.pendingOrder || npc.isLeaving) return npc;
            if (npc.movementState === 'idle') {
                const timer = npc.idleTimer || 0;
                if (timer > 0) return { ...npc, idleTimer: timer - 1 };
                const randomPOI = POINTS_OF_INTEREST[Math.floor(Math.random() * POINTS_OF_INTEREST.length)];
                return { ...npc, movementState: 'moving', targetPosition: randomPOI };
            }
            if (npc.movementState === 'moving' && npc.targetPosition) {
                if (npc.position.x === npc.targetPosition.x && npc.position.y === npc.targetPosition.y) {
                    return { ...npc, movementState: 'idle', idleTimer: 4 };
                }
                const nextPos = getNextStep(npc.position, npc.targetPosition, currentNpcs);
                return { ...npc, position: nextPos };
            }
            return npc;
        }));
    }, 800);
    return () => clearInterval(intervalId);
  }, [gameState, activeNPC]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== GameState.EXPLORING) return;
    setPlayerPos((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (!isWalkable(newX, newY, npcs)) return prev;
      const newPos = { x: newX, y: newY };
      const adjacent = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
      // Only interact with NPCs that aren't currently leaving
      const found = adjacent.map(o => getNpcAt(newX + o.x, newY + o.y)).find(n => !!n && !n.isLeaving);
      setActiveNPC(found || null);
      setShowInteractionPrompt(!!found);
      return newPos;
    });
    if (dx !== 0) setDirection(dx > 0 ? 'right' : 'left');
  }, [gameState, npcs]);

  const updateNpcOrder = (npcId: string, itemName: string) => {
      setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, pendingOrder: itemName } : n));
      setMissions(prev => prev.map(m => {
          if (m.id === 'm1') {
              const orderedCount = npcs.filter(n => n.pendingOrder).length + 1;
              if (orderedCount >= 3) return { ...m, isCompleted: true };
          }
          return m;
      }));
  };

  const handleServeOrder = (npcId: string, itemName: string) => {
      const menuData = MENU_ITEMS.find(m => m.name === itemName);
      setNpcs(prev => prev.map(n => n.id === npcId ? {
          ...n,
          beverage: { id: `drink-${Date.now()}`, name: itemName, icon: menuData?.icon || '☕', description: 'Served with care.' },
          consumptionTimer: 40,
          pendingOrder: undefined
      } : n));
      setXp(p => p + 20);
      setMissions(prev => prev.map(m => m.id === 'm2' ? { ...m, isCompleted: true } : m));
  };

  useInputHandler({
    gameState,
    onMove: movePlayer,
    onInteract: () => showInteractionPrompt && setGameState(GameState.DIALOG),
    onToggleInventory: () => setIsInventoryOpen(!isInventoryOpen),
    onClose: () => setIsInventoryOpen(false)
  });

  return (
    <div className="min-h-screen bg-[#2c1810] flex flex-col items-center justify-center p-4 overflow-hidden text-white">
      <div className="relative rounded-xl border-4 border-amber-800 shadow-2xl bg-black" style={{ width: GAME_MAP[0].length * TILE_SIZE, height: GAME_MAP.length * TILE_SIZE }}>
        <GameMap playerPosition={playerPos} playerDirection={direction} moveDuration={moveDuration} npcs={npcs} showInteractionPrompt={showInteractionPrompt} />
        <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-3 pointer-events-none">
            <MissionHUD missions={missions} />
            <InventoryHUD items={inventory} vocabulary={vocabulary} isOpen={isInventoryOpen} onToggle={() => setIsInventoryOpen(!isInventoryOpen)} onUseItem={() => {}} />
        </div>
        <PlayerStatsHUD xp={xp} level={level} />
      </div>

      {gameState === GameState.DIALOG && activeNPC && (
        <DialogModal 
            npc={activeNPC} 
            existingVocabulary={vocabulary}
            inventory={inventory}
            onClose={(mem) => {
              if (mem) setNpcs(p => p.map(n => n.id === activeNPC.id ? { ...n, memory: mem } : n));
              setGameState(GameState.EXPLORING);
            }} 
            onMissionComplete={() => {}} 
            onAddXp={(v) => setXp(p => p + v)}
            onLearnVocabulary={(v) => setVocabulary(p => [...p, ...v])}
            onReceiveItem={(i) => setInventory(p => [...p, i])}
            onRemoveItem={(id) => setInventory(p => p.filter(i => i.id !== id))}
            onOrderTaken={(name) => updateNpcOrder(activeNPC.id, name)}
            onOrderFulfilled={(name) => handleServeOrder(activeNPC.id, name)}
        />
      )}
    </div>
  );
};

export default App;
