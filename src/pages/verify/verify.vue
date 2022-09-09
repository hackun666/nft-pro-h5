<template>
  <view class="main">
    <Navbar title="实名认证" />
    <view class="rz_box" v-if="user.rz_sta == 0">
      <view class="rz_tit">如实填写实名认证信息</view>
      <view class="rz_tel">当前登录手机号 {{ user.mobile }}</view>
      <view class="rz_tip"
        >按照法律法规要求，创建区块链地址需要用户提供身份信息，请填写与注册手机号实名一致的信息。绑定卡号，请绑定提现卡号
        。</view
      >
      <view class="rz_form">
        <view class="rz_row">
          <view class="rz_label">真实姓名</view>
          <input
            type="text"
            class="rz_ipt"
            placeholder="请输入您的真实姓名"
            v-model="real_name"
          />
        </view>
        <view class="rz_row">
          <view class="rz_label">身份证号</view>
          <input
            type="idcard"
            class="rz_ipt"
            placeholder="请输入您的身份证号码"
            v-model="id_no"
          />
        </view>
        <view class="rz_row">
          <view class="rz_label">银行卡号</view>
          <input
            type="idcard"
            class="rz_ipt"
            placeholder="请输入您的银行卡号"
            v-model="bank_card_no"
          />
        </view>
        <view class="rz_row">
          <view class="rz_label">预留手机号</view>
          <input
            type="text"
            class="rz_ipt"
            placeholder="请输入您的银行预留手机号"
            v-model="phone"
          />
        </view>

        <!-- <view class="rz_row">
          <view class="rz_label">验证码</view>
          <input
            type="text"
            class="rz_ipt"
            placeholder="请输入验证码"
            v-model="verify_code"
          />

          <view class="get_code" @tap="getcode">{{ getcodetest }}</view>
        </view> -->

        <view class="rz_btn flex_center" @tap="verify">立即认证</view>
      </view>
    </view>
    <view class="rz_ok" v-else>
      <image src="../../assets/img/v.svg" class="rz_ok_img" />
      <view class="rz_ok_txt">您已通过实名认证</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./verify.less";
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
      phone: "",
      real_name: "",
      id_no: "",
      bank_card_no: "",
      verify_code: "",
      token: getToken(),
      getcodetest: "获取验证码",
      isgetcode: true,
      flow_id: "",
      time: 0,
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
    verify() {
      Taro.showLoading({
        title: "认证中...",
        mask: true,
      });
      // if (this.verify_code.length < 1) {
      //   Taro.showToast({
      //     title: "请输入验证码",
      //     icon: "none",
      //   });
      //   return;
      // }
      // if (this.flow_id.length < 1) {
      //   Taro.showToast({
      //     title: "信息不全",
      //     icon: "none",
      //   });
      //   return;
      // }

      Taro.request({
        url: serverUrl + "/userapi/aliverify",
        data: {
          verify_code: this.verify_code,
          // flow_id: this.flow_id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "提交认证成功",
            icon: "success",
          });
          Taro.redirectTo({
            url: "/pages/user/user",
          });
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
        Taro.hideLoading();
      });
    },
    getcode() {
      if (this.real_name.length < 1) {
        Taro.showToast({
          title: "请输入真实姓名",
          icon: "none",
        });
        return;
      }
      if (this.id_no.length < 1) {
        Taro.showToast({
          title: "请输入身份证号码",
          icon: "none",
        });
        return;
      }
      //验证身份证号码
      var reg =
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!reg.test(this.id_no)) {
        Taro.showToast({
          title: "请输入正确的身份证号码",
          icon: "none",
        });
        return;
      }

      //验证身份证号年龄
      var myDate = new Date();
      var age = myDate.getFullYear() - this.id_no.substring(6, 10);
      if (age < 18) {
        Taro.showToast({
          title: "年龄不足18无法认证",
          icon: "none",
        });
        return;
      }

      if (this.bank_card_no.length < 1) {
        Taro.showToast({
          title: "请输入银行卡号",
          icon: "none",
        });
        return;
      }

      if (this.phone.length < 1) {
        Taro.showToast({
          title: "请输入银行预留手机号",
          icon: "none",
        });
        return;
      }
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
        url: serverUrl + "/userapi/eqbsms",
        data: {
          token: this.token,
          phone: this.phone,
          real_name: this.real_name,
          id_no: this.id_no,
          bank_card_no: this.bank_card_no,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.flow_id = res.data.data;
          Taro.showToast({
            title: "发送成功",
            icon: "none",
            duration: 2000,
          });
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
          that.isgetcode = true;
        }
      });
    },
  },
};
</script>