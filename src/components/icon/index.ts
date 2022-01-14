import { h } from "vue";
import * as $Icon from "@ant-design/icons-vue";

export const AntIcon = (props: { icon: string }) => {
  const { icon } = props;
  return h($Icon[icon]);
};

export default AntIcon;
