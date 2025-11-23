import { computed, ref } from "vue";
import type { FolderNode } from "../types/folder";
import { fetchFolderTree } from "../api/folderApiV1";
import { findPathToFolder } from "../utils/folderTree";

type FetchFolderTreeFn = () => Promise<{ data: FolderNode[] }>;

// factory with DI
export function createFolderTree(fetchTree: FetchFolderTreeFn) {
  const tree = ref<FolderNode[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const expandedIds = ref<Set<string>>(new Set());
  const selectedId = ref<string | null>(null);

  async function loadTree() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchTree();
      tree.value = res.data;
    } catch (e: unknown) {
      const err = e as { message?: string };
      error.value = err?.message ?? "Failed to load folder tree";
    } finally {
      isLoading.value = false;
    }
  }

  function toggleExpand(id: string) {
    const set = new Set(expandedIds.value);
    set.has(id) ? set.delete(id) : set.add(id);
    expandedIds.value = set;
  }

  function select(id: string) {
    selectedId.value = id;
  }

  const isExpanded = (id: string) => expandedIds.value.has(id);
  const isSelected = (id: string) => selectedId.value === id;

  const selectedPath = computed<FolderNode[]>(() => {
    if (!selectedId.value) return [];
    const path = findPathToFolder(tree.value, selectedId.value);
    return path ?? [];
  });

  const breadcrumbs = computed(() =>
    selectedPath.value.map((node) => ({
      id: node.id,
      name: node.name,
    }))
  );

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
    breadcrumbs,
  };
}

// app usage (production)
export function useFolderTree() {
  return createFolderTree(fetchFolderTree);
}
