<template>
  <section>
    <the-menu></the-menu>
    <router-view></router-view>
  </section>
</template>

<script>
import menu from "@/layout/menu/menu";
export default {
  data() {
    return {};
  },
  name: "",
  components: { "the-menu": menu },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss"></style>
