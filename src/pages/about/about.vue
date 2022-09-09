<template>
  <view class="main">
    <Navbar title="关于" />
    <view class="base_box">
      <view class="strip"></view>
      <view class="safe_box">
        <view class="u_menu_item" @tap="goPage('/pages/regrule/regrule')">
          <text>用户协议</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="u_menu_item" @tap="goPage('/pages/privacy/privacy')">
          <text>隐私政策</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
      </view>

    <view class="logo_area">
        <image :src="config.logo" class="logo" mode="widthFix"/>
        <!-- <view class="app_name">{{config.app_name}}</view>
        <view class="app_desc">{{config.app_desc}}</view> -->
    </view>
      <view class="icp_info">
        <view class="icp_txt">{{config.icp_no}}</view>
      </view>
    </view>
</view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./about.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
        config: {},
      user: {},
      token: getToken(),
    };
  },
  onShow() {
    this.checkAuth();
    this.getConfig();
  },
  methods: {
    checkAuth() {
      if (isLogined()) {
        Taro.request({
          url: serverUrl + "/userapi/index",
          data: {
            token: this.token,
          },
        }).then((res) => {
          if (res.data.errcode != 0) {
            Taro.removeStorageSync("token");
            setTimeout(() => {
              Taro.navigateTo({
                url: "/pages/login/login",
              });
            }, 500);
          }
        });
      } else {
        setTimeout(() => {
          Taro.navigateTo({
            url: "/pages/login/login",
          });
        }, 500);
      }
    },
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
        }
      });
    },
    checkVer() {
      Taro.showToast({
        title: "已是最新版本",
        icon: "success",
      });
    },
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
  },
};
</script>
