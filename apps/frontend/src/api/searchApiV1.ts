import {API_BASE_URL, request} from "./httpClient.ts";
import type {FolderContent} from "../types/folder.ts";
import type {ApiResponse} from "../types/api.ts";

const API_PREFIX = "/v1/search";

export function fetchSearch(q: string) {
  return request<ApiResponse<FolderContent>>(`${API_BASE_URL}${API_PREFIX}?q=${encodeURIComponent(q)}`);
}
