<template>
  <section class="main-container">
    <section class="sidebar-layout">
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
  display: flex;
  height: 100vh;
  justify-content: space-around;
  .content {
    flex-grow: 1;
    padding: 0 15px;
  }
}
</style>
