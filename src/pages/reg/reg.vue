<template>
  <view class="login_page">
    <image
      class="go_back"
      src="../../assets/img/goback.svg"
      @tap="goBack"
      v-if="env != 'weapp'"
    />
    <view class="reg_tit">注册账户</view>
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
          class="login_form_ipt price_font"
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
          class="login_form_ipt yzm price_font"
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
          placeholder="请输入密码"
          class="login_form_ipt yzm"
        />
      </view>
      <view class="login_form_row" v-if="config.refer_sta == 1">
        <image
          class="form_ico"
          src="../../assets/img/refer.svg"
          mode="widthFix"
        />
        <input
          type="tel"
          v-model="ref_code"
          placeholder="请输入邀请码 选填"
          class="login_form_ipt price_font"
        /> </view
      ><view class="login_term">
        <image
          class="chk_ico"
          v-if="agree_sta"
          src="../../assets/img/agreed.svg"
          mode="widthFix"
          @tap="agree"
        />
        <image
          class="chk_ico"
          v-else
          src="../../assets/img/uncheck.svg"
          mode="widthFix"
          @tap="agree"
        />
        <view
          >我已阅读并同意<text
            class="bbb"
            @tap="goPage('/pages/regrule/regrule')"
            >《用户协议》</text
          >和<text class="bbb" @tap="goPage('/pages/privacy/privacy')"
            >《隐私政策》</text
          ></view
        >
      </view>
      <view
        @tap="reg"
        class="login_btn flex_center"
        :class="phone.length == 11 ? '' : 'disabled'"
        >立即注册</view
      >
    </view>

    <view class="login_rules"
      >已注册用户？<text class="bbb" @tap="goLogin">立即登录</text></view
    >
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import { setUserName, setToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import "./reg.less";
export default {
  components: {},
  data() {
    return {
      phone: "",
      password: "",
      code: "",
      ref_code: "",
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
  onLoad(options) {
    this.getConfig();
    if(options.ref_code){
      this.ref_code = options.ref_code
      Taro.setStorageSync('ref_code', options.ref_code);
    }else{
      if(Taro.getStorageSync('ref_code')){
        this.ref_code = Taro.getStorageSync('ref_code');
      }
    }
  },
  methods: {
    
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
    agree(){
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
    goLogin(page) {
      Taro.navigateTo({
        url: "/pages/login/login",
      });
    },
    reg() {
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
      if (!this.agree_sta) {
        Taro.showToast({
          title: "请同意用户协议",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/api/reg",
        data: {
          mobile: this.phone,
          code: this.code,
          codeid: this.codeid,
          password: this.password,
          ref_code: this.ref_code,
        },
        method: "POST",
        dataType: "json",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "注册成功",
            icon: "none",
            duration: 2000,
          });
          setToken(res.data.token);
          setUserName(res.data.username);
          setTimeout(() => {
            Taro.redirectTo({
              url: "/pages/user/user",
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

     goBack(){
      if (window.history.length <= 1) {
        Taro.navigateTo({
          url: "/pages/index/index"
        })
      } else {
        Taro.navigateBack({
          delta: 1,
        })
      }
      
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
