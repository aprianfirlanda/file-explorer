import { describe, it, expect } from "bun:test";
import { buildApp } from "../../src/app";
import type { FolderEntity } from "../../src/core/folder/folder.entity";
import { InMemoryFolderRepository } from "../_doubles/inMemoryFolderRepository";
import { InMemoryFileRepository } from "../_doubles/inMemoryFileRepository";

describe("HTTP: POST /api/v1/folders", () => {
  it("creates folder under root", async () => {
    const now = new Date();

    const initialFolders: FolderEntity[] = [
      { id: "root", name: "Root", parentId: null, createdAt: now, updatedAt: now },
    ];

    const folderRepo = new InMemoryFolderRepository(initialFolders);
    const fileRepo = new InMemoryFileRepository([]);

    const app = buildApp({ folderRepo, fileRepo });

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "New Folder",
          parentId: "root",
        }),
      })
    );

    expect(res.status).toBe(201);

    const body: any = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe("New Folder");
    expect(body.data.parentId).toBe("root");
  });

  it("returns 400 when parent does not exist", async () => {
    const folderRepo = new InMemoryFolderRepository([]);
    const fileRepo = new InMemoryFileRepository([]);

    const app = buildApp({ folderRepo, fileRepo });

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Orphan",
          parentId: "does-not-exist",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body: any = await res.json();
    expect(body.error).toBeDefined();
  });
});
