<template>
  <div class="explorer h-screen flex">
    <!-- LEFT: tree -->
    <section class="w-1/3 border-r overflow-auto">
      <h2 class="px-4 py-2 font-semibold text-sm border-b">Folders</h2>
      <FolderTree
          :tree="tree"
          :isLoading="treeLoading"
          :error="treeError"
          :expanded-ids="expandedIds"
          :selected-id="selectedId"
          @toggle="onToggle"
          @select="onSelect"
      />
    </section>

    <!-- RIGHT: contents -->
    <section class="flex-1 overflow-auto">
      <RightPanel
          :selected-id="selectedId"
          :folders="folders"
          :isLoading="contentsLoading"
          :error="contentsError"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import FolderTree from "../explorer/FolderTree.vue";
import RightPanel from "../explorer/RightPanel.vue";
import {useFolderTree} from "../../composables/useFolderTree";
import {useRightPanel} from "../../composables/useRightPanel";

const {
  tree,
  isLoading: treeLoading,
  error: treeError,
  loadTree,
  expandedIds,
  isExpanded,
  toggleExpand,
  selectedId,
  select,
} = useFolderTree();

loadTree();

// for right panel
const getSelectedId = () => selectedId.value;
const {
  folders,
  isLoading: contentsLoading,
  error: contentsError,
} = useRightPanel(getSelectedId);

function onToggle(id: string) {
  toggleExpand(id);
}

function onSelect(id: string) {
  select(id);
}
</script>

<style scoped>
.explorer {
  font-family: system-ui, sans-serif;
  font-size: 14px;
}
</style>
