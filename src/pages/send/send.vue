<template>
  <view class="main">
    <Navbar title="藏品转赠" />
    <view class="send_block">
        <image class="send_logo" src="../../assets/img/send_img.svg" mode="widthFix"/>
        <view class="tt">请输入对方区块链地址或手机号</view>
        <view class="search_ipt">
            <input type="text" v-model="address" class="textarea" placeholder="点击输入或粘贴内容" />
        </view>
        <view class="search_btn flex_center" @tap="passcheck">立即转赠</view>
        <view class="send_tips">
          <view class="tt">温馨提示：</view>
          <view>数字藏品是使用区块链技术生成的唯一数字凭证，藏品转赠后无法退还，还请您谨慎操作</view>
        </view>
    </view>

    <view class="mask" v-if="pass_box" @tap="pass_box = false"></view>
    <view class="sell_box" v-if="pass_box">
      <view class="title">验证安全密码</view>
      <view class="sell_price">
        <text>安全密码</text>
        <input
          type="password"
          class="sell_price_ipt"
          placeholder="填写账户安全密码"
          v-model="password"
        />
      </view>
      <view class="sell_btn flex_center" @tap="verifyPass">确认转赠</view>
    </view>

  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./send.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      user: {},
      info: null,
      token: getToken(),
      address: '',
      id: "",
      class_id: "",
      password: "",
      pass_box: false,
      type: 1,
    };
  },
  onLoad(options) {
    this.id = options.id;
    if(options.type){
      this.type = options.type;
    }
    this.class_id = options.class_id;
  },
  onShow() {
    this.checkAuth();
    this.getUser();
  },
  methods: {
    passcheck() {
      this.password = ""
      if (this.address.length < 1) {
        Taro.showToast({
          title: "请输入对方账号",
          icon: "none",
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/userapi/checkpass",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.pass_box = true;
        } else {
          Taro.navigateTo({
            url: "/pages/safepass/safepass",
          });
        }
      });
    },
    verifyPass() {
      if (this.password.length < 6) {
        Taro.showToast({
          title: "请输入正确的安全密码",
          icon: "none",
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/userapi/verifypass",
        data: {
          token: this.token,
          password: this.password,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.send();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    send(){
        if(this.address.length < 1){
            Taro.showToast({
                title: "请输入对方账号",
                icon: "none",
            });
            return
        }
        Taro.request({
          url: serverUrl + "/userapi/send",
          data: {
            address: this.address,
            token: this.token,
            nft_id: this.id,
            password: this.password,
            type: this.type,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
              Taro.showToast({
                title: "转赠成功",
                icon: "success",
              });
              setTimeout(() => {
                Taro.navigateTo({
                  url: "/pages/user/user",
                });
              }, 1000);
          }else{
              Taro.showToast({
                title: res.data.errmsg,
                icon: "none",
            });
            return
          }
        });
    },
    copyTxt(txt) {
      Taro.setClipboardData({
        data: txt,
        success: function (res) {
          Taro.showToast({
            title: "复制成功",
            icon: "success",
          });
        },
      });
    },
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
