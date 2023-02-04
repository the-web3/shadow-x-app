import { createSSRApp } from "vue";
import App from "./App.vue";
import api from '@/api';
import { commonAlert } from "@/common/utils/globalProperties";
// #ifdef H5
// console.log(11111111)
// import * as buffer from 'buffer';
// window.global = window
// //ts-ignore
// window.Buffer = buffer.Buffer;
// if(typeof (window as any).global === 'undefined'){
//   (window as any).global = window
// }
// if(typeof (window as any).buffer === 'undefined'){
//   (window as any).buffer = buffer.Buffer
// }
// #endif
export function createApp() {
  const app = createSSRApp(App);
  // app.use(commonFunc)
  // 无状态提示信息
  app.config.globalProperties.$alert = commonAlert
  app.config.globalProperties.$api = api
  return {
    app,
  };
}
