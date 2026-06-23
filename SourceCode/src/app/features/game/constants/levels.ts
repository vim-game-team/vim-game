import { Level } from '../models/level';
import { chunks } from './map-data';

export const Levels: Level[] = [
  {
    id: 1,
    title: 'Level 1',
    description: 'Lerne die grundlegenden Vim-Bewegungen h, j, k und l.',
    startingPosition: { x: 0, y: 0 }, //has to be adapted to the actual map data
    goalPosition: { x: 0, y: 0 }, //has to be adapted to the actual map data
    allowedCommands: ['h', 'j', 'k', 'l'],
    mapData: chunks.get('0-0') ?? [], //get the map data for level 1
  },
];