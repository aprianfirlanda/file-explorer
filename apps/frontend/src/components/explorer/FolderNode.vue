<template>
  <li style="list-style: none">
    <div
        class="folder-node"
        :class="{ 'folder-node--selected': isSelected }"
        @click.stop="handleSelect"
    >
      <!-- Toggle arrow -->
      <span
          class="folder-node__toggle"
          @click.stop="handleToggle"
      >
        <span v-if="hasChildren">
          <ChevronRight v-if="!isExpanded" class="w-4 h-4"/>
          <ChevronDown v-else class="w-4 h-4"/>
        </span>
      </span>

      <!-- Icon -->
      <span class="folder-node__icon">
        <Folder v-if="!isExpanded" class="w-4 h-4"/>
        <FolderOpen v-else class="w-4 h-4"/>
      </span>

      <!-- Name with indentation -->
      <span
          class="folder-node__label"
          :style="{ paddingLeft: `${level * 12}px` }"
      >
        {{ node.name }}
      </span>
    </div>

    <ul
        v-if="hasChildren && isExpanded"
        class="folder-node__children"
    >
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
import {Folder, FolderOpen, ChevronRight, ChevronDown} from "lucide-vue-next";
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

<style scoped>
.folder-node {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.folder-node:hover {
  background-color: #e5e7eb;
}

.folder-node--selected {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.folder-node__toggle {
  width: 16px;
  text-align: center;
  font-size: 10px;
  color: #6b7280;
}

.folder-node__label {
  white-space: nowrap;
}

.folder-node__children {
  list-style: none;
  margin: 0;
  padding-left: 16px;
}

.w-4{
  width: 1rem;
}

.h-4{
  height: 1rem;
}

</style>
