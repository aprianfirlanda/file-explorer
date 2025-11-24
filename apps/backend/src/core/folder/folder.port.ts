import type { FolderEntity } from "./folder.entity";

export interface FolderRepository {
  getByParentId(parentId: string): Promise<FolderEntity[]>;
  getAll(): Promise<FolderEntity[]>;
  searchByName(q: string): Promise<FolderEntity[]>;
  create(name: string, parentId: string | null): Promise<FolderEntity>;
  deleteById(id: string): Promise<void>;
  findById(id: string): Promise<FolderEntity | null>;
}
