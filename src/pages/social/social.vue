<template>
  <view class="main">
    <Navbar title="绑定第三方账户" />
    <view class="user_form" v-if="user">
      <view class="s_row" v-if="user.wx_openid">
        <image src="../../assets/img/wechat.svg" mode="widthFix" class="s_icon" />
        <view class="s_label">
          <view class="s_name">微信</view>
          <view class="s_tip">已绑定微信：{{user.wx_nickname}}</view>
        </view>
        <view class="s_val">
          <image
            :src="user.wx_face"
            class="face_icon"
            mode="widthFix"
          />
        </view>
      </view>
      <view class="s_row" v-else @tap="bindWX">
        <image src="../../assets/img/wechat.svg" mode="widthFix" class="s_icon" />
        <view class="s_label">
          <view class="s_name">微信</view>
          <view class="s_tip">需绑定已实名的微信账号</view>
        </view>
        <view class="s_val">
          <view class="s_tit">点击绑定</view>
          <image
            src="../../assets/img/arrow.svg"
            class="arrow_icon"
            mode="widthFix"
          />
        </view>
      </view>
      <!-- <view class="s_row" @tap="bindZFB">
        <image src="../../assets/img/alipay.svg" mode="widthFix" class="s_icon" />
        <view class="s_label">
          <view class="s_name">支付宝</view>
          <view class="s_tip">需绑定已实名的支付宝账号</view>
        </view>
        <view class="s_val">
          <view class="s_tit">点击绑定</view>
          <image
            src="../../assets/img/arrow.svg"
            class="arrow_icon"
            mode="widthFix"
          />
        </view>
      </view> -->
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./social.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      env: process.env.TARO_ENV,
      user: {},
      token: getToken(),
      userinfo: Taro.getStorageSync('userInfo')
    };
  },
  onShow() {
    this.checkAuth()
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
    bindWX(){
      if(this.env == 'weapp'){
        Taro.request({
          url: serverUrl + "/userapi/bindwx",
          data: {
            token: this.token,
            openid: Taro.getStorageSync('openid'),
            nickname: this.userinfo.nickName,
            face: this.userinfo.avatarUrl,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            Taro.showToast({
                title: "绑定成功",
                icon: "none",
              });
              this.getData()
          }
        });
        
      }else{
      }
    },
    bindZFB(){
      Taro.showToast({
        title: "暂不支持",
        icon: "none",
      });
    },
  },
};
</script>
