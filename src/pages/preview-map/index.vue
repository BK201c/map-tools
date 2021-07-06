<template>
  <div class="container">
    <div class="form-box animate__animated animate__fadeInRight">
      <c-form @submmit="showMap"></c-form>
    </div>
    <div class="preview-box" v-if="isMapParamsShow">
      <div class="preview-map animate__animated animate__fadeInTopRight">
        <c-map
          :layerSource="layerSource"
          :center="center"
          @change="layerChange"
          width="200px"
          height="300px"
        ></c-map>
      </div>
      <div class="preview-params animate__animated animate__fadeInBottomRight">
        <c-prism
          :code="previewParams"
          :xml="originMetaXml"
          :path="zipPath"
        ></c-prism>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import form from "./components/c-form";
export default {
  name: "previewMap",
  data() {
    return {
      layerSource: [],
      center: [],
      isMapParamsShow: false,
      originMetaXml: "",
      previewParams: null
    };
  },
  created() {},
  mounted() {},
  components: {
    "c-map": () => import("./components/c-map/c-map"),
    "c-prism": () => import("./components/c-prism/c-prism"),
    "c-form": form
  },
  computed: {
    ...mapGetters(["zipPath"])
  },
  methods: {
    // 预览地图
    showMap(data) {
      console.log(data);
      this.layerSource = data.layerSource;
      this.originMetaXml = data.originMetaXml;
      this.previewParams = data.layerSource[0];
      this.center = data.center;
      this.isMapParamsShow = true;
    },

    // 图层切换事件
    layerChange(source) {
      this.previewParams = source;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/preview.scss";
</style>
