import {folderService} from "./folder.service";
import {Elysia} from "elysia";

export const folderRouter = () =>
  new Elysia({prefix: "/folders"})
    // 1. Full folder tree (for left panel)
    .get("/tree", async () => {
      const data = await folderService.getFolderTree();
      return { data };
    })

    // 2. Direct children of a folder (for right panel)
    .get("/:id/children", async ({params}) => {
      const data = await folderService.getChildren(params.id);
      return { data };
    })
