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
      <view
        id="__nc"
        v-show="captcha_sta"
        style="width: 100%; margin-bottom: 20px"
      >
        <view id="nc"></view>
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
      show_num: [],
      identifyCode: "",
      ncShow: true, //人机校验显示隐藏
      nc_DataArr: {},
      code_form: null,
      logVal: 1,
      captcha_sta: false,
    };
  },
  onLoad(options) {
    this.getConfig();
    if (options.ref_code) {
      this.ref_code = options.ref_code;
      Taro.setStorageSync("ref_code", options.ref_code);
    } else {
      if (Taro.getStorageSync("ref_code")) {
        this.ref_code = Taro.getStorageSync("ref_code");
      }
    }
  },
  methods: {
    check() {
      let that = this;
      // 实例化nc
      const nc_token = [
        "FFFF0N0000000000B157",
        new Date().getTime(),
        Math.random(),
      ].join(":");
      const nc = NoCaptcha.init({
        renderTo: "#nc",
        appkey: "FFFF0N0000000000B157",
        scene: "nc_login_h5",
        token: nc_token,
        trans: { key1: "code200" },
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "cn",
        timeout: 10000,
        retryTimes: 5,
        errorTimes: 5,
        inline: false,
        apimap: {
          // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
          // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
        },
        bannerHidden: false,
        initHidden: false,
        callback: function (data) {
          console.log("data:", data);
          // data.nc_token = nc_token
          // data.scene = 'nc_message_h5'

          that.code_form = {
            captchaType: "scoreOffline",
            nc_token: nc_token,
            phoneNumber: this.phone,
            scene: "nc_login_h5",
            sessionId: data.csessionid,
            sig: data.sig,
          };

          that.reSendCode();
          // console.log(data)
          // window.console && console.log('nc_token：' + nc_token)
          // window.console && console.log('csessionid：' + data.csessionid)
          // window.console && console.log('sig：' + data.sig)
        },
        error: function (s) {},
      });
      NoCaptcha.setEnabled(true);
      nc.reset(); //请务必确保这里调用一次reset()方法
      that.captcha_sta = true;
      NoCaptcha.upLang("cn", {
        LOADING: "加载中...", //加载
        SLIDER_LABEL: "请向右滑动验证", //等待滑动
        CHECK_Y: "验证通过", //通过
        ERROR_TITLE: "非常抱歉，这出错了...", //拦截
        CHECK_N: "验证未通过", //准备唤醒二次验证
        OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
        TIPS_TITLE: "验证码错误，请重新输入", //验证码输错时的提示
      });
    },
    reSendCode() {
      console.log(this.code_form);

      Taro.request({
        url: serverUrl + "/api/captcha",
        data: {
          is_reg: 1,
          phone: this.phone,
          nc_token: this.code_form.nc_token,
          code_form: this.code_form,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.sendcode();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
          return;
        }
      });
    },
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
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

    goBack() {
      if (window.history.length <= 1) {
        Taro.navigateTo({
          url: "/pages/index/index",
        });
      } else {
        Taro.navigateBack({
          delta: 1,
        });
      }
    },
    sendcode() {
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
      if (!this.code_form) {
        Taro.showToast({
          title: "请先进行验证",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      that.isgetcode = false;
      Taro.request({
        url: serverUrl + "/api/sendcode",
        data: {
          mobile: this.phone,
          nc_token: this.code_form.nc_token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          that.time = 0;
          that.captcha_sta = false;
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
    getcode() {
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
      if (!this.captcha_sta) {
        this.check();
      }
    },
  },
};
</script>
