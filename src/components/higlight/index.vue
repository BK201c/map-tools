<template>
  <section>
    <div class="opera-are" v-if="$props.hasTools">
      <a-row class="btn-list-item" justify="end">
        <a-space>
          <a-button @click="copyToClipboard">
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
// import dayjs from "dayjs";
import { message } from "ant-design-vue";
import FileSaver from "file-saver";

interface Props {
  code?: Object;
  hasTools?: boolean;
  path?: string;
  fileName?: string;
  fileType?: string;
}
const $props = withDefaults(defineProps<Props>(), {
  hasTools: false,
});

// 一键复制参数
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify($props.code));
    message.success("样式参数已复制");
  } catch (err) {
    message.error("Failed to copy:");
    console.error("Failed to copy: ", err);
  }
};

//保存显示地图的参数文件
const downloadParams = () => {
  // const dataPx = dayjs(`${new Date()}`).format('YYYY-MM-DD HH:mm:ss');
  const { code, fileName } = $props;
  const downloadContent = JSON.stringify(code);
  try {
    const blob = new Blob([downloadContent], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, fileName);
    message.success(`已下载 ${fileName}`);
  } catch (error) {
    console.log(error);
    message.error("下载失败~");
  }
};
</script>

<style lang="scss" scoped>
pre {
  max-height: 60vh;
  overflow-y: scroll;
}
</style>
