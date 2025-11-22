<template>
  <div class="right-panel">
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
        <div v-if="folders.length === 0" class="right-panel__state">
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
              <span class="right-panel__item-icon">📁</span>
              <span class="right-panel__item-label">{{ f.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </template>
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
  padding: 4px 0;
  border-bottom: 1px solid #f3f4f6;
}

.right-panel__file-size {
  font-size: 11px;
  color: #9ca3af;
}
</style>
