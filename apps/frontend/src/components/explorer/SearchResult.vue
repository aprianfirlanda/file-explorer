<template>
  <section v-if="active" class="right-panel__section">
    <h3 class="right-panel__section-title">Search Results</h3>

    <div v-if="loading">Searching…</div>

    <div v-else>
      <div v-if="results.folders.length === 0 && results.files.length === 0">
        No results for "<strong>{{ lastQuery }}</strong>"
      </div>

      <div v-else>
        <h4 v-if="results.folders.length">Folders</h4>
        <ul v-if="results.folders.length" class="right-panel__folders-list">
          <li
              v-for="f in results.folders"
              :key="f.id"
              class="right-panel__folder"
              @click="onOpenFolder(f)"
          >
            📁 {{ f.name }}
          </li>
        </ul>

        <h4 v-if="results.files.length">Files</h4>
        <ul v-if="results.files.length" class="right-panel__files-list">
          <li
              v-for="file in results.files"
              :key="file.id"
              class="right-panel__file"
          >
            <span>{{ file.name }}</span>
            <span class="right-panel__file-size">
              {{ formatFileSize(file.sizeBytes ?? 0) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {formatFileSize} from "../../utils/formatFileSize.ts";

defineProps<{
  active: boolean
  loading: boolean
  lastQuery: string
  results: {
    folders: any[]
    files: any[]
  }
}>();

const emit = defineEmits<{
  (e: 'open-folder', folder: any): void
}>();

function onOpenFolder(folder: any) {
  emit('open-folder', folder);
}
</script>
