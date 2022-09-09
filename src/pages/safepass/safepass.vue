<template>
  <view class="main">
    
    <Navbar title="设置安全密码" />
    <view class="no_result" v-if="pass_sta">
      <image
        src="../../assets/img/safepass.svg"
        class="no_result_img"
        mode="widthFix" />
      <text class="no_result_text">您已成功设置安全密码</text>
      <view class="edit_pass" @tap="pass_sta = false">修改安全密码</view>
    </view>
    <view class="login_form_safe" v-else>
      
      <view class="login_form_row">
        <image
          class="form_ico"
          src="../../assets/img/password.svg"
          mode="widthFix"
        />
        <input
          type="password"
          v-model="password"
          placeholder="请输入安全密码"
          class="login_form_ipt yzm"
        />
      </view>
      
      <view class="login_form_row">
        <image
          class="form_ico"
          src="../../assets/img/password.svg"
          mode="widthFix"
        />
        <input
          type="password"
          v-model="repassword"
          placeholder="确认安全新密码"
          class="login_form_ipt yzm"
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
      <view
        @tap="savepass"
        class="login_btn flex_center"
        >保存密码</view
      >
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import Navbar from "../../components/navbar";
import { getToken, setToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import "./safepass.less";
export default {
  components: {Navbar},
  data() {
    return {
      phone: "",
      password: "",
      repassword: "",
      code: "",
      isgetcode: true,
      getcodetest: "获取验证码",
      disabled: true,
      time: 0,
      codeid: 0,
      env: process.env.TARO_ENV,
      config: null,
      token: getToken(),
      agree_sta: false,
      pass_sta: false,
      user: {},
    };
  },
  onLoad() {
    this.getConfig();
    this.getUser();
    this.getSafePass();
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
    agree() {
      this.agree_sta = !this.agree_sta;
    },
    getSafePass(){
      Taro.request({
        url: serverUrl + "/userapi/checkpass",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.pass_sta = true;
        }
      });
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
      
      if (this.password.length < 6 || this.repassword.length < 6) {
        Taro.showToast({
          title: "安全密码至少6位",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      
      if (this.password != this.repassword) {
        Taro.showToast({
          title: "两次密码输入不一致",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      
      if(this.code.length < 1){
          Taro.showToast({
              title: "请输入短信验证码",
              icon: "none",
          });
          return
      }
      Taro.request({
        url: serverUrl + "/userapi/saveuserpass",
        data: {
          token: this.token,
          code: this.code,
          codeid: this.codeid,
          password: this.password,
          repassword: this.repassword,
        },
        method: "POST",
        dataType: "json",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "安全密码设置成功",
            icon: "none",
            duration: 2000,
          });
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
    getcode() {
      var that = this;
      if (!this.isgetcode) {
        return;
      }
      if (this.user.mobile.length < 1) {
        Taro.showToast({
          title: "请填写手机号",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.user.mobile)) {
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
          mobile: this.user.mobile,
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
