import { Game } from '../entities/game.entity';

export interface IGameRepository {
  create(game: Game): Promise<Game>;
  findAll(): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
}
