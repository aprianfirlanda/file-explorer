<template>
  <div class="right-panel__search" data-test="search-bar-root">
    <form @submit.prevent="onSubmit" aria-label="Search Form" data-test="search-form">
      <input
          :value="modelValue"
          class="right-panel__search-input"
          type="text"
          :placeholder="placeholder"
          aria-label="Search Input"
          data-test="search-input"
          @input="onInput"
      />

      <button
          type="submit"
          class="right-panel__search-button"
          aria-label="Execute Search"
          data-test="search-button"
      >
        <Search :size="16" aria-hidden="true" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import {Search} from '../../icons'

defineProps<{
  modelValue: string
  placeholder?: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function onSubmit() {
  emit('search');
}
</script>

<style>
.right-panel__search {
  margin-bottom: 12px;
}

.right-panel__search form {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-panel__search-input {
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
}

.right-panel__search-button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: #f3f4f6;
  cursor: pointer;
  font-size: 13px;
}

.right-panel__search-button:hover {
  background-color: #e5e7eb;
}
</style>
