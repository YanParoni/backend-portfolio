import { List } from '@/domain/entities/list.entity';

export interface IListRepository {
  create(list: List): Promise<List>;
  findAll(): Promise<List[]>;
  findById(id: string): Promise<List | null>;
  update(list: List): Promise<List>;
  delete(id: string): Promise<void>;
}
