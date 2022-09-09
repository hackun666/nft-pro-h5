<template>
  <view class="main">
    <Navbar title="账户安全" />
    <view class="base_box">
      <view class="strip"></view>
      <view class="safe_box">
        <view class="u_menu_item" @tap="goPage('/pages/verify/verify')">
          <text>实名认证</text>
          <view class="arrow_box flex_center">
            <view class="ps">{{ user.rz_sta == 0 ? "未认证" : "已认证" }}</view>
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <!-- <view class="u_menu_item" @tap="goPage('/pages/bindphone/bindphone')">
          <text>更换手机号</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view> -->
        <!-- <view class="u_menu_item" @tap="goPage('/pages/social/social')">
          <text>第三方绑定</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view> -->
        <view class="u_menu_item" @tap="goPage('/pages/payconfig/payconfig')">
          <text>收款设置</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="u_menu_item" @tap="goPage('/pages/repass/repass')">
          <text>修改密码</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="u_menu_item" @tap="goPage('/pages/safepass/safepass')">
          <text>安全密码</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="u_menu_item" @tap="goPage('/pages/logoff/logoff')">
          <text>注销账户</text>
          <view class="arrow_box flex_center">
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./safty.less";
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
      user: {},
      token: getToken(),
    };
  },
  onShow() {
    if (isLogined()) {
      this.getUser();
    } else {
      setTimeout(() => {
        Taro.navigateTo({
          url: "/pages/login/login",
        });
      }, 500);
    }
  },
  mounted() {
    this.cache = (Math.random() * (1 - 0.01) + 0.01).toFixed(2);
  },
  methods: {
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
    checkVer() {
      Taro.showToast({
        title: "已是最新版本",
        icon: "success",
      });
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
            Taro.removeStorageSync("userInfo");
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
