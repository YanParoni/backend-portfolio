import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSchema, GameDocument } from '@/infra/schemas/game.schema';
import { Game as GameEntity } from '@/domain/entities/game.entity';
import { IGameRepository } from '@/domain/repositories/game.repository.interface';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectModel(GameSchema.name) private gameModel: Model<GameDocument>,
  ) {}

  private toDomain(gameDocument: GameDocument): GameEntity {
    return new GameEntity(
      gameDocument._id?.toString() || '',
      gameDocument.gameId,
      gameDocument.name,
      gameDocument.description,
      gameDocument.rating,
      gameDocument.released,
      gameDocument.backgroundImage,
      gameDocument.tba,
      gameDocument.addedByStatus,
      gameDocument.publisher,
      gameDocument.stores,
    );
  }

  private toSchema(game: GameEntity): Partial<GameDocument> {
    return {
      _id: game.id ? new MongooseSchema.Types.ObjectId(game.id) : undefined,
      gameId: game.gameId,
      name: game.name,
      description: game.description,
      rating: game.rating,
      released: game.released,
      backgroundImage: game.backgroundImage,
      tba: game.tba,
      addedByStatus: game.addedByStatus,
      publisher: game.publisher,
      stores: game.stores,
    };
  }

  async create(game: GameEntity): Promise<GameEntity> {
    const createdGame = new this.gameModel(this.toSchema(game));
    const savedGame = await createdGame.save();
    return this.toDomain(savedGame);
  }

  async findAll(): Promise<GameEntity[]> {
    const gameDocuments = await this.gameModel.find().exec();
    return gameDocuments.map((doc) => this.toDomain(doc));
  }

  async findById(gameId: string): Promise<GameEntity | null> {
    const gameDocument = await this.gameModel.findOne({ gameId }).exec();
    return gameDocument ? this.toDomain(gameDocument) : null;
  }
}
