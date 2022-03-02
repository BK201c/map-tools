<template>
  <section>
    <div class="logo">
      <img :src="logo" alt="MAPTOOLS" width="120px" />
      <p>MapTools</p>
    </div>
    <ul>
      <li v-for="item in items" :key="item.index">
        {{ item.des }}
      </li>
    </ul>
  </section>
</template>

<script>
import logo from "@/asset/img/logo.png";
import config from "../../../package.json";
export default {
  data() {
    return {
      items: [],
      logo
    };
  },
  name: "",
  components: {},
  computed: {},
  created() {
    this.init();
  },
  mounted() {},
  watch: {},
  methods: {
    init() {
      this.items = [
        {
          des: `版本：v${config.version}`
        },
        {
          des: `发布日期：2021-09-27}`
        },
        {
          des: `Copyright 2020-${new Date().getFullYear()}`
        }
      ];
    }
  }
};
</script>

<style scoped lang="scss">
section {
  text-align: center;
  padding-top: 50px;
  .logo {
    p {
      font-size: 20px;
      margin-top: 10px;
    }
    margin-bottom: 50px;
  }
  li {
    margin-bottom: 15px;
  }
}
</style>
