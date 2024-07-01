import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GameInteractionSchema,
  GameInteractionDocument,
} from '@/infra/schemas/game-interaction.schema';
import { GameInteraction } from '@/domain/entities/game-interaction.entity';
import { IGameInteractionRepository } from '@/domain/repositories/game-interaction.repository.interface';

@Injectable()
export class GameInteractionRepository implements IGameInteractionRepository {
  constructor(
    @InjectModel(GameInteractionSchema.name)
    private gameInteractionModel: Model<GameInteractionDocument>,
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
    const createdInteraction = new this.gameInteractionModel(
      this.toSchema(interaction),
    );
    const savedInteraction = await createdInteraction.save();
    return this.toDomain(savedInteraction);
  }

  async update(interaction: GameInteraction): Promise<GameInteraction> {
    const updatedInteraction = await this.gameInteractionModel
      .findByIdAndUpdate(interaction.id, this.toSchema(interaction), {
        new: true,
      })
      .exec();
    return this.toDomain(updatedInteraction);
  }

  async delete(id: string): Promise<void> {
    await this.gameInteractionModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<GameInteraction[]> {
    const interactionDocuments = await this.gameInteractionModel.find().exec();
    return interactionDocuments.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<GameInteraction | null> {
    const interactionDocument = await this.gameInteractionModel
      .findById(id)
      .exec();
    return interactionDocument ? this.toDomain(interactionDocument) : null;
  }

  async findByUserIdAndGameId(
    userId: string,
    gameId: string,
  ): Promise<GameInteraction | null> {
    const interactionDocument = await this.gameInteractionModel
      .findOne({ userId, gameId })
      .exec();
    return interactionDocument ? this.toDomain(interactionDocument) : null;
  }

  async findByUserId(userId: string): Promise<GameInteraction[]> {
    console.log(userId, 'repo');
    const interactionDocuments = await this.gameInteractionModel
      .find({ userId })
      .exec();
    return interactionDocuments.map((doc) => this.toDomain(doc));
  }
}
