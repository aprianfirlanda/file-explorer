import { ref } from "vue";
import type { FolderNode } from "../types/folder";
import { fetchFolderTree } from "../api/folderApi";

export function useFolderTree() {
  const tree = ref<FolderNode[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const expandedIds = ref<Set<string>>(new Set());
  const selectedId = ref<string | null>(null);

  async function loadTree() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchFolderTree();
      tree.value = res.data;
    } catch (e: any) {
      error.value = e.message ?? "Failed to load folder tree";
    } finally {
      isLoading.value = false;
    }
  }

  function toggleExpand(id: string) {
    const set = new Set(expandedIds.value);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    expandedIds.value = set;
  }

  function select(id: string) {
    selectedId.value = id;
  }

  const isExpanded = (id: string) => expandedIds.value.has(id);
  const isSelected = (id: string) => selectedId.value === id;

  return {
    tree,
    isLoading,
    error,
    loadTree,
    expandedIds,
    isExpanded,
    toggleExpand,
    selectedId,
    select,
    isSelected,
  };
}
