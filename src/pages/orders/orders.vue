<template>
  <view class="main">
    <Navbar title="我的订单" />
    <view class="order_nav">
      <view
        class="order_nav_item"
        @tap="switchNav(0)"
        :class="status == 0 ? 'on' : ''"
        >全部</view
      >
      <view
        class="order_nav_item"
        @tap="switchNav(1)"
        :class="status == 1 ? 'on' : ''"
        >待付款</view
      >
      <view
        class="order_nav_item"
        @tap="switchNav(2)"
        :class="status == 2 ? 'on' : ''"
        >已完成</view
      >
      <view
        class="order_nav_item"
        @tap="switchNav(3)"
        :class="status == 3 ? 'on' : ''"
        >已取消</view
      >
    </view>
    <view class="info_box">
      <view class="order_list" v-if="orders.length > 0">
        <view class="order_item" v-for="(order, index) in orders" :key="index">
          <view class="order_item_top">
            <view class="author_bar">订单号:{{ order.order_no }}</view>
            <view class="order_staus dfk" v-if="order.status == 0">待付款</view>
            <view class="order_staus ywc" v-if="order.status == 1">已完成</view>
            <view class="order_staus yqx" v-if="order.status == 2">已取消</view>
          </view>

          <view class="order_info flex_start" @tap="goOrderInfo(order.id)">
            <image
              class="work_thumb"
              v-if="order.cover"
              :src="order.cover"
              mode="aspectFit"
            />
            <view class="work_data">
              <view class="title el2">{{ order.title }}</view>
              <view class="buy_num"
                >购买数量：<text class="big">×{{ order.buy_num }}</text></view
              >
              <view v-if="order.status == 1 && order.order_type != 8">
                <view class="order_up_sta" v-if="order.up_sta == 0"
                  >藏品发放中</view
                >
                <view class="order_up_sta_ok" v-else>藏品发放成功</view>
              </view>
            </view>
            <view class="order_price"
              >￥<text class="big">{{ order.fee }}</text></view
            >
          </view>
          <view class="order_btns" v-if="order.status == 0">
            <view class="pay_btn" @tap="cancelOrder(order.id)">取消订单</view>
            <view class="pay_btn" @tap="goPay(order.id)">去支付</view>
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

      <view class="no_more" v-if="loadAll">没有更多了</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./orders.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      status: 0,
      orders: [],
      token: getToken(),
      page: 1,
      loading: false,
      loadAll: false,
    };
  },
  onLoad() {
    this.getOrders();
  },

  onReachBottom() {
    this.getOrders();
  },
  onShow() {
    this.checkAuth();
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
    cancelOrder(oid) {
      var that = this;
      Taro.showModal({
        title: "系统提示",
        content: "您确认要取消当前订单吗",
        success: function (res) {
          if (res.confirm) {
            Taro.request({
              url: serverUrl + "/userapi/cancelorder",
              data: {
                token: that.token,
                oid: oid,
              },
            }).then((res) => {
              if (res.data.errcode == 0) {
                Taro.showToast({
                  title: "订单取消成功",
                  icon: "success",
                });
                that.page = 1;
                that.orders = [];
                that.loading = false;
                that.loadAll = false;
                that.getOrders();
              } else {
                Taro.showToast({
                  title: r.data.errmsg,
                  icon: "none",
                  duration: 2000,
                });
              }
            });
          }
        },
      });
    },
    switchNav(nav) {
      this.status = nav;
      this.page = 1;
      this.loading = false;
      this.loadAll = false;
      this.orders = [];
      this.getOrders();
    },
    getOrders() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.showLoading({
          title: "加载中",
        });
        Taro.request({
          url: serverUrl + "/userapi/getorders",
          data: {
            token: this.token,
            page: this.page,
            status: this.status,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            if (this.page == 1) {
              if (res.data.data.length > 0) {
                this.orders = res.data.data;
                this.page++;
              }
            } else {
              if (res.data.data.length > 0) {
                this.orders = [...this.orders, ...res.data.data];
                this.page++;
              } else {
                this.loadAll = true;
              }
            }
          }
          this.loading = false;
          Taro.hideLoading();
        });
      }
    },
    goOrderInfo(id) {
      Taro.navigateTo({
        url: "/pages/orderinfo/orderinfo?oid=" + id,
      });
    },
    goProfile(uid) {
      Taro.navigateTo({
        url: "/pages/profile/profile?uid=" + uid,
      });
    },
    goBackUser() {
      Taro.navigateTo({
        url: "/pages/user/user",
      });
    },
    goPay(oid) {
      Taro.navigateTo({
        url: "/pages/pay/pay?oid=" + oid,
      });
    },
  },
};
</script>
