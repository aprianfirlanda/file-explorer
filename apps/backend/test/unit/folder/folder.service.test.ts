import {beforeEach, describe, expect, it} from "bun:test";
import {FolderService} from "../../../src/core/folder/folder.service";
import type {FolderEntity} from "../../../src/core/folder/folder.entity";
import type {FileEntity} from "../../../src/core/file/file.entity";
import {InMemoryFolderRepository} from "../../_doubles/inMemoryFolderRepository.ts";
import {InMemoryFileRepository} from "../../_doubles/inMemoryFileRepository.ts";

describe("FolderService", () => {
  let folderRepo: InMemoryFolderRepository;
  let fileRepo: InMemoryFileRepository;
  let service: FolderService;

  beforeEach(() => {
    const now = new Date();

    const folders: FolderEntity[] = [
      { id: "root1", name: "Documents", parentId: null, createdAt: now, updatedAt: now },
      { id: "root2", name: "Music", parentId: null, createdAt: now, updatedAt: now },
      { id: "child1", name: "Projects", parentId: "root1", createdAt: now, updatedAt: now },
      { id: "child2", name: "Personal", parentId: "root1", createdAt: now, updatedAt: now },
    ];

    const files: FileEntity[] = [
      {
        id: "file1",
        name: "resume.pdf",
        folderId: "root1",
        sizeBytes: 1024,
        mimeType: "application/pdf",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "file2",
        name: "song.mp3",
        folderId: "root2",
        sizeBytes: 2048,
        mimeType: "audio/mpeg",
        createdAt: now,
        updatedAt: now,
      },
    ];

    folderRepo = new InMemoryFolderRepository(folders);
    fileRepo = new InMemoryFileRepository(files);
    service = new FolderService(folderRepo, fileRepo);
  });

  it("getContents() returns direct subfolders and files for given parentId", async () => {
    const result = await service.getContents("root1");

    expect(result.folders.map((f) => f.name)).toEqual(["Personal", "Projects"]);
    expect(result.files.map((f) => f.name)).toEqual(["resume.pdf"]);
  });

  it("getFolderTree() builds full nested tree", async () => {
    const tree = await service.getFolderTree();

    // should have 2 roots
    expect(tree.map((n) => n.name)).toEqual(["Documents", "Music"]);

    const documents = tree.find((n) => n.name === "Documents")!;
    expect(documents.children.map((c) => c.name).sort()).toEqual(["Personal", "Projects"]);
  });
});
