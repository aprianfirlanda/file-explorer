import type {SearchParams} from "./search.types.ts";
import type {FolderContent} from "../folder/folder.types.ts";
import {prisma} from "../../lib/prisma.ts";

class SearchService {
  async search({q}: SearchParams): Promise<FolderContent> {
    const whereFolder: any = {
      name: {
        contains: q,
        mode: 'insensitive'
      }
    };

    const whereFile: any = {
      name: {
        contains: q,
        mode: 'insensitive'
      }
    };

    const [folders, files] = await Promise.all([
      prisma.folder.findMany({
        where: whereFolder,
        orderBy: {name: 'asc'}
      }),
      prisma.file.findMany({
        where: whereFile,
        orderBy: {name: 'asc'}
      })
    ]);

    return {
      folders,
      files: files.map(file => ({...file, sizeBytes: file.sizeBytes ? Number(file.sizeBytes) : null})),};
  }
}

export const searchService = new SearchService();
