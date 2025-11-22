import {ref, watch} from "vue";
import {fetchFolderChildren} from "../api/folderApi";
import type {FolderEntity} from "../types/folder";

export function useRightPanel(selectedIdRef: () => string | null) {
  const folders = ref<FolderEntity[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadContents(folderId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchFolderChildren(folderId);
      folders.value = res.data;
    } catch (e: any) {
      error.value = e.message ?? "Failed to load contents";
      folders.value = [];
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
      }
    },
    { immediate: true }
  );

  return {
    folders,
    isLoading,
    error,
    reload: () => {
      const id = selectedIdRef();
      if (id) loadContents(id);
    },
  };
}
