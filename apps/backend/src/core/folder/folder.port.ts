import type { FolderEntity } from "./folder.entity";

export interface FolderRepository {
  getByParentId(parentId: string): Promise<FolderEntity[]>;
  getAll(): Promise<FolderEntity[]>;
  searchByName(q: string): Promise<FolderEntity[]>;
}
