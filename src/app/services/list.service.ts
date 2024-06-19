import { Injectable, NotFoundException } from '@nestjs/common';
import { ListRepository } from '@/infra/repositories/list.repository';
import { GameRepository } from '@/infra/repositories/game.repository';
import { CreateListDto } from '@/app/dto/create-list.dto';
import { List } from '@/domain/entities/list.entity';
import { GameService } from './game.service';

@Injectable()
export class ListService {
  constructor(
    private readonly listRepository: ListRepository,
    private readonly gameRepository: GameRepository,
    private readonly gameService: GameService,
  ) {}

  async create(createListDto: CreateListDto, username: string): Promise<List> {
    const games = await Promise.all(
      createListDto.games.map(async (gameId) => {
        let game = await this.gameRepository.findById(gameId);
        if (!game) {
          game = await this.gameService.fetchGameFromApi(gameId);
          await this.gameRepository.create(game);
        }
        return gameId;
      }),
    );

    const list = new List(
      null,
      new Date().toISOString(),
      username,
      createListDto.title,
      createListDto.description,
      new Date().toISOString(),
      0,
      [],
      games,
    );

    return this.listRepository.create(list);
  }

  async findByUser(username: string): Promise<List[]> {
    return this.listRepository.findByUser(username);
  }

  async findAll(): Promise<List[]> {
    return this.listRepository.findAll();
  }

  async findById(listId: string): Promise<List | null> {
    return this.listRepository.findById(listId);
  }

  async updateList(
    listId: string,
    updateData: Partial<CreateListDto>,
  ): Promise<List> {
    const list = await this.listRepository.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }
    if (updateData.title) list.title = updateData.title;
    if (updateData.description) list.description = updateData.description;

    list.updatedAt = new Date().toISOString();

    return this.listRepository.update(list);
  }

  async addGamesToList(listId: string, gameIds: string[]): Promise<List> {
    const list = await this.listRepository.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }
    console.log(gameIds);
    const games = await Promise.all(
      gameIds.map(async (gameId) => {
        let game = await this.gameRepository.findById(gameId);
        if (!game) {
          game = await this.gameService.fetchGameFromApi(gameId);
          await this.gameRepository.create(game);
        }
        return gameId;
      }),
    );

    list.addGames(games);
    return this.listRepository.update(list);
  }

  async removeGamesFromList(listId: string, gameIds: string[]): Promise<List> {
    const list = await this.listRepository.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    list.removeGames(gameIds);
    return this.listRepository.update(list);
  }

  async delete(listId: string): Promise<void> {
    const list = await this.listRepository.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }
    await this.listRepository.delete(listId);
  }
}
