import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GameInteractionSchema,
  GameInteractionDocument,
} from '@/infra/schemas/game-interaction.schema';
import { IGameInteractionRepository } from '@/domain/repositories/game-interaction.repository.interface';
import { GameInteraction } from '@/domain/entities/game-interaction.entity';
@Injectable()
export class GameInteractionRepository implements IGameInteractionRepository {
  constructor(
    @InjectModel(GameInteractionSchema.name)
    private interactionModel: Model<GameInteractionDocument>,
  ) {}

  private toDomain(
    interactionDocument: GameInteractionDocument,
  ): GameInteraction {
    return new GameInteraction(
      interactionDocument._id.toString(),
      interactionDocument.userId,
      interactionDocument.gameId,
      interactionDocument.liked,
      interactionDocument.played,
    );
  }

  private toSchema(
    interaction: GameInteraction,
  ): Partial<GameInteractionDocument> {
    return {
      userId: interaction.userId,
      gameId: interaction.gameId,
      liked: interaction.liked,
      played: interaction.played,
    };
  }

  async create(interaction: GameInteraction): Promise<GameInteraction> {
    const createdInteraction = new this.interactionModel(
      this.toSchema(interaction),
    );
    const savedInteraction = await createdInteraction.save();
    return this.toDomain(savedInteraction);
  }

  async findByUserAndGame(
    userId: string,
    gameId: string,
  ): Promise<GameInteraction | null> {
    const interactionDocument = await this.interactionModel
      .findOne({ userId, gameId })
      .exec();
    return interactionDocument ? this.toDomain(interactionDocument) : null;
  }

  async update(interaction: GameInteraction): Promise<GameInteraction> {
    const updatedInteraction = await this.interactionModel
      .findByIdAndUpdate(interaction.id, this.toSchema(interaction), {
        new: true,
      })
      .exec();
    return this.toDomain(updatedInteraction);
  }
}
