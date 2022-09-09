<template>
  <view class="main">
    <Navbar title="转赠记录" />
    <view class="order_nav">
      <view
        class="order_nav_item"
        @tap="switchNav(1)"
        :class="status == 1 ? 'on' : ''"
        >我赠送的</view
      >
      <view
        class="order_nav_item"
        @tap="switchNav(2)"
        :class="status == 2 ? 'on' : ''"
        >我收到的</view
      >
    </view>
    <view class="info_box2">
      <view class="order_list" v-if="list.length > 0">
        <view class="order_item" v-for="(item, index) in list" :key="index">
          <view class="order_item_top" v-if="item.type == 1">
            <view class="author_bar">藏品地址: {{item.info.nft_id}}</view>
          </view>
          <view class="order_info flex_start">
            <image class="work_thumb" v-if="item.type == 1" :src="item.info.uri" mode="aspectFit"/>
            <image class="work_thumb" v-else :src="item.info.cover" mode="aspectFit"/>
            <view class="work_data">
              <view class="title ek">{{ item.info.title }}</view>
            </view>
          </view>
          <view class="log_meta">
            <view v-if="item.type == 1">藏品编号: {{item.info.no}} - {{item.info.max_no}}</view>
            <view v-else>盲盒编号: {{item.info.no}}</view>
            <view>赠送时间：{{formatDate(item.time)}}</view>
            <view>对方昵称：{{item.user.nickname}}</view>
            <view>对方手机号：{{item.user.mobile}}</view>
            <view>对方地址：{{item.user.address}}</view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_result.svg"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无记录</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./translog.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      status: 1,
      list: [],
      page: 1,
      token: getToken(),
    };
  },
  onLoad() {},
  onShow() {
    this.checkAuth();
    this.getTransLog();
  },
  methods: {
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

    goDetail(id) {
      Taro.navigateTo({
        url: "/pages/detail/detail?id=" + id,
      });
    },
    switchNav(nav) {
      this.status = nav;
      this.page = 1;
      this.getTransLog();
    },
    getTransLog() {
      Taro.request({
        url: serverUrl + "/userapi/translog",
        data: {
          token: this.token,
          page: this.page,
          status: this.status,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.list = res.data.data;
        }
      });
    },
    formatDate(time) {
      var date = new Date(time * 1000);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
  },
};
</script>
