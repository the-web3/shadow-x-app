import { ComponentCustomProperties } from "@vue/runtime-core";
import { commonAlert } from "@/common/utils/globalProperties";
import api from "@/api";
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
      // Example：
      $api: typeof api
      // $validate: (data: object, rule: object) => boolean
      $alert: typeof commonAlert
    }
  }

export default ComponentCustomProperties;