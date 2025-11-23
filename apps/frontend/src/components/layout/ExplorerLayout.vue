<template>
  <div class="explorer-root" data-test="explorer-root">
    <section class="explorer-panel explorer-panel-left" data-test="left-panel">
      <header
          class="explorer-panel-header"
          aria-label="Folder Panel Header"
          data-test="left-panel-header"
      >
        <span>Folders</span>
      </header>

      <div class="explorer-panel-body" data-test="left-panel-body">
        <FolderTree
            :tree="tree"
            :is-loading="treeLoading"
            :error="treeError"
            :expanded-ids="expandedIds"
            :selected-id="selectedId"
            @toggle="onToggle"
            @select="onSelect"
            data-test="folder-tree"
        />
      </div>
    </section>

    <section class="explorer-panel explorer-panel-right" data-test="right-panel">
      <header
          class="explorer-panel-header explorer-panel-header--right"
          aria-label="Contents Panel Header"
          data-test="right-panel-header"
      >
        <span>Contents</span>

        <nav
            v-if="breadcrumbs.length"
            class="breadcrumb"
            aria-label="Breadcrumb Navigation"
            data-test="breadcrumb"
        >
          <span
              v-for="(bc, index) in breadcrumbs"
              :key="bc.id"
              class="breadcrumb__item"
              data-test="breadcrumb-item"
          >
            <button
                type="button"
                class="breadcrumb__link"
                aria-label="Go to folder in breadcrumb"
                :data-test="'breadcrumb-link-' + bc.id"
                @click="onBreadcrumbClick(bc.id)"
            >
              {{ bc.name }}
            </button>

            <span
                v-if="index < breadcrumbs.length - 1"
                class="breadcrumb__separator"
                aria-hidden="true"
            >/</span>
          </span>
        </nav>
      </header>

      <div class="explorer-panel-body" data-test="right-panel-body">
        <RightPanel
            :selected-id="selectedId"
            :folders="folders"
            :files="files"
            :is-loading="contentsLoading"
            :error="contentsError"
            :breadcrumbs="breadcrumbs"
            @select-folder="onRightPanelSelect"
            data-test="right-panel-component"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import FolderTree from "../explorer/FolderTree.vue";
import RightPanel from "../explorer/RightPanel.vue";
import { useFolderTree } from "../../composables/useFolderTree";
import { useRightPanel } from "../../composables/useRightPanel";
import { useFolderSelectionSync } from "../../composables/useFolderSelectionSync";

const {
  tree,
  isLoading: treeLoading,
  error: treeError,
  loadTree,
  expandedIds,
  toggleExpand,
  selectedId,
  select,
  breadcrumbs,
} = useFolderTree();

loadTree();

const {
  folders,
  files,
  isLoading: contentsLoading,
  error: contentsError,
} = useRightPanel(selectedId);

useFolderSelectionSync(selectedId);

function onToggle(id: string) {
  toggleExpand(id);
}

function onSelect(id: string) {
  select(id);
}

function onRightPanelSelect(id: string) {
  select(id);

  if (!expandedIds.value.has(id)) {
    toggleExpand(id);
  }
}

function onBreadcrumbClick(id: string) {
  onRightPanelSelect(id);
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

.explorer-panel-header--right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.breadcrumb__item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb__link {
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.breadcrumb__link:hover {
  text-decoration: underline;
}

.breadcrumb__separator {
  margin: 0 4px;
  color: #9ca3af;
}
</style>
