import {describe, expect, it} from "bun:test";
import {buildApp} from "../../src/app";
import type {FolderEntity} from "../../src/core/folder/folder.entity";
import {InMemoryFolderRepository} from "../_doubles/inMemoryFolderRepository";
import {InMemoryFileRepository} from "../_doubles/inMemoryFileRepository";

describe("HTTP: GET /api/v1/folders/tree", () => {
  it("returns full folder tree", async () => {
    const now = new Date();

    const folders: FolderEntity[] = [
      {id: "root1", name: "Documents", parentId: null, createdAt: now, updatedAt: now},
      {id: "root2", name: "Music", parentId: null, createdAt: now, updatedAt: now},
      {id: "child1", name: "Projects", parentId: "root1", createdAt: now, updatedAt: now},
    ];

    const folderRepo = new InMemoryFolderRepository(folders);
    const fileRepo = new InMemoryFileRepository([]);

    const app = buildApp({folderRepo, fileRepo});

    const res = await app.handle(
      new Request("http://localhost/api/v1/folders/tree")
    );

    expect(res.status).toBe(200);

    const body: any = await res.json();
    const tree = body.data;

    // 2 roots
    expect(tree.map((n: any) => n.name).sort()).toEqual(["Documents", "Music"]);

    const docs = tree.find((n: any) => n.name === "Documents");
    expect(docs.children.map((c: any) => c.name)).toEqual(["Projects"]);
  });
});
