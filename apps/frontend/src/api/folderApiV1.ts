import {API_BASE_URL, request} from "./httpClient.ts";
import type {FolderContent, FolderEntity, FolderNode} from "../types/folder.ts";
import type {ApiResponse} from "../types/api.ts";

const API_PREFIX = "/v1/folders";

export function fetchFolderTree() {
  return request<ApiResponse<FolderNode[]>>(`${API_BASE_URL}${API_PREFIX}/tree`);
}

export function fetchFolderContents(folderId: string) {
  return request<ApiResponse<FolderContent>>(`${API_BASE_URL}${API_PREFIX}/${folderId}/contents`);
}

export function createFolder(payload: {
  parentId: string | null;
  name: string;
}) {
  return request<ApiResponse<FolderEntity>>(`${API_BASE_URL}${API_PREFIX}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteFolder(folderId: string): Promise<void> {
  return request(`${API_BASE_URL}${API_PREFIX}/${folderId}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
  });
}
