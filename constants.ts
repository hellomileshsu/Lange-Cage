
import { NPC, TileType, Mission } from './types';

export const TILE_SIZE = 64; // pixels

export const MENU_ITEMS = [
  { name: 'Espresso', icon: '☕', description: 'Strong and bold.' },
  { name: 'Latte', icon: '🥛', description: 'Smooth and creamy.' },
  { name: 'Green Tea', icon: '🍵', description: 'Calming and healthy.' },
  { name: 'Blueberry Muffin', icon: '🧁', description: 'Freshly baked.' },
  { name: 'Croissant', icon: '🥐', description: 'Buttery and flaky.' },
];

export const GAME_MAP: number[][] = [
  // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,11,11,11,11,11,11], 
  [ 1, 8,19,19, 1, 0, 0, 0, 8, 1,11,11,11,11,11,11], 
  [ 1, 0, 0, 0, 1, 2, 9, 2,10, 2,14,14,14,14,14,11], 
  [ 1,16, 0, 0, 1, 0, 0, 0, 0, 0,14,12,12,12,14,11], 
  [ 1,15, 0, 0, 1, 0, 0, 0, 0,17,12, 4,13, 4,14,11], 
  [ 1, 1,17, 1, 1, 0, 3, 0, 0,19,12,12,12,12,14,11], 
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0,19,12, 4,12, 4,14,11], 
  [ 1, 5, 3, 6, 0, 0, 3, 0, 0, 1,14,14,12,14,14,11], 
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,11,14,12,14,11,11], 
  [ 1, 5, 3, 6, 0, 0, 0, 0, 0, 1,11,14,12,14,11,11], 
  [ 1, 0, 0, 0, 0, 0, 0, 0,18, 1,11,14,12,14,11,11], 
  [ 1, 1, 1, 1, 1,17,17, 1, 1, 1,11,11,11,11,11,11], 
];

export const POINTS_OF_INTEREST = [
    { x: 5, y: 3 },  
    { x: 9, y: 3 },  
    { x: 2, y: 6 },  
    { x: 7, y: 8 },  
    { x: 12, y: 6 }, 
    { x: 12, y: 10 }, 
    { x: 6, y: 5 },  
    { x: 8, y: 10 }, 
];

export const INITIAL_PLAYER_POS = { x: 5, y: 4 };

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Morning Rush',
    description: 'Take orders from 3 different customers in the shop.',
    isCompleted: false,
  },
  {
    id: 'm2',
    title: 'Fulfillment Expert',
    description: 'Serve the correct drinks to waiting customers.',
    isCompleted: false,
  },
  {
    id: 'm3',
    title: 'Clean Environment',
    description: 'Check the trash area to ensure everything is tidy.',
    isCompleted: false,
    requiredNpcId: 'trash_bin',
  },
];

export const NPCS: NPC[] = [
  {
    id: 'barista',
    name: 'Ben',
    role: 'Head Barista',
    avatar: '👨‍🍳',
    variant: 'barista',
    position: { x: 5, y: 2 }, 
    personality: 'Professional and efficient. He makes whatever the owner requests for the customers.',
    initialMessage: 'Ready to brew! Tell me what the customers ordered.',
    isStationary: true,
    isPermanent: true,
  },
  {
    id: 'nomad_jack',
    name: 'Jack',
    role: 'Regular Customer',
    avatar: '💻',
    variant: 'nomad',
    position: { x: 2, y: 7 }, 
    personality: 'Honest regular. Always needs a strong drink to stay focused.',
    initialMessage: 'Glad you\'re here, I was just about to look for some caffeine.',
    isStationary: true, 
    isPermanent: true,
  },
  {
    id: 'student_lily',
    name: 'Lily',
    role: 'Student',
    avatar: '📚',
    variant: 'student',
    position: { x: 6, y: 5 }, 
    personality: 'Stressed student. Needs sugar or tea to keep studying.',
    initialMessage: 'Oh, hi. I really need something to help me stay awake.',
    isStationary: true, 
  },
  {
    id: 'student_mia',
    name: 'Mia',
    role: 'Student',
    avatar: '🎧',
    variant: 'student',
    position: { x: 7, y: 8 }, 
    personality: 'Social butterfly. Loves fancy drinks.',
    isStationary: false, 
    movementState: 'idle',
    idleTimer: 2,
  },
  {
    id: 'traveler_ken',
    name: 'Ken',
    role: 'Tourist',
    avatar: '📸',
    variant: 'traveler',
    position: { x: 12, y: 6 }, 
    personality: 'A curious traveler trying local specialties.',
    isStationary: false, 
    movementState: 'idle',
    idleTimer: 5,
  },
  {
    id: 'trash_bin',
    name: 'Bin',
    role: 'Object',
    avatar: '🗑️',
    position: { x: 8, y: 10 },
    personality: 'Recycling center.',
    initialMessage: 'Maintained by the Owner.',
    missionId: 'm3',
    missionSuccessTrigger: 'trash',
    isStationary: true,
    isPermanent: true,
  }
];
