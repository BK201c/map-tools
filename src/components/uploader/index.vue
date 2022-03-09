<template>
  <section style="height: 200px;">
    <a-upload-dragger
      :file-list="fileList"
      name="file"
      :multiple="false"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      @change="handleChange"
      accept=".json"
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
  </section>
</template>

<script lang="ts" setup>
import AntIcon from "@/components/icon";
import { ref ,computed} from "vue";
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  raw: any;
}
interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

const fileList = ref<FileItem[]>([]);

const $emit = defineEmits(["uploaded","removed"]);

const handleChange = (info: FileInfo) => {
  let resFileList = [...info.fileList];
  // 1. Limit the number of uploaded files
  //    Only to show two recent uploaded files, and old ones will be replaced by the new
  resFileList = resFileList.slice(-1);
  fileList.value = resFileList;
};

// 移除文件
const handleRemove = (file: FileItem) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

// 上传前处理事件
const beforeUpload = (file: FileItem) => {
  readJsonByFile(file).then(res=>$emit("uploaded", res));
  return false;
};

//解析file 格式json文件
const readJsonByFile = (file: any) => {
  return new Promise((resolve,reject)=>{
    try {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: any) => {
        const uploadData = JSON.parse(e?.target?.result);
        console.log("上传文件已解析", uploadData);
        resolve(uploadData)
      };
    } catch (error) {
      console.log("解析文件失败，请重新上传", error);
      reject(error)
    }
  })
};
</script>

<style lang="scss" scoped></style>
