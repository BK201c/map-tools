<template>
  <section>
    <div class="opera-are">
      <a-row class="btn-list-item" justify="end">
        <a-space>
          <a-button @click="copyParams">
            复制
          </a-button>
          <a-button @click="downloadParams">
            下载
          </a-button>
        </a-space>
      </a-row>
    </div>
    <pre><code>{{code}}</code></pre>
  </section>
</template>

<script lang="ts" setup>
import fs from "fs";
import dayjs from "dayjs";
const $props = defineProps({
  code: {
    type: Object,
  },
  path: {
    type: String,
    default: "C:/",
  },
  fileName: {
    type: String,
    default: "",
  },
  fileType: {
    type: String,
    default: "json",
  },
});

// 一键复制参数
const copyParams = (): void => {
  // clipboard.writeText($props.code.toString());
  setTimeout(() => {
    // const text = clipboard.readText();
    // if (text !== "" && text !== null) {
    //   this.$message.success("已复制到剪贴板");
    // }
  }, 300);
};

//保存显示地图的参数文件
const downloadParams = () => {
  const dataPx = dayjs(new Date());
  const { code, fileName, fileType, path } = $props;
  const downloadContent = String(code);
  const file = `adapt_${fileName}_${dataPx}.${fileType}`;
  const fullPath = `${path}/${file}`;
  fs.writeFile(fullPath, downloadContent, (err) => {
    if (err) {
      console.error(err);
      // this.$message.success(err);
      return;
    }
    //文件写入成功。
    // this.$message.success(`${fileName} 已保存至程序的resources目录`);
  });
};
</script>

<style lang="scss" scoped>
pre {
  max-height: 60vh;
  overflow-y: scroll;
}
</style>
