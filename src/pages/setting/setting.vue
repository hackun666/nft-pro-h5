<template>
  <view class="main">
    <Navbar title="系统设置" />
    <view class="base_box">
      <view class="strip"></view>
      <view class="safe_box">
        <view class="u_menu_item" @tap="goPage('/pages/userinfo/userinfo')">
          <text>用户信息</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="u_menu_item" @tap="goPage('/pages/safty/safty')">
          <text>账户安全</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="u_menu_item" @tap="goPage('/pages/about/about')">
          <text>关于我们</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
      </view>
      <view class="safe_box mt100">
        <view class="logout" @tap="loginOut">
          <text>退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./setting.less";
import Navbar from "../../components/navbar";
import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      cache: 0,
      token: getToken(),
    };
  },
  mounted() {
    this.cache = (Math.random() * (1 - 0.01) + 0.01).toFixed(2);
  },
  onShow() {
    this.checkAuth();
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
    clearCache() {
      Taro.showLoading({
        title: "清除中...",
      });
      setTimeout(() => {
        this.cache = 0;
        Taro.hideLoading();
      }, 500);
    },
    goBackUser() {
      Taro.navigateTo({
        url: "/pages/user/user",
      });
    },
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
    loginOut() {
      Taro.showModal({
        title: "系统提示",
        content: "您确认要退出吗",
        success: function (res) {
          if (res.confirm) {
            Taro.removeStorageSync("token");
            Taro.reLaunch({
              url: "/pages/index/index",
            });
          }
        },
      });
    },
  },
};
</script>
