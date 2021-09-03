import { createVNode } from "vue";
import * as $Icon from "@ant-design/icons-vue";

export const AntIcon = (props: { icon?: string }) => {
  const { icon } = props;
  return createVNode($Icon[icon]);
};

export const IconFont = $Icon.createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: "//at.alicdn.com/t/font_2766121_w0g8aeo83sr.js",
});

export default AntIcon;
