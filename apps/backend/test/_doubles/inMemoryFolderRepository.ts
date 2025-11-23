import type {FolderRepository} from "../../src/core/folder/folder.port";
import type {FolderEntity} from "../../src/core/folder/folder.entity";

export class InMemoryFolderRepository implements FolderRepository {
  private folders: FolderEntity[] = [];

  constructor(initial: FolderEntity[] = []) {
    this.folders = initial;
  }

  setData(data: FolderEntity[]) {
    this.folders = data;
  }

  async getByParentId(parentId: string): Promise<FolderEntity[]> {
    return this.folders
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getAll(): Promise<FolderEntity[]> {
    return [...this.folders].sort((a, b) => a.name.localeCompare(b.name));
  }

  async searchByName(q: string): Promise<FolderEntity[]> {
    const term = q.toLowerCase();
    return this.folders
      .filter((f) => f.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
