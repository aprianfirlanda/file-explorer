<template>
  <div class="right-panel">
    <!-- Search bar always visible -->
    <SearchBar
        v-model="searchQuery"
        placeholder="Search files & folders…"
        @search="handleSearch"
    />

    <!-- When search is active, show search results instead of normal content -->
    <template v-if="searchActive">
      <SearchResults
          :active="searchActive"
          :loading="searchLoading"
          :lastQuery="lastQuery"
          :results="searchResults"
          @open-folder="handleOpenFolder"
      />
    </template>

    <!-- Normal right panel content (when not searching) -->
    <template v-else>
      <div v-if="!selectedId" class="right-panel__state">
        Select a folder from the left panel.
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

          <section v-if="folders.length > 0" class="right-panel__section">
            <h3 class="right-panel__section-title">Folders</h3>
            <div class="right-panel__grid">
              <div
                  v-for="f in folders"
                  :key="f.id"
                  class="right-panel__item"
              >
                <Folder class="right-panel__item-icon" :size="18" />
                <span class="right-panel__item-label">{{ f.name }}</span>
              </div>
            </div>
          </section>

          <section v-if="files.length > 0" class="right-panel__section">
            <h3 class="right-panel__section-title">Files</h3>
            <ul class="right-panel__files-list">
              <li
                  v-for="file in files"
                  :key="file.id"
                  class="right-panel__file"
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
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Folder } from "lucide-vue-next";

import type { FolderEntity } from "../../types/folder";
import type { FileEntity } from "../../types/file.types";
import { getFileIconByMime } from "../../utils/mimeIcon";
import { formatFileSize } from "../../utils/formatFileSize";

import SearchBar from "./SearchBar.vue";
import SearchResults from "./SearchResult.vue";

defineProps<{
  selectedId: string | null;
  folders: FolderEntity[];
  files: FileEntity[];
  isLoading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "select-folder", folderId: string): void;
}>();

// --- Search state ---
const searchQuery = ref("");
const lastQuery = ref("");
const searchActive = ref(false);
const searchLoading = ref(false);
const searchResults = ref<{
  folders: FolderEntity[];
  files: FileEntity[];
}>({
  folders: [],
  files: [],
});

async function handleSearch() {
  const q = searchQuery.value.trim();

  if (!q) {
    searchActive.value = false;
    searchResults.value = { folders: [], files: [] };
    return;
  }

  searchLoading.value = true;
  searchActive.value = true;
  lastQuery.value = q;

  try {
    // if you want to limit search to current folder:
    // const parentParam = props.selectedId ? `&parentId=${props.selectedId}` : "";
    // const res = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}&type=all${parentParam}`);

    const res = await fetch(
        `/api/v1/search?q=${encodeURIComponent(q)}&type=all`
    );
    const json = await res.json();
    searchResults.value =
        json.data ?? ({ folders: [], files: [] } as {
          folders: FolderEntity[];
          files: FileEntity[];
        });
  } catch (e) {
    console.error("Search error", e);
    searchResults.value = { folders: [], files: [] };
  } finally {
    searchLoading.value = false;
  }
}

function handleOpenFolder(folder: FolderEntity) {
  // Emit up so parent (ExplorerLayout) can change selectedId
  emit("select-folder", folder.id);
}
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
</style>
