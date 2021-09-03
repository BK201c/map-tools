//菜单信息
export interface MenuItem {
  path: string;
  component?: Function;
  name?: string;
  redirect?: string;
  meta?: {
    title: string;
    icon?: string;
  };
  children?: MenuItem[];
}
