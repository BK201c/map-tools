<template>
  <div class="container">
    <a-divider orientation="left">基础信息</a-divider>
    <a-form-model
      :model="formBase"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="CT-Server-Host">
        <a-input v-model="formBase.host" />
      </a-form-model-item>
      <a-form-model-item label="CT-Server-Token">
        <a-input v-model="formBase.token" />
      </a-form-model-item>
    </a-form-model>
    <a-divider orientation="left">随机点位</a-divider>
    <a-form-model
      :model="formPoint"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="目标范围">
        <a-input
          v-model="formPoint.centerBox"
          placeholder="[minLng, minLat,maxLng, maxLat] or [lng,lat]"
        />
      </a-form-model-item>
      <a-form-model-item label="生成数量">
        <a-input v-model="formPoint.pointNum" />
      </a-form-model-item>
      <a-form-model-item label="项目标识">
        <a-input v-model="formPoint.appName" placeholder="appName" />
      </a-form-model-item>
      <a-form-model-item label="图层标识">
        <a-input v-model="formPoint.serviceName" placeholder="serviceName" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" @click="pushPoints"> 推送点位 </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-divider orientation="left">实时轨迹</a-divider>
    <a-form-model
      :model="formLine"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="行政编码">
        <a-input v-model="formLine.adminId" />
      </a-form-model-item>
      <a-form-model-item label="道路名">
        <a-input v-model="formLine.keyword" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" @click="downloadLineData"> 下载轨迹 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import XLSX from "xlsx";
export default {
  name: "HelloWorld",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      formBase: {
        host: "http://10.68.8.20",
        token: "F66452BB69AE4B16A187C82837B53C1C",
      },
      formPoint: {
        pointNum: 200,
        appName: "app_tzn_test",
        serviceName: "tzn_008",
        centerBbox: "120.496331,31.26383,120.54396,31.32881",
      },
      formLine: {
        adminId: "320505",
        keyword: "金山",
      },
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

    //下载轨迹数据
    async downloadLineData(e) {
      e.preventDefault();
      const { data } = await this.getRoadLine(this.formLine);
      console.log(data);
      this.exportXslx(data.result.records);
    },

    //导出xslx
    exportXslx(lines) {
      const gbid = "65010200031129111110";
      const rowTitle = ["gbid", "lon", "lat"];
      const points = [
        ...lines.map((line) =>
          line.geometry.type !== "LineString"
            ? line.geometry.coordinates
            : [line.geometry.coordinates]
        ),
      ]
        .flat(2)
        .map((e) => [gbid].concat(e));
      const xlsxData = [rowTitle].concat(points);
      /* convert state to workbook */
      const ws = XLSX.utils.aoa_to_sheet(xlsxData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      /* generate file and send to client */
      XLSX.writeFile(wb, `${gbid}.xlsx`);
    },

    /**
     * 创建KMAP layer格式数据
     */
    createLayerSource(pointsCollection, bbox) {
      return new Promise((reslove) => {
        reslove([
          ...pointsCollection.features.map(() =>
            Object.assign(
              {},
              {
                dataId: uuidv4(),
                location: {
                  type: "Point",
                  coordinates: this.randomCoordByBbox(bbox),
                },
                keyValueMap: this.createRandomProps(),
              }
            )
          ),
        ]);
      });
    },

    /**
     * 推送点位
     */
    async pushPoints() {
      const { appName, bbox, serviceName, pointNum } = this.formPoint;
      console.log(form);
      try {
        const opts = await this.createRandomPoints(pointNum, bbox);
        const esDataEntityList = await this.createLayerSource(opts, bbox);
        const params = { appName, serviceName, esDataEntityList };
        this.sendPointData(params);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss">
.container {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 100px;
}
</style>
