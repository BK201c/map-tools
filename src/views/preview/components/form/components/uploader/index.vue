<template>
  <a-upload
    :file-list="fileList"
    :remove="handleRemove"
    :before-upload="beforeUpload"
    accept=".json"
  >
    <a-button> <upload-outlined></upload-outlined>导入 </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  raw: any;
}

const fileList = ref<FileItem[]>([]);

const emit = defineEmits(["uploaded"]);

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
  const currentFile = fileList.value[0];
  getJsonParse(currentFile);
  return false;
};

//解析json文件
const getJsonParse = (file: any) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e: any) => {
    const uploadData = JSON.parse(e?.target?.result);
    emit("uploaded", uploadData);
  };
};
</script>

<style lang="scss" scoped></style>
