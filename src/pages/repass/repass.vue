<template>
  <view class="login_page">
    <image
      class="go_back"
      src="../../assets/img/goback.svg"
      @tap="goBack"
      v-if="env != 'weapp'"
    />
    <view class="reg_tit">重设密码</view>
    <view class="login_form">
      <view class="login_form_row">
        <image
          class="form_ico"
          src="../../assets/img/phone.svg"
          mode="widthFix"
        />
        <input
          type="tel"
          v-model="phone"
          placeholder="请输入手机号码"
          class="login_form_ipt"
        />
      </view>
      <view class="login_form_row">
        <image
          class="form_ico"
          src="../../assets/img/sms.svg"
          mode="widthFix"
        />
        <input
          type="tel"
          v-model="code"
          maxlength="6"
          placeholder="请输入验证码"
          class="login_form_ipt yzm"
        />
        <view class="get_code" @tap="getcode">{{ getcodetest }}</view>
      </view>
      <view class="login_form_row">
        <image
          class="form_ico"
          src="../../assets/img/password.svg"
          mode="widthFix"
        />
        <input
          type="password"
          v-model="password"
          placeholder="请输入新密码"
          class="login_form_ipt yzm"
        />
      </view>
      <view
        @tap="savepass"
        class="login_btn flex_center"
        :class="phone.length == 11 ? '' : 'disabled'"
        >保存密码</view
      >
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import { setUserName, setToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import "./repass.less";
export default {
  components: {},
  data() {
    return {
      phone: "",
      password: "",
      code: "",
      isgetcode: true,
      getcodetest: "获取验证码",
      disabled: true,
      time: 0,
      codeid: 0,
      env: process.env.TARO_ENV,
      config: null,
      agree_sta: false,
    };
  },
  onLoad() {
    this.getConfig();
  },
  methods: {
    agree() {
      this.agree_sta = !this.agree_sta;
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
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
    goLogin(page) {
      Taro.navigateTo({
        url: "/pages/login/login",
      });
    },
    savepass() {
      if (this.phone.length < 1) {
        Taro.showToast({
          title: "请填写手机号",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        Taro.showToast({
          title: "手机号码有误，请重新填写",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.password.length < 1) {
        Taro.showToast({
          title: "请填写密码",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/api/savepass",
        data: {
          mobile: this.phone,
          code: this.code,
          codeid: this.codeid,
          password: this.password,
        },
        method: "POST",
        dataType: "json",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.removeStorageSync("token");
          Taro.showToast({
            title: "密码修改成功",
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => {
            Taro.redirectTo({
              url: "/pages/login/login",
            });
          }, 500);
          return;
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
      });
    },

    goBack() {
      Taro.navigateBack({
        delta: 1,
      });
    },
    getcode() {
      var that = this;
      if (!this.isgetcode) {
        return;
      }
      if (this.phone.length < 1) {
        Taro.showToast({
          title: "请填写手机号",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        Taro.showToast({
          title: "手机号码有误，请重新填写",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      that.isgetcode = false;
      Taro.request({
        url: serverUrl + "/api/getcode",
        data: {
          mobile: this.phone,
        },
        method: "POST",
        dataType: "json",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          that.codeid = res.data.codeid;
          let timecount = setInterval(() => {
            that.time++;
            if (that.time > 59) {
              clearInterval(timecount);
              that.getcodetest = "获取验证码";
              that.isgetcode = true;
            } else {
              that.getcodetest = 60 - parseInt(that.time) + "秒后重试";
            }
          }, 1000);
          return;
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>
