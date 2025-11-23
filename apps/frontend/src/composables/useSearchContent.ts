import { ref, watch, type Ref } from "vue";
import type { FolderContent, FolderEntity } from "../types/folder";
import type { FileEntity } from "../types/file.types";
import { fetchSearch } from "../api/searchApiV1";

type SearchFn = (q: string) => Promise<{ data: FolderContent }>;

export function createSearchContent(
  baseFolders: Ref<FolderEntity[]>,
  baseFiles: Ref<FileEntity[]>,
  searchFn: SearchFn
) {
  const searchQuery = ref("");
  const lastQuery = ref("");
  const searchActive = ref(false);
  const searchLoading = ref(false);

  const content = ref<FolderContent>({
    folders: baseFolders.value,
    files: baseFiles.value,
  });

  // when not searching, always mirror base data
  watch(
    [baseFolders, baseFiles, searchActive],
    () => {
      if (!searchActive.value) {
        content.value = {
          folders: baseFolders.value,
          files: baseFiles.value,
        };
      }
    },
    { immediate: true }
  );

  async function handleSearch() {
    const q = searchQuery.value.trim();

    if (!q) {
      searchActive.value = false;
      content.value = {
        folders: baseFolders.value,
        files: baseFiles.value,
      };
      return;
    }

    searchLoading.value = true;
    searchActive.value = true;
    lastQuery.value = q;

    try {
      const res = await searchFn(q);
      content.value = res.data;
    } catch (e) {
      console.error("Search error", e);
      content.value = {
        folders: baseFolders.value,
        files: baseFiles.value,
      };
    } finally {
      searchLoading.value = false;
    }
  }

  function resetSearch() {
    searchActive.value = false;
    searchQuery.value = "";
    content.value = {
      folders: baseFolders.value,
      files: baseFiles.value,
    };
  }

  return {
    searchQuery,
    lastQuery,
    searchActive,
    searchLoading,
    content,
    handleSearch,
    resetSearch,
  };
}

export function useSearchContent(
  baseFolders: Ref<FolderEntity[]>,
  baseFiles: Ref<FileEntity[]>
) {
  return createSearchContent(baseFolders, baseFiles, fetchSearch);
}
