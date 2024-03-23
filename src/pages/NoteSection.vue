<template>
  <q-page class="container-full">
    <div class="container-full">
      <q-card class="flex-container">
        <q-card-section class="q-pt-none">
          <q-btn @click="toggleEditMode" :icon="editMode ? 'visibility' : 'edit'" flat round />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section class="flex-grow content-container" v-if="editMode">
          <q-input type="textarea" v-model="markdownText" class="auto-expand-textarea" />
        </q-card-section>
        <q-card-section class="flex-grow content-container" v-else>
          <markdown-content :markdown="markdownText" class="full-size-content" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import MarkdownContent from './MarkdownContent.vue';

const markdownText = ref('');
const editMode = ref(true);

function toggleEditMode() {
  editMode.value = !editMode.value;
}
</script>

<style lang="scss">
  .container-full {
    height: 72.5vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .flex-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .flex-grow {
    flex: 1;
    overflow: hidden;
  }

  .auto-expand-textarea {
    min-height: 100px;
  }

  .auto-expand-textarea .q-field__inner, .auto-expand-textarea .q-field__native {
    height: 100vh;
    overflow: hidden;
  }

  .content-container {
    min-height: 100px;
    overflow-y: auto;
  }

  .full-size-content {
    min-height: 100px;
    height: auto;
  }
  ::-webkit-scrollbar {
    width: 12px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    border: 3px solid #f1f1f1;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
