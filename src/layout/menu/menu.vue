<template>
  <div class="sidebar">
    <a-menu
      style="border-right:none"
      :default-selected-keys="current"
      mode="inline"
      @click="handleClick"
    >
      <a-menu-item key="previewMap">
        <a-icon style="fontSize:18px" type="file-search" />
        <span>底图验证</span>
      </a-menu-item>
      <a-menu-item key="createLayer">
        <a-icon style="fontSize:18px" type="cloud-server" />
        <span>数据推送</span>
      </a-menu-item>
      <a-menu-item key="about">
        <a-icon style="fontSize:18px" type="smile" />
        <span>关于</span>
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
  width: 100%;
  & >>> .anticon {
    font-size: 30px;
  }
  & >>> .ant-menu ant-menu-inline ant-menu-root ant-menu-light {
    border-right: none;
  }
}
</style>
