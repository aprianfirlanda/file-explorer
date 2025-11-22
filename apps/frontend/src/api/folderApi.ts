import {API_BASE_URL, request} from "./httpClient.ts";
import type {FolderEntity, FolderNode} from "../types/folder.ts";
import type {ApiResponse} from "../types/api.ts";

export function fetchFolderTree() {
  return request<ApiResponse<FolderNode[]>>(`${API_BASE_URL}/folders/tree`);
}

export function fetchFolderChildren(folderId: string) {
  return request<ApiResponse<FolderEntity[]>>(`${API_BASE_URL}/folders/${folderId}/children`);
}
