import { folderService } from "./folder.service";
import { Elysia } from "elysia";

export const folderRouter = new Elysia({ prefix: "/folders" })
  // Full folder tree (for the left panel)
  .get("/tree", async () => {
    const data = await folderService.getFolderTree();
    return { data };
  })

  // Get direct contents of a folder (subfolders and files) for the right panel
  .get("/:id/contents", async ({ params }) => {
    const data = await folderService.getContents(params.id);
    return { data };
  });
