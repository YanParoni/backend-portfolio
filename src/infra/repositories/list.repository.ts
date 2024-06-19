import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListDocument, ListSchema } from '@/infra/schemas/list.schema';
import { List as ListEntity } from '@/domain/entities/list.entity';
import { IListRepository } from '@/domain/repositories/list.repository.interface';

@Injectable()
export class ListRepository implements IListRepository {
  constructor(
    @InjectModel(ListSchema.name) private listModel: Model<ListDocument>,
  ) {}

  private toDomain(listDocument: ListDocument): ListEntity {
    return new ListEntity(
      listDocument._id.toString(),
      listDocument.createdAt,
      listDocument.username,
      listDocument.title,
      listDocument.description,
      listDocument.updatedAt,
      listDocument.likesCount,
      listDocument.comments,
      listDocument.games,
    );
  }

  private toSchema(list: ListEntity): Partial<ListDocument> {
    return {
      createdAt: list.createdAt,
      username: list.username,
      title: list.title,
      description: list.description,
      updatedAt: list.updatedAt,
      likesCount: list.likesCount,
      comments: list.comments,
      games: list.games,
    };
  }

  async create(list: ListEntity): Promise<ListEntity> {
    const createdList = new this.listModel(this.toSchema(list));
    const savedList = await createdList.save();
    return this.toDomain(savedList);
  }

  async findAll(): Promise<ListEntity[]> {
    const listDocuments = await this.listModel.find().exec();
    return listDocuments.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<ListEntity | null> {
    const listDocument = await this.listModel.findById(id).exec();
    return listDocument ? this.toDomain(listDocument) : null;
  }

  async findByUser(username: string): Promise<ListEntity[]> {
    const listDocuments = await this.listModel.find({ username }).exec();
    return listDocuments.map((doc) => this.toDomain(doc));
  }

  async update(list: ListEntity): Promise<ListEntity> {
    list.updatedAt = new Date().toString();
    const updatedList = await this.listModel
      .findByIdAndUpdate(list.id, this.toSchema(list), { new: true })
      .exec();
    return this.toDomain(updatedList);
  }

  async delete(id: string): Promise<void> {
    await this.listModel.findByIdAndDelete(id).exec();
  }
}
