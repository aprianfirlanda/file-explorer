import { describe, it, expect } from "bun:test";
import { buildApp } from "../../src/app";
import type { FolderEntity } from "../../src/core/folder/folder.entity";
import type { FileEntity } from "../../src/core/file/file.entity";
import { InMemoryFolderRepository } from "../_doubles/inMemoryFolderRepository";
import { InMemoryFileRepository } from "../_doubles/inMemoryFileRepository";

describe("HTTP: DELETE /api/v1/folders/:id", () => {
  it("deletes an empty folder and returns 204", async () => {
    const now = new Date();

    const folders: FolderEntity[] = [
      { id: "root", name: "Root", parentId: null, createdAt: now, updatedAt: now },
      { id: "temp", name: "Temp", parentId: "root", createdAt: now, updatedAt: now },
    ];

    const folderRepo = new InMemoryFolderRepository(folders);
    const fileRepo = new InMemoryFileRepository([]);

    const app = buildApp({ folderRepo, fileRepo });

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders/temp", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(204);

    const stillThere = await folderRepo.findById("temp");
    expect(stillThere).toBeNull();
  });

  it("returns 400 when folder does not exist", async () => {
    const folderRepo = new InMemoryFolderRepository([]);
    const fileRepo = new InMemoryFileRepository([]);

    const app = buildApp({ folderRepo, fileRepo });

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders/not-found", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(400);
    const body: any = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 400 when folder is not empty", async () => {
    const now = new Date();

    const folders: FolderEntity[] = [
      { id: "root", name: "Root", parentId: null, createdAt: now, updatedAt: now },
      { id: "with-child", name: "With Child", parentId: "root", createdAt: now, updatedAt: now },
    ];

    const files: FileEntity[] = [
      {
        id: "file1",
        name: "inside.txt",
        folderId: "with-child",
        sizeBytes: 42,
        mimeType: "text/plain",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const folderRepo = new InMemoryFolderRepository(folders);
    const fileRepo = new InMemoryFileRepository(files);

    const app = buildApp({ folderRepo, fileRepo });

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders/with-child", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(400);

    const body: any = await res.json();
    expect(body.error).toContain("not empty");
  });
});
