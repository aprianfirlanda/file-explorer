import {Elysia} from 'elysia';
import {folderRouterV1} from "./modules/folder/folderRouterV1.ts";
import {searchRouterV1} from "./modules/search/searchRouterV1.ts";

const apiV1Routes = new Elysia({prefix: "/api/v1"})
  .use(folderRouterV1)
  .use(searchRouterV1);

const app = new Elysia()
  .use(apiV1Routes)
  .listen(3000)

console.log(`Elysia is running at http://localhost:${app.server?.port}`);
