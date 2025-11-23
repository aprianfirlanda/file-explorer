import {Elysia} from "elysia";

import type {FolderRepository} from "./core/folder/folder.port";
import type {FileRepository} from "./core/file/file.port";

import {PrismaFolderRepository} from "./infra/folder/prismaFolder.repository";
import {PrismaFileRepository} from "./infra/file/prismaFile.repository";

import {FolderService} from "./core/folder/folder.service";
import {SearchService} from "./core/search/search.service";

import {createFolderRouterV1} from "./interface/http/elysia/folder.router.v1";
import {createSearchRouterV1} from "./interface/http/elysia/search.router.v1";

export interface AppDeps {
  folderRepo: FolderRepository;
  fileRepo: FileRepository;
}

// Pure builder that uses whatever repos you pass (for tests & prod)
export function buildApp(deps: AppDeps) {
  const folderService = new FolderService(deps.folderRepo, deps.fileRepo);
  const searchService = new SearchService(deps.folderRepo, deps.fileRepo);

  const apiV1Routes = new Elysia({ prefix: "/api/v1" })
    .use(createFolderRouterV1(folderService))
    .use(createSearchRouterV1(searchService));

  return new Elysia().use(apiV1Routes);
}

// Default entrypoint: uses Prisma repos (for real app)
export function createApp() {
  const folderRepo = new PrismaFolderRepository();
  const fileRepo = new PrismaFileRepository();

  return buildApp({folderRepo, fileRepo});
}
