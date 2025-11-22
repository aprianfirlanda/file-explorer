import type { Elysia } from "elysia";
import { folderService } from "./folder.service";

export const folderRouter = (app: Elysia) =>
  app
    // 1. Full folder tree (for left panel)
    .get("/folders/tree", async () => {
      const data = await folderService.getFolderTree();
      return { data };
    })

    // 2. Direct children of a folder (for right panel)
    .get("/folders/:id/children", async ({ params }) => {
      const data = await folderService.getChildren(params.id);
      return { data };
    })
