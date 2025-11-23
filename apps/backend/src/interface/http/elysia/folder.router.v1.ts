import {Elysia, t} from "elysia";
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
    })
    .post(
      "/",
      async ({ body, set }) => {
        try {
          const folder = await folderService.createFolder({
            name: body.name,
            parentId: body.parentId ?? null,
          });

          set.status = 201;
          return { data: folder };
        } catch (err: any) {
          set.status = 400;
          return { error: err.message ?? "Failed to create folder" };
        }
      },
      {
        body: t.Object({
          name: t.String({ minLength: 1 }),
          parentId: t.Optional(t.String()),
        }),
      }
    )
    .delete(
      "/:id",
      async ({ params, set }) => {
        try {
          await folderService.deleteFolder(params.id);
          set.status = 204;
          return;
        } catch (err: any) {
          // the folder isn't found / not empty
          set.status = 400;
          return { error: err.message ?? "Failed to delete folder" };
        }
      }
    );
