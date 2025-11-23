import { ref, watch, type Ref } from "vue";
import type { FolderEntity } from "../types/folder";
import type { FileEntity } from "../types/file.types";
import { fetchFolderContents } from "../api/folderApiV1";

type FetchContentsFn = (folderId: string) => Promise<{ data: { folders: FolderEntity[]; files: FileEntity[] } }>;

export function createRightPanel(
  selectedId: Ref<string | null>,
  fetchContents: FetchContentsFn
) {
  const folders = ref<FolderEntity[]>([]);
  const files = ref<FileEntity[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadContents(folderId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchContents(folderId);
      folders.value = res.data.folders;
      files.value = res.data.files;
    } catch (e: unknown) {
      const err = e as { message?: string };
      error.value = err?.message ?? "Failed to load contents";
      folders.value = [];
      files.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    selectedId,
    (newId) => {
      if (newId) {
        loadContents(newId);
      } else {
        folders.value = [];
        files.value = [];
      }
    },
    { immediate: true }
  );

  function reload() {
    if (selectedId.value) loadContents(selectedId.value);
  }

  return {
    folders,
    files,
    isLoading,
    error,
    reload,
  };
}

// app usage
export function useRightPanel(selectedId: Ref<string | null>) {
  return createRightPanel(selectedId, fetchFolderContents);
}
