<template>
  <div class="explorer-root">
    <section class="explorer-panel explorer-panel-left">
      <header class="explorer-panel-header">
        <span>Folders</span>
      </header>

      <div class="explorer-panel-body">
        <FolderTree
            :tree="tree"
            :is-loading="treeLoading"
            :error="treeError"
            :expanded-ids="expandedIds"
            :selected-id="selectedId"
            @toggle="onToggle"
            @select="onSelect"
        />
      </div>
    </section>

    <section class="explorer-panel explorer-panel-right">
      <header class="explorer-panel-header">
        <span>Contents</span>
      </header>
      <div class="explorer-panel-body">
        <RightPanel
            :selected-id="selectedId"
            :folders="folders"
            :files="files"
            :is-loading="contentsLoading"
            :error="contentsError"
        />
      </div>
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
  toggleExpand,
  selectedId,
  select,
} = useFolderTree();

loadTree();

// for right panel
const getSelectedId = () => selectedId.value;
const {
  folders,
  files,
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
.explorer-root {
  display: flex;
  height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  color: #1f2933;
}

.explorer-panel {
  display: flex;
  flex-direction: column;
}

.explorer-panel-left {
  width: 30%;
  min-width: 240px;
  border-right: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.explorer-panel-right {
  flex: 1;
}

.explorer-panel-header {
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f3f4f6;
  font-weight: 600;
  font-size: 13px;
}

.explorer-panel-body {
  flex: 1;
  overflow: auto;
}
</style>
