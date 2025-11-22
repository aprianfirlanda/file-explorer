<template>
  <div class="p-2">
    <div v-if="isLoading">
      Loading folders...
    </div>
    <div v-else-if="error">
      <p class="text-red-600 text-xs">{{ error }}</p>
    </div>
    <ul v-else class="space-y-1">
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
