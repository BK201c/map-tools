<template>
  <section>
    <pre :class="`language-${language}`"><code v-html="preview"></code></pre>
  </section>
</template>

<script>
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-json";
export default {
  data() {
    return {
      preview: ""
    };
  },
  name: "c-prism",
  props: {
    code: {
      type: [String, Object],
      default: ""
    },
    language: {
      type: String,
      default: "json"
    }
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
    this.highlight(this.code);
  },
  watch: {
    code: (newVal, oldVal) => {
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      this.highlight(newVal);
    }
  },
  methods: {
    highlight(str) {
      this.preview = Prism.highlight(
        JSON.stringify(str),
        Prism.languages[this.language],
        this.language
      );
    }
  }
};
</script>

<style lang="scss"></style>
