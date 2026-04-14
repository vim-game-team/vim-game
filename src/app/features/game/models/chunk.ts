import { TileType } from './types';
import { Tile } from "./tile";
import { GameConfig } from '../constants/game-config';

// export class Chunk {
//     public tiles: Tile[][] = new Array(GameConfig.chunkSize);

//     public constructor(type: TileType = TileType.GROUND) {
//         this.fill(type);
//     }

//     public load() {
//         //load chunkData
//     }
//     public fill(newTile: TileType) {
//         this.tiles.forEach((row) => row.fill(new Tile(newTile)));
//     }
// }
