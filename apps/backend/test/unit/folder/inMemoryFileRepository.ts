import type { FileRepository } from "../../../src/core/file/file.port";
import type { FileEntity } from "../../../src/core/file/file.entity";

export class InMemoryFileRepository implements FileRepository {
  private files: FileEntity[] = [];

  constructor(initial: FileEntity[] = []) {
    this.files = initial;
  }

  setData(data: FileEntity[]) {
    this.files = data;
  }

  async getByFolderId(folderId: string): Promise<FileEntity[]> {
    return this.files
      .filter((f) => f.folderId === folderId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async searchByName(q: string): Promise<FileEntity[]> {
    const term = q.toLowerCase();
    return this.files
      .filter((f) => f.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
