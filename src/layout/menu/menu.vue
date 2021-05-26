<template>
  <div class="sidebar">
    <a-menu
      style="width: 185px"
      :default-selected-keys="current"
      mode="inline"
      @click="handleClick"
    >
      <a-menu-item key="previewMap">
        <a-icon style="fontSize:18px" type="file-search" />
        底图验证
      </a-menu-item>
      <a-menu-item key="createLayer">
        <a-icon style="fontSize:18px" type="cloud-server" />
        数据推送
      </a-menu-item>
      <a-menu-item key="about">
        <a-icon style="fontSize:18px" type="smile" />
        关于
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
  },
  methods: {
    handleClick(e) {
      this.$router.push({ name: e.key });
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  box-shadow: 1px 1px 9px 2px #e4e4e4;
  height: 100%;
  & >>> .anticon {
    font-size: 30px;
  }
}
</style>
