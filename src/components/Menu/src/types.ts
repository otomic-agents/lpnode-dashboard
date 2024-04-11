// import { ComputedRef } from 'vue';
// import { ThemeEnum } from '/@/enums/appEnum';
// import { MenuModeEnum } from '/@/enums/menuEnum';
export interface MenuState {

  defaultSelectedKeys: string[];

  // mode: MenuModeEnum;

  // theme: ComputedRef<ThemeEnum> | ThemeEnum;

  inlineIndent?: number;

  openKeys: string[];

  selectedKeys: string[];

  collapsedOpenKeys: string[];
}
