export interface Level {
  id: number;
  title: string;
  description: string;
  startingPosition: { x: number; y: number };
  goalPosition: { x: number; y: number };
  allowedCommands: string[];
  mapData: string[];
}