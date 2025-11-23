import { describe, it, expect, beforeEach } from "bun:test";
import { FolderService } from "../../../src/core/folder/folder.service";
import type { FolderEntity } from "../../../src/core/folder/folder.entity";
import type { FileEntity } from "../../../src/core/file/file.entity";
import { InMemoryFolderRepository } from "../../_doubles/inMemoryFolderRepository";
import { InMemoryFileRepository } from "../../_doubles/inMemoryFileRepository";

describe("FolderService - create & delete", () => {
  let folderRepo: InMemoryFolderRepository;
  let fileRepo: InMemoryFileRepository;
  let service: FolderService;

  beforeEach(() => {
    const now = new Date();

    const folders: FolderEntity[] = [
      { id: "root", name: "Root", parentId: null, createdAt: now, updatedAt: now },
      { id: "child", name: "Child", parentId: "root", createdAt: now, updatedAt: now },
    ];

    const files: FileEntity[] = [
      {
        id: "file1",
        name: "doc.txt",
        folderId: "child",
        sizeBytes: 123,
        mimeType: "text/plain",
        createdAt: now,
        updatedAt: now,
      },
    ];

    folderRepo = new InMemoryFolderRepository(folders);
    fileRepo = new InMemoryFileRepository(files);
    service = new FolderService(folderRepo, fileRepo);
  });

  it("creates a folder under an existing parent", async () => {
    const folder = await service.createFolder({
      name: "New Folder",
      parentId: "root",
    });

    expect(folder.id).toBeDefined();
    expect(folder.name).toBe("New Folder");
    expect(folder.parentId).toBe("root");

    const children = await folderRepo.getByParentId("root");
    const names = children.map((c) => c.name);
    expect(names).toContain("New Folder");
  });

  it("throws error when parent does not exist", async () => {
    expect(
      service.createFolder({
        name: "Invalid Parent Folder",
        parentId: "not-exist",
      })
    ).rejects.toThrow("Parent folder not found");
  });

  it("deletes an empty folder", async () => {
    // create empty folder first
    const empty = await service.createFolder({
      name: "Temp",
      parentId: "root",
    });

    await service.deleteFolder(empty.id);

    const found = await folderRepo.findById(empty.id);
    expect(found).toBeNull();
  });

  it("throws error when deleting non-existent folder", async () => {
    expect(service.deleteFolder("unknown")).rejects.toThrow(
      "Folder not found"
    );
  });

  it("throws error when deleting non-empty folder (has children or files)", async () => {
    // "child" folder already has a file in beforeEach
    expect(service.deleteFolder("child")).rejects.toThrow(
      "Folder is not empty"
    );
  });
});
