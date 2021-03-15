<template>
  <div class="container">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="地图服务">
        <a-input v-model="form.host" />
      </a-form-model-item>
      <a-form-model-item label="Token">
        <a-input v-model="form.token" />
      </a-form-model-item>
      <a-form-model-item label="中心点">
        <a-input v-model="form.center" placeholder="[lng,lat]" />
      </a-form-model-item>
      <a-form-model-item label="地图坐标系">
        <a-radio-group v-model="form.crs" default-value="EPSG:3857">
          <a-radio value="EPSG:3857" name="crs">
            EPSG:3857
          </a-radio>
          <a-radio value="EPSG:4326" name="crs">
            EPSG:4326
          </a-radio>
          <a-radio value="EPSG:4490" name="crs">
            EPSG:4490
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="默认层级">
        <a-slider
          :marks="marks"
          :default-value="5"
          :min="0"
          :max="20"
          :tooltip-visible="true"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" @click="previewMap">预览</a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="preview-box">
      <div id="previewMap"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "previewMap",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      form: {
        host: "http://10.68.8.20",
        token: "F66452BB69AE4B16A187C82837B53C1C",
        center: "",
        crs: "EPSG:3857"
      },
      marks: {
        0: "0",
        20: "20"
      }
    };
  },
  methods: {
    // 表单验证
    isValidatePass(form) {
      const bbox = form.bbox.split(",");
      if (bbox.length !== 2 || bbox.length !== 4) {
        this.$message.error("请输入正确的点位格式", 2);
      }
    },
    previewMap() {}
  }
};
</script>
<style lang="scss">
.container {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 100px;
}
</style>
