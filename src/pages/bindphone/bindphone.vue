<template>
  <view class="main">
    <Navbar title="更换手机号" />
    <view class="form_page">
      <view class="user_form">
        <view class="user_form_row">
          <view class="user_form_label">当前手机号</view>
          <view class="user_form_val">
            <text class="phone">{{user.mobile}}</text>
          </view>
        </view>
        <view class="user_form_row">
          <view class="user_form_label">输入验证码</view>
          <view class="user_form_val">
            <input
              class="ipt"
              type="tel"
              maxlength="6"
              placeholder="请输入验证码"
            />
            <view class="getcode">获取验证码</view>
          </view>
        </view>
        <view class="user_form_row">
          <view class="user_form_label">新手机号码</view>
          <view class="user_form_val">
            <input
              class="ipt"
              type="tel"
              maxlength="11"
              placeholder="填写新的手机号"
            />
          </view>
        </view>
      </view>
      <view class="form_btn flex_center">保存</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./bindphone.less";
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
    this.getUser()
  },
  methods: {
    checkAuth(){
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
