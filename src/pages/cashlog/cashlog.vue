<template>
  <view class="main">
    <Navbar title="账户明细" />
    <view class="info_box2">
      <view class="cash_list" v-if="list.length > 0">
        <view class="cash_item" v-for="item in list" :key="item.id">
          <view class="cash_item_meta">交易单号：{{ item.order.order_no}}</view>
          <view class="cash_item_meta">下单时间：{{ formatDate(item.order.add_time) }}</view>
          <view class="cash_item_meta">付款时间：{{ formatDate(item.order.pay_time) }}</view>
          <view class="cash_item_meta">藏品名称：{{ item.order.title}}</view>
          <view class="cash_item_meta">买家手机号：{{ item.buyer.mobile}}</view>
          <view class="cash_item_meta">订单金额：&yen;{{ item.order.fee}}</view>
          <view class="cash_item_meta">收益金额：&yen;{{ item.cash}}</view>
          <view class="cash_item_meta">收益时间：{{ formatDate(item.order.pay_time) }}</view>
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
import "./cashlog.less";
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
      token: getToken(),
      list: [],
      page: 1,
      loading: false,
      loadAll: false,
      total_num: 0,
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getData();
  },
  onReachBottom() {
    this.getData();
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
    getData() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.showLoading({
          title: "加载中",
        });
      Taro.request({
        url: serverUrl + "/userapi/cashlog",
        data: {
          token: this.token,
            page: this.page,
        },
      }).then((res) => {
       if (res.data.errcode == 0) {

            if (this.page == 1) {
              this.total_num = res.data.total_num
              if (res.data.data.length > 0) {
                this.list = res.data.data;
                this.page++;
              }
            } else {
              if (res.data.data.length > 0) {
                this.list = [...this.list, ...res.data.data];
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
  },
};
</script>
