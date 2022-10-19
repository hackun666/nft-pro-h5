<template>
  <view class="fix_footer_area">
    <view class="footer_blank"></view>
    <view class="footer_box">
      <view
        class="footer_item"
        v-for="(item, index) in tabsList"
        :key="index"
        @tap="tabsChange(item, index)"
      >
        <image
          mode="widthFix"
          :src="item.path == path ? item.src : item.src1"
          class="footer_icon"
        />
        <text :class="item.path == path ? 'on' : ''">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./footer.less";
import { isLogined, getToken } from "../utils/tools";
import { serverUrl } from "../utils/config";
export default {
  data() {
    return {
      tabIndex: 0,
      path: "/pages/index/index",
      tabsList: [],
      config: {},
    };
  },
  computed: {},
  created() {
    let page = Taro.getCurrentInstance();
    this.path = page.router.path.replace(/(\?|#)[^'"]*/, "");
    this.getConfig();
  },
  methods: {
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
          if (this.config.market_sta == 1) {
            this.tabsList = [
              {
                src: require("../assets/img/home_o.svg"),
                src1: require("../assets/img/home.svg"),
                text: "首页",
                path: "/pages/index/index",
              },
              {
                src: require("../assets/img/market_o.svg"),
                src1: require("../assets/img/market.svg"),
                text: "流转",
                path: "/pages/market/market",
              },
              {
                src: require("../assets/img/user_o.svg"),
                src1: require("../assets/img/user.svg"),
                text: "我的",
                path: "/pages/user/user",
              },
            ];
          } else {
            this.tabsList = [
              {
                src: require("../assets/img/home_o.svg"),
                src1: require("../assets/img/home.svg"),
                text: "首页",
                path: "/pages/index/index",
              },
              {
                src: require("../assets/img/user_o.svg"),
                src1: require("../assets/img/user.svg"),
                text: "我的",
                path: "/pages/user/user",
              },
            ];
          }
        }
      });
    },
    tabsChange(item, index) {
      if (item.text == "我的") {
        if (isLogined()) {
          Taro.redirectTo({
            url: this.tabsList[index].path,
          });
        } else {
          Taro.navigateTo({
            url: "/pages/login/login",
          });
        }
      } else {
        Taro.redirectTo({
          url: this.tabsList[index].path,
        });
      }
    },
  },
};
</script>

<style></style>