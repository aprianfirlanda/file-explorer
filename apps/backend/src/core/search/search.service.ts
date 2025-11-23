import type { FolderContent } from "../folder/folder.types";
import type { SearchParams } from "./search.types";
import type { FolderRepository } from "../folder/folder.port";
import type { FileRepository } from "../file/file.port";

export class SearchService {
  constructor(
    private readonly folderRepo: FolderRepository,
    private readonly fileRepo: FileRepository
  ) {}

  async search({ q }: SearchParams): Promise<FolderContent> {
    if (!q.trim()) {
      return { folders: [], files: [] };
    }

    const [folders, files] = await Promise.all([
      this.folderRepo.searchByName(q),
      this.fileRepo.searchByName(q),
    ]);

    return { folders, files };
  }
}
