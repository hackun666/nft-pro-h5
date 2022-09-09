<template>
  <view class="main">
    <!-- <Navbar title="创建区块链账户" /> -->
    <view class="info_box2 c_page">
      <view class="h_too">
        <view class="h_txt">生成钱包地址</view>
        <view class="h_txt2">您需使用钱包地址收藏和转移数字藏品</view>
      </view>
      <view class="agree_z">
        <view class="term_txt">
          <view class="term_tit">点击创建即表示您同意平台代为创建钱包地址</view>
          <view class="term_txt"
            >平台帮您创建钱包地址并代为管理。但未经您的授权，我们无法动用您的资产，您可在【我的】查看钱包地址。</view
          >
        </view>
      </view>
      <view class="create_btn flex_center" @tap="createChain">立即创建</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./chaincreate.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      user: {},
      info: null,
      token: getToken(),
      hash: "",
      order: {},
      buyer: {},
      tap_sta: true,
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
  },
  methods: {
    createChain() {
      if (this.tap_sta) {
        this.tap_sta = false;
        Taro.request({
          url: serverUrl + "/userapi/createchain",
          data: {
            token: this.token,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            Taro.showToast({
              title: res.data.errmsg,
              icon: "none",
            });
            setTimeout(() => {
              Taro.navigateTo({
                url: "/pages/user/user",
              });
            }, 1000);
          } else {
            Taro.showToast({
              title: res.data.errmsg,
              icon: "none",
            });
            this.tap_sta = true;
            return;
          }
        });
      }
    },
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
    getUser() {
      Taro.request({
        url: serverUrl + "/userapi/userinfo",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.user = res.data.user;
        }
      });
    },
  },
};
</script>
