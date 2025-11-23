import { Elysia } from "elysia";
import type { FolderService } from "../../../core/folder/folder.service";

export const createFolderRouterV1 = (folderService: FolderService) =>
  new Elysia({ prefix: "/folders" })
    .get("/tree", async () => {
      const data = await folderService.getFolderTree();
      return { data };
    })
    .get("/:id/contents", async ({ params }) => {
      const data = await folderService.getContents(params.id);
      return { data };
    });
