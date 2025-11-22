import {API_BASE_URL, request} from "./httpClient.ts";
import type {FolderContent, FolderNode} from "../types/folder.ts";
import type {ApiResponse} from "../types/api.ts";

export function fetchFolderTree() {
  return request<ApiResponse<FolderNode[]>>(`${API_BASE_URL}/folders/tree`);
}

export function fetchFolderContents(folderId: string) {
  return request<ApiResponse<FolderContent>>(`${API_BASE_URL}/folders/${folderId}/contents`);
}
