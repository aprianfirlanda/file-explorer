import {prisma} from "../../lib/prisma.ts";
import type {FolderEntity, FolderNode} from "./folder.types.ts";

class FolderService {
  async getChildren(parentId: string | null): Promise<FolderEntity[]> {
    return prisma.folder.findMany({
      where: { parentId },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Build a full folder tree (unlimited depth).
   * Returns all root folders with nested children.
   */
  async getFolderTree(): Promise<FolderNode[]> {
    const folders = await prisma.folder.findMany({
      orderBy: {name: "asc"},
    });

    // Map each folder by id, and add children array
    const map = new Map<string, FolderNode>();

    for (const f of folders) {
      map.set(f.id, {
        id: f.id,
        name: f.name,
        parentId: f.parentId ?? null,
        children: [],
      });
    }

    const roots: FolderNode[] = [];

    // Link children to parents
    for (const node of map.values()) {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // parent not found, treat as root fallback
          roots.push(node);
        }
      } else {
        // no parent -> root folder
        roots.push(node);
      }
    }

    return roots;
  }
}

export const folderService = new FolderService();
