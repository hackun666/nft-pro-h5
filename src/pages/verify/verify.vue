<template>
  <view class="main">
    <Navbar title="实名认证" />
    <view class="rz_box" v-if="user.rz_sta == 0">
      <view class="rz_tit">如实填写实名认证信息</view>
      <view class="rz_tel">当前登录手机号 {{ user.mobile }}</view>
      <view class="rz_tip2"
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
      Taro.request({
        url: serverUrl + "/userapi/verify",
        data: {
          token: this.token,
          phone: this.phone,
          real_name: this.real_name,
          id_no: this.id_no,
          bank_card_no: this.bank_card_no,
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
    
  },
};
</script>