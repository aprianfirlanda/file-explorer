import {API_BASE_URL, request} from "./httpClient.ts";
import type {FolderEntity, FolderNode} from "../types/folder.ts";

export function fetchFolderTree() {
  return request<FolderNode[]>(`${API_BASE_URL}/folders/tree`);
}

export function fetchFolderChildren(folderId: string) {
  return request<FolderEntity[]>(`${API_BASE_URL}/folders/${folderId}/children`);
}
