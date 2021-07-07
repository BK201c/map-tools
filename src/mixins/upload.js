export default {
  name: "",
  props: {},
  data() {
    return {
      fileList: []
    };
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    // 移除上传文件
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },

    //限制上传数量
    handleChange(info) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-2);
      this.fileList = fileList;
    },

    // 获取上传文件路径
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    }
  }
};
