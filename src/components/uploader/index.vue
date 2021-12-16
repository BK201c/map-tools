<template>
  <a-upload-dragger
    :is="'a-upload-dragger'"
    v-model:fileList="fileList"
    name="file"
    :multiple="true"
    :remove="handleRemove"
    :before-upload="beforeUpload"
  >
    <p class="ant-upload-drag-icon">
      <AntIcon icon="InboxOutlined" />
    </p>
    <p class="ant-upload-text">
      点击或拖拽上传文件
    </p>
    <p class="ant-upload-hint">
      仅支持上传json文件
    </p>
  </a-upload-dragger>
</template>

<script lang="ts" setup>
import AntIcon from "@/components/icon";
import { message } from "ant-design-vue";
import { log } from "console";
import { ref ,computed} from "vue";
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  raw: any;
}

const fileList = ref<FileItem[]>([]);

const $emit = defineEmits(["uploaded","removed"]);

interface Props {
  isDraggable: boolean
}
const $props = withDefaults(defineProps<Props>(), {
  isDraggable:true,
})

const currentModule = computed(()=>{
  $props.isDraggable? "a-upload-dragger":"a-upload"
})

// 移除文件
const handleRemove = (file: FileItem) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

// 上传前处理事件
const beforeUpload = (file: FileItem) => {
  fileList.value = [...fileList.value, file];
  return false;
};

//解析json文件
const getJsonParse = (file: any) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e: any) => {
    const uploadData = JSON.parse(e?.target?.result);
    console.log("已解析上传文件", uploadData);
    $emit("uploaded", uploadData);
  };
};
</script>

<style lang="scss" scoped></style>
