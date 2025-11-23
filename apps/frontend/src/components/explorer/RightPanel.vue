<template>
  <div class="right-panel" data-test="right-panel-root">
    <!-- Search bar -->
    <SearchBar
        v-model="searchQuery"
        placeholder="Search files & folders…"
        @search="handleSearch"
        aria-label="Search files and folders"
        data-test="search-bar"
    />

    <!-- SEARCH MODE -->
    <template v-if="searchActive">
      <h3
          class="right-panel__section-title"
          aria-label="Search Results"
          data-test="search-results-title"
      >
        Search Results
      </h3>

      <div
          v-if="searchLoading"
          aria-busy="true"
          data-test="search-loading"
      >
        Searching…
      </div>

      <div v-else>
        <div v-if="!hasSearchResults" data-test="search-no-results">
          No results for "<strong>{{ lastQuery }}</strong>"
        </div>
      </div>
    </template>

    <!-- NORMAL MODE -->
    <template v-else>
      <div
          v-if="!selectedId"
          class="right-panel__state"
          aria-label="No folder selected"
          data-test="no-folder-selected"
      >
        Select a folder from the left panel or Type something Search Bar
      </div>

      <template v-else>
        <div
            v-if="isLoading"
            class="right-panel__state"
            aria-busy="true"
            data-test="right-panel-loading"
        >
          Loading contents…
        </div>

        <div
            v-else-if="error"
            class="right-panel__state right-panel__state--error"
            role="alert"
            data-test="right-panel-error"
        >
          {{ error }}
        </div>

        <div v-else>
          <div
              v-if="folders.length === 0 && files.length === 0"
              class="right-panel__state"
              data-test="right-panel-empty-folder"
          >
            This folder is empty.
          </div>
        </div>
      </template>
    </template>

    <!-- FOLDERS -->
    <section
        v-if="content.folders.length > 0"
        class="right-panel__section"
        aria-label="Folders Section"
        data-test="right-panel-folders-section"
    >
      <h3 class="right-panel__section-title">Folders</h3>
      <div class="right-panel__grid">
        <div
            v-for="f in content.folders"
            :key="f.id"
            class="right-panel__item"
            role="button"
            tabindex="0"
            aria-label="Open folder"
            :data-test="'right-folder-item-' + f.id"
            @click="handleFolderClick(f.id)"
        >
          <Folder class="right-panel__item-icon" :size="18" />
          <span class="right-panel__item-label">{{ f.name }}</span>
        </div>
      </div>
    </section>

    <!-- FILES -->
    <section
        v-if="content.files.length > 0"
        class="right-panel__section"
        aria-label="Files Section"
        data-test="right-panel-files-section"
    >
      <h3 class="right-panel__section-title">Files</h3>
      <ul class="right-panel__files-list">
        <li
            v-for="file in content.files"
            :key="file.id"
            class="right-panel__file"
            :data-test="'file-item-' + file.id"
            @contextmenu.prevent="onFileRightClick(file, $event)"
        >
          <div class="right-panel__file-main">
            <component
                :is="getFileIconByMime(file.mimeType)"
                :size="18"
                aria-hidden="true"
                class="right-panel__file-icon"
            />
            <span class="right-panel__file-name">{{ file.name }}</span>
          </div>

          <span class="right-panel__file-size">
            {{ formatFileSize(file.sizeBytes) }}
          </span>
        </li>
      </ul>
    </section>

    <!-- CONTEXT MENU -->
    <div
        v-if="showContextMenu && searchActive"
        class="right-panel__context-menu"
        role="menu"
        aria-label="Context Menu"
        :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
        data-test="context-menu"
    >
      <button
          type="button"
          class="right-panel__context-menu-item"
          role="menuitem"
          data-test="context-menu-open-folder"
          @click.stop="handleOpenFolderFromContext"
      >
        Open containing folder
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, toRef} from "vue";
import {Folder} from "../../icons";
import type {FolderEntity} from "../../types/folder";
import type {FileEntity} from "../../types/file.types";
import {getFileIconByMime} from "../../utils/mimeIcon";
import {formatFileSize} from "../../utils/formatFileSize";
import SearchBar from "./SearchBar.vue";
import {useSearchContent} from "../../composables/useSearchContent";
import {useGlobalClickClose} from "../../composables/useGlobalClickClose.ts";

const props = defineProps<{
  selectedId: string | null;
  folders: FolderEntity[];
  files: FileEntity[];
  isLoading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "select-folder", id: string): void;
}>();

// use toRef so the composable sees reactive arrays
const foldersRef = toRef(props, "folders");
const filesRef = toRef(props, "files");

const {
  searchQuery,
  lastQuery,
  searchActive,
  searchLoading,
  content,
  handleSearch,
  resetSearch,
} = useSearchContent(foldersRef, filesRef);

const hasSearchResults = computed(
    () => content.value.folders.length > 0 || content.value.files.length > 0
);

// context menu (unchanged)
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextFile = ref<FileEntity | null>(null);

function handleFolderClick(id: string) {
  resetSearch();
  emit("select-folder", id);
}

function onFileRightClick(file: FileEntity, event: MouseEvent) {
  if (!searchActive.value) return;
  event.preventDefault();

  contextFile.value = file;
  showContextMenu.value = true;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
}

function closeContextMenu() {
  showContextMenu.value = false;
  contextFile.value = null;
}

function handleOpenFolderFromContext() {
  if (!contextFile.value?.folderId) {
    closeContextMenu();
    return;
  }

  handleFolderClick(contextFile.value.folderId);
  closeContextMenu();
}


useGlobalClickClose(closeContextMenu);
</script>

<style scoped>
.right-panel {
  padding: 12px;
  font-size: 14px;
}

.right-panel__state {
  color: #6b7280;
  font-size: 13px;
}

.right-panel__state--error {
  color: #b91c1c;
}

.right-panel__section {
  margin-bottom: 16px;
}

.right-panel__section-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 8px;
}

.right-panel__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.right-panel__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  cursor: pointer;
}

.right-panel__item-icon {
  font-size: 16px;
}

.right-panel__item-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-panel__files-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.right-panel__file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}

.right-panel__file-main {
  display: flex;
  align-items: center;
}

.right-panel__file-icon {
  margin-right: 6px;
  color: #4b5563;
}

.right-panel__file-name {
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-panel__file-size {
  font-size: 11px;
  color: #9ca3af;
}

.right-panel__context-menu {
  position: fixed;
  z-index: 50;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.15);
  padding: 4px 0;
  min-width: 180px;
  font-size: 13px;
}

.right-panel__context-menu-item {
  width: 100%;
  padding: 6px 12px;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
}

.right-panel__context-menu-item:hover {
  background-color: #f3f4f6;
}

</style>
