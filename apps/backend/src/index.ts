import {Elysia} from 'elysia';
import {folderRouter} from "./modules/folder/folder.router.ts";

const apiV1Routes = new Elysia({prefix: "/api/v1"})
  .use(folderRouter);

const app = new Elysia()
  .use(apiV1Routes)
  .listen(3000)

console.log(`Elysia is running at http://localhost:${app.server?.port}`);
