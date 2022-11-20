<template>
  <view class="main">
    <Navbar title="出售记录" />
    <view class="info_box">

      <view class="order_list" v-if="trade_log.length > 0">
        <view class="order_item" v-for="item in trade_log" :key="item.id">
          <view class="order_item_top">
            <view class="author_bar">订单号:{{item.order.order_no}}</view>
          </view>

          <view class="order_info flex_start">
            <image class="work_thumb" :src="item.order.cover" mode="aspectFit" />
            <view class="work_data">
              <view class="title el2">{{ item.order.title }}</view>
            </view>
            <view class="order_price"
              >￥<text class="big">{{ item.order.fee }}</text></view
            >
          </view>

          <view class="order_dsp">
            <!-- <view class="buyer">买家手机号：{{ hidePhone(item.buyer.mobile) }}</view> -->
            <view class="buyer">交易时间：{{ formatDate(item.time) }}</view>
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
import "./tradelog.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      type: 1,
      trade_log: [],
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
    this.checkAuth()
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

    switchNav(nav) {
      this.type = nav;
      this.page = 1;
      this.loading = false;
      this.loadAll = false;
      this.trade_log = [];
      this.getOrders();
    },
    getOrders() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.showLoading({
          title: "加载中",
        });
        Taro.request({
          url: serverUrl + "/userapi/tradelog",
          data: {
            token: this.token,
            page: this.page
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            if (this.page == 1) {
              if (res.data.data.length > 0) {
                this.trade_log = res.data.data;
                this.page++;
              }
            } else {
              if (res.data.data.length > 0) {
                this.trade_log = [...this.trade_log, ...res.data.data];
                this.page++;
              } else {
                this.loadAll = true;
              }
            }
          }
          this.loading = false;
          Taro.hideLoading()
        });
      }
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
    //js隐藏手机号中间
    hidePhone(phone) {
      if(phone){
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      }
    },
  },
};
</script>
