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
          des: "文档"
        },
        {
          des: "版本：v1.3.0"
        },
        {
          des: "更新日期：2021-06-22"
        },
        {
          des: "Copyright 2020-2021 By Jonson"
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
