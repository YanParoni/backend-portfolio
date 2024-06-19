import { Injectable } from '@nestjs/common';
import { GameRepository } from '@/infra/repositories/game.repository';
import { Game } from '@/domain/entities/game.entity';
import axios from 'axios';

@Injectable()
export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async findOrCreateGame(gameId: string): Promise<Game> {
    let game = await this.gameRepository.findById(gameId);
    if (!game) {
      game = await this.fetchGameFromApi(gameId);
      await this.gameRepository.create(game);
    }
    return game;
  }

  async fetchGameFromApi(gameId: string): Promise<Game> {
    const apiKey = process.env.RAWG_API_KEY;
    const response = await axios.get(
      `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`,
    );
    const data = response.data;

    const addedByStatus = data.added_by_status;
    const stores = data.stores.map((store: any) => ({
      id: store.id,
      store: {
        id: store.store.id,
        name: store.store.name,
        slug: store.store.slug,
        domain: store.store.domain,
        gamesCount: store.store.games_count,
        imageBackground: store.store.image_background,
      },
    }));
    const publisher = data.publishers[0]?.name || 'Unknown';

    return new Game(
      null,
      gameId,
      data.name,
      data.description_raw,
      data.rating,
      new Date(data.released),
      data.background_image,
      data.tba,
      addedByStatus,
      publisher,
      stores,
    );
  }
}
