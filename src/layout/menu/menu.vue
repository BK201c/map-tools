<template>
  <div>
    <a-menu
      style="width: 185px"
      :default-selected-keys="current"
      mode="inline"
      @click="handleClick"
    >
      <a-menu-item key="previewMap">
        地图验证
      </a-menu-item>
      <a-menu-item key="createLayer">
        模拟数据
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["previewMap"]
    };
  },
  created() {
    this.current[0] = this.$route.name;
    console.log(this.$route);
  },
  methods: {
    handleClick(e) {
      console.log("click", e);
      this.$router.push({ name: e.key });
    }
  }
};
</script>
