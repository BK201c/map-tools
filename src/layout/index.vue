<template>
  <section class="main-container">
    <section class="sidebar">
      <the-menu></the-menu>
    </section>
    <section class="content">
      <router-view></router-view>
    </section>
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

<style scoped lang="scss">
.main-container {
  padding: {
    top: 60px;
    bottom: 60px;
  }
  display: flex;
  justify-content: space-around;
  .content {
    flex-grow: 1;
  }
}
</style>
