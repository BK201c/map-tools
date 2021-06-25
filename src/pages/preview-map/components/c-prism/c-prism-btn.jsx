import formater from "@/utils/formater";
import { fs, clipboard } from "@/core/electron";
export default {
  name: "c-prism-btn",
  props: {
    xml: {
      type: String,
      default: ""
    },
    json: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: "C:/"
    }
  },
  data() {
    return {
      btnGroup: [
        {
          title: "复制参数",
          type: "primary",
          icon: "copy",
          size: "small",
          ghost: true,
          clickEvent: "copyParams",
          params: ""
        },
        {
          title: "下载JSON",
          type: "primary",
          icon: "download",
          size: "small",
          ghost: true,
          clickEvent: "downloadParams",
          params: "json"
        },
        {
          title: "下载XML",
          type: "primary",
          icon: "file-excel",
          size: "small",
          ghost: true,
          clickEvent: "downloadParams",
          params: "xml"
        }
      ]
    };
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    // 一键复制参数
    copyParams() {
      clipboard.writeText(this.json);
      setTimeout(() => {
        const text = clipboard.readText();
        if (text !== "" && text !== null) {
          this.$message.success("已复制到剪贴板");
        }
      }, 300);
    },
    //保存显示地图的参数文件
    downloadParams(type) {
      const dataPx = formater.date(new Date(), "yyyy-MM-dd_hh.mm.ss");
      let content;
      if (type === "json") {
        content = this.json;
      } else if (type === "xml") {
        content = this.xml;
      }
      const fileName = `adapt_${this.json.layer}_${dataPx}.${type}`;
      const fullPath = `${this.path}/${fileName}`;
      fs.writeFile(fullPath, content, err => {
        if (err) {
          console.error(err);
          this.$message.success(err);
          return;
        }
        //文件写入成功。
        this.$message.success(`${fileName} 已保存至程序的resources目录`);
      });
    }
  },
  render() {
    const btns = this.btnGroup.map(btn => (
      <a-tooltip title={btn.title} style="margin-left:10px">
        <a-button
          {...{ attrs: btn }}
          onClick={() => this[btn.clickEvent](btn.params)}
        ></a-button>
      </a-tooltip>
    ));
    return <div class="btn-group">{btns}</div>;
  }
};
