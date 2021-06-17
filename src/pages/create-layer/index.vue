<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">CT-Server</a-divider>
      <a-form-model
        :model="formBase"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="Host">
          <a-input v-model="formBase.host" />
        </a-form-model-item>
        <a-form-model-item label="Token">
          <a-input v-model="formBase.token" />
        </a-form-model-item>
      </a-form-model>
      <a-divider orientation="left">随机点位</a-divider>
      <a-form-model
        :model="formPoint"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="目标中心点">
          <a-input v-model="formPoint.center" placeholder="[lng,lat]" />
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
        <a-form-model-item label="统一设备标识">
          <a-input v-model="formLine.gbid" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" @click="downloadLineData">
            下载轨迹
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import XLSX from "xlsx";
import * as commonAPI from "@/api/commonAPI.js";
import mock from "@/utils/mock.js";
export default {
  name: "createLayer",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      formBase: {
        host: "http://10.68.8.20",
        token: "F66452BB69AE4B16A187C82837B53C1C"
      },
      formPoint: {
        pointNum: 200,
        appName: "best_practice",
        serviceName: "tzn_008",
        center: "120.54396,31.32881"
      },
      formLine: {
        adminId: "320505",
        gbid: "65010200031129111110",
        keyword: "金山"
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

    //下载轨迹数据
    async downloadLineData(e) {
      e.preventDefault();
      const { data } = await commonAPI.getRoadLine(
        this.formLine,
        this.formBase
      );
      console.log(data);
      this.exportXslx(data.result.records, this.formLine.gbid);
    },

    //导出xslx
    exportXslx(lines, gbid) {
      const rowTitle = ["gbid", "lon", "lat"];
      const points = [
        ...lines.map(line =>
          line.geometry.type !== "LineString"
            ? line.geometry.coordinates
            : [line.geometry.coordinates]
        )
      ]
        .flat(2)
        .map(e => [gbid].concat(e));
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
    createLayerSource(coordsArray) {
      return new Promise(reslove => {
        const feature = coords => ({
          dataId: uuidv4(),
          location: {
            type: "Point",
            coordinates: coords
          },
          keyValueMap: mock.createRandomProps()
        });
        const layer = [...coordsArray.map(coords => feature(coords))];
        console.log(layer);
        reslove(layer);
      });
    },

    /**
     * 推送点位
     */
    async pushPoints() {
      const { appName, center, serviceName, pointNum } = this.formPoint;
      try {
        const opts = await mock.randomCoordByCenter(center, pointNum);
        const esDataEntityList = await this.createLayerSource(opts);
        const params = { appName, serviceName, esDataEntityList };
        commonAPI.sendPointData(params, this.formBase).then(res => {
          if (res.data.status === 200) {
            this.$message.success("点位数据推送成功", 2);
          } else {
            this.$message.error("数据推送失败，请重试", 2);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  overflow-y: scroll;
}
</style>
