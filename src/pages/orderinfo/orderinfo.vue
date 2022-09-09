<template>
  <view class="main">
    <Navbar title="订单详情" />
    <view class="info_box2">
      <view class="order_sta" v-if="order.status == 0">待支付订单</view>
      <view class="order_sta" v-if="order.status == 1">订单已完成</view>
      <view class="order_sta" v-if="order.status == 2">订单已取消</view>
      <view class="order_item">
        <!-- <view class="order_item_top">
          <view class="author_bar">
            <image
              class="author_avatar"
              :src="info.author_face"
              mode="aspectFill"
            />
            <view class="author_name el">{{info.author_name}}</view>
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view> -->
        <view class="order_info flex_start">
          <image class="work_thumb" :src="order.cover" mode="widthFix" />
          <view class="work_data">
            <view class="title ek">{{ order.title }}</view>
          </view>
          <view class="order_price"
            >￥<text class="big">{{ order.fee }}</text></view
          >
        </view>
      </view>
      <view class="chain_info card">
        <view class="info_title">订单明细</view>
        <view class="chain_row">
          <view class="chain_label">订单编号</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ order.order_no }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品名称</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ order.title }}</text>
          </view>
        </view>
        <view class="chain_row" v-if="info.company">
          <view class="chain_label">藏品发行方</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ info.company }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">下单时间</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ formatDate(order.add_time) }}</text>
          </view>
        </view>
        <view class="chain_row" v-if="order.status == 1">
          <view class="chain_label">支付时间</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ formatDate(order.pay_time) }}</text>
          </view>
        </view>
      </view>
      

      <view class="rz_btn flex_center" v-if="order.status == 0" @tap="goPay"
        >去支付</view
      >
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./orderinfo.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      oid: 0,
      order: {},
      user: {},
      info: {},
      token: getToken(),
    };
  },
  onLoad(options) {
    this.oid = options.oid;
  },
  onShow() {
    this.checkAuth();
    this.getOrderInfo();
    this.getUser();
  },
  methods: {
    
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
    getOrderInfo() {
      Taro.request({
        url: serverUrl + "/userapi/orderinfo",
        data: {
          token: this.token,
          oid: this.oid,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.order = res.data.data;
          this.info = res.data.info;
        }
      });
    },
    goPay() {
      Taro.navigateTo({
        url: "/pages/pay/pay?oid=" + this.oid,
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
