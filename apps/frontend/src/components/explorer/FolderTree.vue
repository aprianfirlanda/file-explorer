<template>
  <div class="folder-tree">
    <div v-if="isLoading" class="folder-tree__state">
      Loading folders...
    </div>
    <div v-else-if="error" class="folder-tree__state folder-tree__state--error">
      <p class="folder-tree__error-text">{{ error }}</p>
    </div>
    <ul v-else class="folder-tree__list">
      <FolderNode
          v-for="node in tree"
          :key="node.id"
          :node="node"
          :level="0"
          :expanded-ids="expandedIds"
          :selected-id="selectedId"
          @toggle="$emit('toggle', $event)"
          @select="$emit('select', $event)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type {FolderNode as FolderNodeType} from "../../types/folder";
import FolderNode from "./FolderNode.vue";

defineProps<{
  tree: FolderNodeType[];
  isLoading: boolean;
  error: string | null;
  expandedIds: Set<string>;
  selectedId: string | null;
}>();

defineEmits<{
  (e: "toggle", id: string): void;
  (e: "select", id: string): void;
}>();
</script>

<style>
.folder-tree {
  padding: 8px;
}

.folder-tree__state {
  font-size: 13px;
  color: #4b5563;
}

.folder-tree__state--error {
  color: #b91c1c;
}

.folder-tree__error-text {
  font-size: 12px;
}

.folder-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
