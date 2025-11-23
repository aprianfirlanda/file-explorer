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

  async create(name: string, parentId: string | null): Promise<FolderEntity> {
    const now = new Date();
    const id = `folder_${this.folders.length + 1}`; // simple ID for tests

    const folder: FolderEntity = {
      id,
      name,
      parentId,
      createdAt: now,
      updatedAt: now,
    };

    this.folders.push(folder);
    return folder;
  }

  async deleteById(id: string): Promise<void> {
    this.folders = this.folders.filter((f) => f.id !== id);
  }

  async findById(id: string): Promise<FolderEntity | null> {
    const f = this.folders.find((f) => f.id === id);
    return f ?? null;
  }
}
