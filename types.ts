
export type Position = {
  x: number;
  y: number;
};

export enum TileType {
  FLOOR = 0,
  WALL = 1,
  COUNTER = 2,
  TABLE_SQUARE = 3,
  TABLE_ROUND = 4,
  SOFA_LEFT = 5,
  SOFA_RIGHT = 6,
  CHAIR = 7,
  PLANT = 8,
  COFFEE_MACHINE = 9,
  REGISTER = 10,
  GRASS = 11,
  PATIO_TILE = 12,
  UMBRELLA = 13,
  FENCE = 14,
  WC = 15,
  WC_SINK = 16,
  DOOR = 17,
  TRASH_BIN = 18,
  WINDOW = 19,
  MENU_BOARD = 20,
  SCANNER = 21,
}

export enum GameState {
  EXPLORING = 'EXPLORING',
  DIALOG = 'DIALOG',
  INVENTORY = 'INVENTORY',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  learnedAt: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  requiredNpcId?: string;
}

export type CharacterVariant = 'staff' | 'security' | 'shopkeeper' | 'traveler' | 'player' | 'barista' | 'nomad' | 'student';

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  variant?: CharacterVariant;
  position: Position;
  personality: string;
  detailedPersonality?: string;
  memory?: string;
  initialMessage?: string;
  missionId?: string;
  missionSuccessTrigger?: string;
  isStationary?: boolean;
  isPermanent?: boolean; // If true, NPC never leaves the cafe
  isLeaving?: boolean;   // NPC is in the process of leaving
  leavingTimer?: number; // Countdown until they disappear
  movementState?: 'moving' | 'idle';
  targetPosition?: Position;
  idleTimer?: number;
  idleVariant?: 'breath' | 'bounce' | 'sway';
  beverage?: Item; // The drink they are currently consuming
  pendingOrder?: string; // The item name they requested
  consumptionTimer?: number; // Seconds left to finish drink
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  feedback?: string; 
  score?: number; 
  newVocabulary?: VocabularyItem[];
  rewardItem?: Item; // Item given BY NPC
  giftItem?: Item;   // Item given BY User
}
