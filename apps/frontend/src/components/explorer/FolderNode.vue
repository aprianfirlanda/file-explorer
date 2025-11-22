<template>
  <li>
    <div
        class="flex items-center cursor-pointer select-none px-1 py-0.5 rounded"
        :class="isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'"
        @click.stop="handleSelect"
    >
      <!-- Toggle icon -->
      <span class="w-4 flex justify-center mr-1" @click.stop="handleToggle">
        <span v-if="hasChildren">
          {{ isExpanded ? "▾" : "▸" }}
        </span>
      </span>

      <!-- Folder icon (simple) -->
      <span class="mr-1">📁</span>

      <!-- Name with indentation -->
      <span :style="{ paddingLeft: `${level * 8}px` }">
        {{ node.name }}
      </span>
    </div>

    <ul v-if="hasChildren && isExpanded" class="ml-4">
      <FolderNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          :expanded-ids="expandedIds"
          :selected-id="selectedId"
          @toggle="$emit('toggle', $event)"
          @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {FolderNode as FolderNodeType} from "../../types/folder";

const props = defineProps<{
  node: FolderNodeType;
  level: number;
  expandedIds: Set<string>;
  selectedId: string | null;
}>();

const emit = defineEmits<{
  (e: "toggle", id: string): void;
  (e: "select", id: string): void;
}>();

const hasChildren = computed(() => props.node.children?.length > 0);
const isExpanded = computed(() => props.expandedIds.has(props.node.id));
const isSelected = computed(() => props.selectedId === props.node.id);

function handleToggle() {
  if (!hasChildren.value) return;
  emit("toggle", props.node.id);
}

function handleSelect() {
  emit("select", props.node.id);
}
</script>
