<template>
  <div class="p-4">
    <header class="flex items-center justify-between mb-3">
      <h2 class="font-semibold text-sm">
        {{ selectedId ? "Contents" : "No folder selected" }}
      </h2>
    </header>

    <div v-if="!selectedId" class="text-gray-500 text-sm">
      Please select a folder on the left.
    </div>

    <div v-else>
      <div v-if="isLoading">Loading contents...</div>
      <div v-else-if="error">
        <p class="text-red-600 text-xs">{{ error }}</p>
      </div>
      <div v-else>
        <div v-if="folders.length === 0" class="text-gray-400 text-sm">
          This folder is empty.
        </div>

        <div v-if="folders.length > 0" class="mb-4">
          <h3 class="text-xs uppercase tracking-wide text-gray-500 mb-1">Folders</h3>
          <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <li
                v-for="f in folders"
                :key="f.id"
                class="border rounded px-2 py-1 flex items-center space-x-2"
            >
              <span>📁</span>
              <span class="truncate text-sm">{{ f.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {FolderEntity} from "../../types/folder";

defineProps<{
  selectedId: string | null;
  folders: FolderEntity[];
  isLoading: boolean;
  error: string | null;
}>();
</script>
