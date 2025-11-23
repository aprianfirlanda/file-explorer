import { prisma } from "../db/prismaClient";
import type { FileRepository } from "../../core/file/file.port";
import type { FileEntity } from "../../core/file/file.entity";

export class PrismaFileRepository implements FileRepository {
  private mapFile(file: any): FileEntity {
    return {
      id: file.id,
      name: file.name,
      folderId: file.folderId,
      mimeType: file.mimeType,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      sizeBytes: file.sizeBytes ? Number(file.sizeBytes) : null,
    };
  }

  async getByFolderId(folderId: string): Promise<FileEntity[]> {
    const files = await prisma.file.findMany({
      where: { folderId },
      orderBy: { name: "asc" },
    });

    return files.map((f) => this.mapFile(f));
  }

  async searchByName(q: string): Promise<FileEntity[]> {
    const files = await prisma.file.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
    });

    return files.map((f) => this.mapFile(f));
  }
}
