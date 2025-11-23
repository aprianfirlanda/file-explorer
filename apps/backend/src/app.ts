import {Elysia} from "elysia";

import {PrismaFolderRepository} from "./infra/folder/prismaFolder.repository";
import {PrismaFileRepository} from "./infra/file/prismaFile.repository";

import {FolderService} from "./core/folder/folder.service";
import {SearchService} from "./core/search/search.service";

import {createFolderRouterV1} from "./interface/http/elysia/folder.router.v1";
import {createSearchRouterV1} from "./interface/http/elysia/search.router.v1";

export function createApp() {
  // Infra
  const folderRepo = new PrismaFolderRepository();
  const fileRepo = new PrismaFileRepository();

  // Core services
  const folderService = new FolderService(folderRepo, fileRepo);
  const searchService = new SearchService(folderRepo, fileRepo);

  // HTTP routers
  const apiV1Routes = new Elysia({ prefix: "/api/v1" })
    .use(createFolderRouterV1(folderService))
    .use(createSearchRouterV1(searchService));

  return new Elysia().use(apiV1Routes);
}
