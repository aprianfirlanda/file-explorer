import type {Folder} from "../../generated/prisma/client.ts";

export type FolderEntity = Folder;

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderNode[];
}
