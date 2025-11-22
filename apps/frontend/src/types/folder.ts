import type {FileEntity} from "./file.types.ts";

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderNode[];
}

export type FolderEntity = {
  id: string;
  name: string;
  parentId: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export interface FolderContent {
  folders: FolderEntity[];
  files: FileEntity[];
}
