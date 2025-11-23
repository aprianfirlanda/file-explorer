import type { FileEntity } from "./file.entity";

export interface FileRepository {
  getByFolderId(folderId: string): Promise<FileEntity[]>;
  searchByName(q: string): Promise<FileEntity[]>;
}
