import type { FolderEntity } from "./folder.entity";
import type { FileEntity } from "../file/file.entity";

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
