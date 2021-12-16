<template>
  <section>
    <pre><code>{{code}}</code></pre>
  </section>
</template>

<script lang="ts" setup>
const $props = defineProps({
  code: {
    type: [Object, String],
    default: () => "dddd",
  },
});
</script>

<style lang="scss" scoped></style>
