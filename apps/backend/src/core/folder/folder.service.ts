import type { FolderRepository } from "./folder.port";
import type { FileRepository } from "../file/file.port";
import type { FolderContent, FolderNode } from "./folder.types";

export class FolderService {
  constructor(
    private readonly folderRepo: FolderRepository,
    private readonly fileRepo: FileRepository
  ) {}

  async getContents(parentId: string): Promise<FolderContent> {
    const [folders, files] = await Promise.all([
      this.folderRepo.getByParentId(parentId),
      this.fileRepo.getByFolderId(parentId),
    ]);

    return { folders, files };
  }

  async getFolderTree(): Promise<FolderNode[]> {
    const folders = await this.folderRepo.getAll();

    const map = new Map<string, FolderNode>();

    for (const f of folders) {
      map.set(f.id, {
        id: f.id,
        name: f.name,
        parentId: f.parentId,
        children: [],
      });
    }

    const roots: FolderNode[] = [];

    for (const node of map.values()) {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async createFolder(params: { name: string; parentId?: string | null }) {
    const parentId = params.parentId ?? null;

    if (parentId) {
      const parent = await this.folderRepo.findById(parentId);
      if (!parent) {
        throw new Error("Parent folder not found");
      }
    }

    return this.folderRepo.create(params.name, parentId);
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = await this.folderRepo.findById(id);
    if (!folder) {
      throw new Error("Folder not found");
    }

    // safety: block delete if has children or files
    const [children, files] = await Promise.all([
      this.folderRepo.getByParentId(id),
      this.fileRepo.getByFolderId(id),
    ]);

    if (children.length > 0 || files.length > 0) {
      throw new Error("Folder is not empty");
    }

    await this.folderRepo.deleteById(id);
  }
}
