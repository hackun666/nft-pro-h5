<template>
    <view>
    <view class="antchain" v-if="config.show_chain_logo == 1"><image
        class="bsn_logo"
        src="../assets/img/bsn.png"
        mode="widthFix"
      />
      <image
        class="wenchang_logo"
        src="../assets/img/wenchang.png"
        mode="widthFix"
      />
      <view>提供底层链服务</view>
    </view>
    </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./chain.less";
import { serverUrl } from "../utils/config";
export default {
  data() {
    return { 
      env: process.env.TARO_ENV,
      config: {},
    };
  },
  computed: {},
  created() {
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

<style>
</style>
