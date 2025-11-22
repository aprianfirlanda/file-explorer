import type {Folder} from "../../generated/prisma/client.ts";
import type {FileEntity} from "../file/file.types.ts";

export type FolderEntity = Folder;

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderNode[];
}

export interface FolderContent {
  folders: FolderEntity[];
  files: FileEntity[];
}
