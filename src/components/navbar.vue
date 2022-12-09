<template>
  <view class="navbar" v-if="env != 'weapp'">
    <view class="navbar_inner">
        <view class="left_nav" @tap="goBack">
            <image class="left_icon" src="../assets/img/nav_back.svg" mode="widthFix"/>
        </view>
        <view class="nav_title">{{title}}</view>
        <view class="right_nav"></view>
    </view>
    <view class="backHome" v-if="path != '/pages/index/index'" @tap="goHome">
      <image class="icon" src="../assets/img/gohome.svg" mode="widthFix"/>
      <text>首页</text>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./navbar.less";
export default {
props: ["title"],
  data() {
    return {
      env: process.env.TARO_ENV,
      path: '',
    };
  },
  computed: {

  },
  created() {
    let page = Taro.getCurrentInstance();
    this.path = page.router.path.replace(/(\?|#)[^'"]*/, "");
  },
  methods: {
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
    goHome() {
      Taro.navigateTo({
          url: "/pages/index/index"
        })
    },
  },
};
</script>

<style>
</style>
