import {API_BASE_URL, request} from "./httpClient.ts";
import type {FolderContent, FolderNode} from "../types/folder.ts";
import type {ApiResponse} from "../types/api.ts";

const API_PREFIX = "/v1/folders";

export function fetchFolderTree() {
  return request<ApiResponse<FolderNode[]>>(`${API_BASE_URL}${API_PREFIX}/tree`);
}

export function fetchFolderContents(folderId: string) {
  return request<ApiResponse<FolderContent>>(`${API_BASE_URL}${API_PREFIX}/${folderId}/contents`);
}
