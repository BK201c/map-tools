<template>
  <div class="container">
    <div
      class="form-box animate__animated animate__fadeInRight"
      v-show="!isMapFullScreen"
    >
      <c-form @submmit="showMap"></c-form>
    </div>
    <div class="preview-box" v-if="isMapParamsShow">
      <div
        class="preview-map animate__animated animate__fadeInTopRight"
        :class="{ 'map-full': isMapFullScreen }"
      >
        <c-map
          :layerSource="layerSource"
          :center="center"
          @layerChange="layerChange"
          @sizeChange="sizeChange"
        ></c-map>
      </div>
      <div
        class="preview-params animate__animated animate__fadeInBottomRight"
        v-show="!isMapFullScreen"
      >
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
      previewParams: null,
      isMapFullScreen: false
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
      this.layerSource = data.layerSource;
      this.originMetaXml = data.xml;
      this.previewParams = data.layerSource[0];
      this.center = data.center;
      if (this.layerSource.length > 0) {
        this.isMapParamsShow = true;
      }
    },

    // 图层切换事件
    layerChange(source) {
      this.previewParams = source;
    },

    sizeChange(val) {
      console.log(val);
      this.isMapFullScreen = val;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/preview.scss";
</style>
