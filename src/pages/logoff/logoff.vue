<template>
  <view class="main">
    <Navbar title="帐号注销" />
    <view class="form_page">
      <view class="off_box">
        <view class="t_top">当前帐号</view>
        <view class="tel_no">{{ user.mobile }}</view>
        <view class="log_off_tips">
          <view class="tit">温馨提示</view>
          <view
            >账户注销是不可逆的操作，一旦注销成功，则个人资料、购买记录等均会清空且不可恢复，请谨慎操作！</view
          >
        </view>
      </view>
      <view class="form_btn flex_center" @tap="logoff">立即注销</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./logoff.less";
import Navbar from "../../components/navbar";
import { isLogined, getToken } from "../../utils/tools";

import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      user: {},
      token: getToken(),
    };
  },

  onShow() {
    this.checkAuth();
    this.getUser();
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
    logoff(){
        var that = this;
      Taro.showModal({
        title: "系统提示",
        content: "您确认要注销当前帐号吗",
        success: function (res) {
          if (res.confirm) {
            Taro.request({
              url: serverUrl + "/userapi/logoff",
              data: {
                token: that.token,
              },
            }).then((res) => {
              if (res.data.errcode == 0) {
                Taro.showToast({
                  title: '注销成功',
                  icon: "success",
                });
                Taro.removeStorageSync("token");
                Taro.reLaunch({
                url: "/pages/index/index",
                });
              } else {
                Taro.showToast({
                  title: r.data.errmsg,
                  icon: "none",
                  duration: 2000,
                });
              }
            });
          }
        },
      });
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
