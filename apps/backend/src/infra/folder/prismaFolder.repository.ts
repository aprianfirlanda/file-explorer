import { prisma } from "../db/prismaClient";
import type { FolderRepository } from "../../core/folder/folder.port";
import type { FolderEntity } from "../../core/folder/folder.entity";

export class PrismaFolderRepository implements FolderRepository {
  async getByParentId(parentId: string): Promise<FolderEntity[]> {
    const folders = await prisma.folder.findMany({
      where: { parentId },
      orderBy: { name: "asc" },
    });

    return folders.map((f) => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));
  }

  async getAll(): Promise<FolderEntity[]> {
    const folders = await prisma.folder.findMany({
      orderBy: { name: "asc" },
    });

    return folders.map((f) => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));
  }

  async searchByName(q: string): Promise<FolderEntity[]> {
    const folders = await prisma.folder.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
    });

    return folders.map((f) => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));
  }

  async create(name: string, parentId: string | null): Promise<FolderEntity> {
    const folder = await prisma.folder.create({
      data: {
        name,
        parentId,
      },
    });

    return this.mapFolder(folder);
  }

  async deleteById(id: string): Promise<void> {
    await prisma.folder.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<FolderEntity | null> {
    const folder = await prisma.folder.findUnique({
      where: { id },
    });

    return folder ? this.mapFolder(folder) : null;
  }

  private mapFolder(f: any): FolderEntity {
    return {
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    };
  }
}
