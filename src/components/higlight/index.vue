<template>
  <section>
    <div class="opera-are" v-if="hasTools">
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
import dayjs from "dayjs";
import { apply } from "ol/transform";
import { inject } from "vue";
const $props = defineProps({
  code: {
    type: [Object, String],
    default: () => "",
  },
  hasTools: {
    type: Boolean,
    default: false,
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

const message: any = inject("$message");
// 一键复制参数
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify($props.code));
    message.success("已复制");
    console.log("已复制", JSON.stringify($props.code));
  } catch (err) {
    message.error("Failed to copy: ", err);
    console.error("Failed to copy: ", err);
  }
};

//保存显示地图的参数文件
const downloadParams = () => {
  const dataPx = dayjs(new Date());
  const { code, fileName, fileType, path } = $props;
  const downloadContent = String(code);
  const file = `adapt_${fileName}_${dataPx}.${fileType}`;
  const fullPath = `${path}/${file}`;
  const blob = new Blob([downloadContent], {
    type: "text/plain",
  });
  const urlCreator = window.URL || window.webkitURL;
  const link = urlCreator.createObjectURL(blob);
  let linknode = document.createElement("a");
  linknode.setAttribute("download", file);
  linknode.setAttribute("href", link);
};
</script>

<style lang="scss" scoped>
pre {
  max-height: 60vh;
  overflow-y: scroll;
}
</style>
