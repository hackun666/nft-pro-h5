<template>
  <view class="main">
    <Navbar title="我的藏品" />
    <view class="info_box2">
      <view class="box_tab">
        <view
          class="box_tab_item"
          :class="now_tab == 0 ? 'on' : ''"
          @tap="switchTab(0)"
          >未寄售</view
        >
        <view class="line_a"></view>
        <view
          class="box_tab_item"
          :class="now_tab == 1 ? 'on' : ''"
          @tap="switchTab(1)"
          >寄售中</view
        >
      </view>
      <view class="my_nft_list" v-if="list.length > 0">
        <view class="my_nft_list_item" v-for="item in list" :key="item.id" @tap="goNftInfo(item.id)">
          <view class="market_price" v-if="now_tab == 1"
            >寄售价格：&yen;{{ item.market.price }}</view
          >
          <image class="my_nft_item_img" :src="item.uri" mode="aspectFill"/>
          <view class="my_nft_item_info">
            <view class="title el">{{ item.name }}</view>
            <view class="no price_font"># {{item.no}} / {{item.max_no}}</view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_data.png"
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
import "./samenft.less";
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
      now_tab: 0,
      id: 0,
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.checkAuth();
    this.getUser();
    this.getData();
  },
  onReachBottom() {
    this.getData();
  },
  methods: {
    switchTab(tab) {
      this.now_tab = tab;
      this.list = [];
      this.page = 1
      this.loading = false
      this.loadAll = false
      this.getData();
    },
    goNftInfo(id){
      Taro.navigateTo({
        url: "/pages/nftinfo/nftinfo?id=" + id,
      });
    },
    getData() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.request({
          url: serverUrl + "/userapi/samenft",
          data: {
            token: this.token,
            page: this.page,
            onsale: this.now_tab,
            id: this.id,
          },
        }).then((res) => {
          if(res){
            if (this.page == 1) {
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
        });
      }
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
