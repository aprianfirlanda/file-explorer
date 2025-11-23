<template>
  <div class="right-panel">
    <!-- Search bar always visible -->
    <SearchBar
        v-model="searchQuery"
        placeholder="Search files & folders…"
        @search="handleSearch"
    />

    <template v-if="searchActive">
      <h3 class="right-panel__section-title">Search Results</h3>

      <div v-if="searchLoading">Searching…</div>

      <div v-else>
        <div v-if="content.folders.length === 0 && content.files.length === 0">
          No results for "<strong>{{ lastQuery }}</strong>"
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="!selectedId" class="right-panel__state">
        Select a folder from the left panel or Type something Search Bar
      </div>

      <template v-else>
        <div v-if="isLoading" class="right-panel__state">
          Loading contents…
        </div>

        <div v-else-if="error" class="right-panel__state right-panel__state--error">
          {{ error }}
        </div>

        <div v-else>
          <div
              v-if="folders.length === 0 && files.length === 0"
              class="right-panel__state"
          >
            This folder is empty.
          </div>
        </div>
      </template>
    </template>

    <!-- Normal right panel content (when not searching) -->

    <section v-if="content.folders.length > 0" class="right-panel__section">
      <h3 class="right-panel__section-title">Folders</h3>
      <div class="right-panel__grid">
        <div
            v-for="f in content.folders"
            :key="f.id"
            class="right-panel__item"
            @click="handleFolderClick(f.id)"
        >
          <Folder class="right-panel__item-icon" :size="18" />
          <span class="right-panel__item-label">{{ f.name }}</span>
        </div>
      </div>
    </section>

    <section v-if="content.files.length > 0" class="right-panel__section">
      <h3 class="right-panel__section-title">Files</h3>
      <ul class="right-panel__files-list">
        <li
            v-for="file in content.files"
            :key="file.id"
            class="right-panel__file"
            @contextmenu.prevent="onFileRightClick(file, $event)"
        >
          <div class="right-panel__file-main">
            <component
                :is="getFileIconByMime(file.mimeType)"
                :size="18"
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

    <div
        v-if="showContextMenu && searchActive"
        class="right-panel__context-menu"
        :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
    >
      <button
          type="button"
          class="right-panel__context-menu-item"
          @click.stop="handleOpenFolderFromContext"
      >
        Open containing folder
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {Folder} from "lucide-vue-next";

import type {FolderContent, FolderEntity} from "../../types/folder";
import type {FileEntity} from "../../types/file.types";
import {getFileIconByMime} from "../../utils/mimeIcon";
import {formatFileSize} from "../../utils/formatFileSize";

import SearchBar from "./SearchBar.vue";
import {fetchSearch} from "../../api/searchApiV1.ts";

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

// --- Search state ---
const searchQuery = ref("");
const lastQuery = ref("");
const searchActive = ref(false);
const searchLoading = ref(false);
const content = ref<FolderContent>({
  folders: props.folders,
  files: props.files,
});
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextFile = ref<FileEntity | null>(null);

watch(
    () => [props.folders, props.files],
    () => {
      content.value = {
        folders: props.folders,
        files: props.files,
      };
    }
);

async function handleSearch() {
  const q = searchQuery.value.trim();

  if (!q) {
    searchActive.value = false;
    content.value = { folders: props.folders, files: props.files };
    return;
  }

  searchLoading.value = true;
  searchActive.value = true;
  lastQuery.value = q;

  try {
    const res = await fetchSearch(q);
    content.value = res.data;
  } catch (e) {
    console.error("Search error", e);
    content.value = { folders: props.folders, files: props.files };
  } finally {
    searchLoading.value = false;
  }
}

function handleFolderClick(id: string) {
  searchActive.value = false;
  searchQuery.value = "";
  content.value = { folders: [], files: [] };
  emit("select-folder", id);
}

function onFileRightClick(file: FileEntity, event: MouseEvent) {
  if (!searchActive.value) return; // only for search results

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
  if (!contextFile.value) return;

  const folderId = contextFile.value.folderId;

  if (!folderId) {
    closeContextMenu();
    return;
  }

  handleFolderClick(folderId);

  closeContextMenu();
}

onMounted(() => {
  window.addEventListener("click", closeContextMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeContextMenu);
});

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
