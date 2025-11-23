import {describe, expect, it} from "bun:test";
import {buildApp} from "../../src/app";
import type {FolderEntity} from "../../src/core/folder/folder.entity";
import type {FileEntity} from "../../src/core/file/file.entity";
import {InMemoryFolderRepository} from "../_doubles/inMemoryFolderRepository";
import {InMemoryFileRepository} from "../_doubles/inMemoryFileRepository";

describe("HTTP: GET /api/v1/folders/:id/contents", () => {
  it("returns subfolders and files for a folder", async () => {
    const now = new Date();

    const folders: FolderEntity[] = [
      {id: "root", name: "Root", parentId: null, createdAt: now, updatedAt: now},
      {id: "child1", name: "Projects", parentId: "root", createdAt: now, updatedAt: now},
      {id: "child2", name: "Personal", parentId: "root", createdAt: now, updatedAt: now},
      {id: "other", name: "Other", parentId: null, createdAt: now, updatedAt: now},
    ];

    const files: FileEntity[] = [
      {
        id: "file1",
        name: "resume.pdf",
        folderId: "root",
        sizeBytes: 1024,
        mimeType: "application/pdf",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "file2",
        name: "photo.jpg",
        folderId: "child1",
        sizeBytes: 2048,
        mimeType: "image/jpeg",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const folderRepo = new InMemoryFolderRepository(folders);
    const fileRepo = new InMemoryFileRepository(files);

    const app = buildApp({folderRepo, fileRepo});

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders/root/contents")
    );

    expect(res.status).toBe(200);

    const body: any = await res.json();
    // your router returns { data: { folders, files } }
    const result = body.data;

    expect(result.folders.map((f: any) => f.name).sort()).toEqual(
      ["Personal", "Projects"]
    );
    expect(result.files.map((f: any) => f.name)).toEqual(["resume.pdf"]);
  });
});
