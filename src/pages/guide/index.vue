<template>
  <section>
    <div class="markdown-body">
      <VueMarkdown :source="mdData" v-highlight></VueMarkdown>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
import markdownData from "../../../README.md";
export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      mdData: markdownData
    };
  }
};
</script>

<style lang="scss" scoped>
section {
  padding: 10px 20px;
}
</style>
