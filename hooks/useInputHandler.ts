import { useEffect, useRef } from 'react';
import { GameState } from '../types';

interface InputHandlerProps {
  gameState: GameState;
  onMove: (dx: number, dy: number) => void;
  onInteract: () => void;
  onToggleInventory: () => void;
  onClose: () => void;
}

export const useInputHandler = ({
  gameState,
  onMove,
  onInteract,
  onToggleInventory,
  onClose,
}: InputHandlerProps) => {
  // Track which keys are currently held down
  const heldKeys = useRef<Set<string>>(new Set());
  // Track the last time a movement occurred to control speed
  const lastMoveTime = useRef<number>(0);
  // The requestAnimationFrame ID
  const requestRef = useRef<number | null>(null);

  // Movement speed (ms per tile) - Should match or be slightly larger than CSS transition
  const MOVE_INTERVAL = 180; 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.EXPLORING) {
        // Handle UI navigation keys when not exploring
        if (e.key === 'Escape') onClose();
        if (e.key === 'i' || e.key === 'I') onToggleInventory();
        return;
      }

      // Add to held keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
         heldKeys.current.add(e.key);
      }

      // Global Toggles
      if (e.key === 'Escape') onClose();
      if (e.key === 'i' || e.key === 'I') onToggleInventory();
      
      // Interaction (Single press)
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      heldKeys.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- The Game Loop ---
    const update = (time: number) => {
      if (gameState === GameState.EXPLORING) {
        // Calculate delta time
        if (time - lastMoveTime.current >= MOVE_INTERVAL) {
          
          // Determine direction based on the last key added (or priority)
          let dx = 0;
          let dy = 0;

          // Check set contents
          const keys = heldKeys.current;
          if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) dy = -1;
          else if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) dy = 1;
          else if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) dx = -1;
          else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) dx = 1;

          if (dx !== 0 || dy !== 0) {
            onMove(dx, dy);
            lastMoveTime.current = time;
          }
        }
      }
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, onMove, onInteract, onToggleInventory, onClose]);
};