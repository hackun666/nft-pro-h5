<template>
  <view class="main">
    <Navbar title="用户协议" />
    <view class="xieyi">
      <rich-text :nodes="config.agreement"></rich-text>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./regrule.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      config: {}
    };
  },
  onShow() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
        }
      });
    },
  },
};
</script>
