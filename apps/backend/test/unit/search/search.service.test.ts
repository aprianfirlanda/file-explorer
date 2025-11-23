import { describe, it, expect, beforeEach } from "bun:test";
import { SearchService } from "../../../src/core/search/search.service";
import type { FolderEntity } from "../../../src/core/folder/folder.entity";
import type { FileEntity } from "../../../src/core/file/file.entity";
import { InMemoryFolderRepository } from "../folder/inMemoryFolderRepository";
import { InMemoryFileRepository } from "../folder/inMemoryFileRepository";

describe("SearchService", () => {
  let folderRepo: InMemoryFolderRepository;
  let fileRepo: InMemoryFileRepository;
  let service: SearchService;

  beforeEach(() => {
    const now = new Date();

    const folders: FolderEntity[] = [
      { id: "f1", name: "Documents", parentId: null, createdAt: now, updatedAt: now },
      { id: "f2", name: "Downloads", parentId: null, createdAt: now, updatedAt: now },
      { id: "f3", name: "Music", parentId: null, createdAt: now, updatedAt: now },
    ];

    const files: FileEntity[] = [
      {
        id: "file1",
        name: "important-doc.pdf",
        folderId: "f1",
        sizeBytes: 1024,
        mimeType: "application/pdf",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "file2",
        name: "holiday-photo.jpg",
        folderId: "f2",
        sizeBytes: 2048,
        mimeType: "image/jpeg",
        createdAt: now,
        updatedAt: now,
      },
    ];

    folderRepo = new InMemoryFolderRepository(folders);
    fileRepo = new InMemoryFileRepository(files);
    service = new SearchService(folderRepo, fileRepo);
  });

  it("returns empty result when query is blank", async () => {
    const result = await service.search({ q: "   " });
    expect(result.folders).toHaveLength(0);
    expect(result.files).toHaveLength(0);
  });

  it("searches folders by name (case-insensitive)", async () => {
    const result = await service.search({ q: "doc" });

    expect(result.folders.map((f) => f.name)).toEqual(["Documents"]);
    expect(result.files.map((f) => f.name)).toEqual(["important-doc.pdf"]);
  });

  it("search matches files only when no folder matches", async () => {
    const result = await service.search({ q: "photo" });

    expect(result.folders).toHaveLength(0);
    expect(result.files.map((f) => f.name)).toEqual(["holiday-photo.jpg"]);
  });
});
