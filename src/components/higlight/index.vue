<template>
  <section>
    <pre><code>{{code}}</code></pre>
  </section>
</template>

<script lang="ts" setup>
const $props = defineProps({
  code: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
section {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
