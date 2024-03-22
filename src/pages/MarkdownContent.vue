<template>
  <div v-html="renderedHtml"></div>
</template>

<script>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';

export default {
  props: ['markdown'],
  setup(props) {
    const md = new MarkdownIt();
    const renderedHtml = computed(() => md.render(props.markdown || ''));

    return { renderedHtml };
  },
};
</script>
