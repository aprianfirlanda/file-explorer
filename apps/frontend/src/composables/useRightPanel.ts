import {ref, watch} from "vue";
import {fetchFolderContents} from "../api/folderApi";
import type {FolderEntity} from "../types/folder";
import type {FileEntity} from "../types/file.types.ts";

export function useRightPanel(selectedIdRef: () => string | null) {
  const folders = ref<FolderEntity[]>([]);
  const files = ref<FileEntity[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadContents(folderId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchFolderContents(folderId);
      folders.value = res.data.folders;
      files.value = res.data.files;
    } catch (e: any) {
      error.value = e.message ?? "Failed to load contents";
      folders.value = [];
      files.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // autoload when the selected folder changes
  watch(
    selectedIdRef,
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

  return {
    folders,
    files,
    isLoading,
    error,
    reload: () => {
      const id = selectedIdRef();
      if (id) loadContents(id);
    },
  };
}
