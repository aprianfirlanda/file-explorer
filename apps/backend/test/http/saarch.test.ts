import {describe, expect, it} from "bun:test";
import {buildApp} from "../../src/app";
import type {FolderEntity} from "../../src/core/folder/folder.entity";
import type {FileEntity} from "../../src/core/file/file.entity";
import {InMemoryFolderRepository} from "../_doubles/inMemoryFolderRepository";
import {InMemoryFileRepository} from "../_doubles/inMemoryFileRepository";

describe("HTTP: GET /api/v1/search", () => {
  it("returns empty arrays when nothing matches", async () => {
    const folderRepo = new InMemoryFolderRepository([]);
    const fileRepo = new InMemoryFileRepository([]);
    const app = buildApp({folderRepo, fileRepo});

    const res = await app.handle(
      new Request("http://localhost/api/v1/search?q=something")
    );

    expect(res.status).toBe(200);

    const body: any = await res.json();
    expect(body.data.folders).toHaveLength(0);
    expect(body.data.files).toHaveLength(0);
  });

  it("searches folders and files by name (case-insensitive)", async () => {
    const now = new Date();

    const folders: FolderEntity[] = [
      {id: "f1", name: "Documents", parentId: null, createdAt: now, updatedAt: now},
      {id: "f2", name: "Downloads", parentId: null, createdAt: now, updatedAt: now},
    ];

    const files: FileEntity[] = [
      {
        id: "file1",
        name: "my-doc.pdf",
        folderId: "f1",
        sizeBytes: 100,
        mimeType: "application/pdf",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "file2",
        name: "photo.png",
        folderId: "f2",
        sizeBytes: 200,
        mimeType: "image/png",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const folderRepo = new InMemoryFolderRepository(folders);
    const fileRepo = new InMemoryFileRepository(files);
    const app = buildApp({folderRepo, fileRepo});

    const res = await app.handle(
      new Request("http://localhost/api/v1/search?q=doc")
    );

    expect(res.status).toBe(200);

    const body: any = await res.json();
    const {folders: resultFolders, files: resultFiles} = body.data;

    expect(resultFolders.map((f: any) => f.name)).toEqual(["Documents"]);
    expect(resultFiles.map((f: any) => f.name)).toEqual(["my-doc.pdf"]);
  });
});
