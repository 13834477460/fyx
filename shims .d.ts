declare module "*.vue" {
  // defineComponent 方法用于定义vue组件(之前没说过,了解即可)
  import { defineComponent } from "vue";
  // const Component 创建一个变量
  // const Component: ReturnType 变量的类型是ReturnType 是一个返回值
  // ReturnType<typeof defineComponent>;   获取defineComponent返回值类型
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}