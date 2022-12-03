<template>
  <view class="main">
    <!-- <view class="header" v-if="config.logo">
      <image v-if="config" :src="config.logo" class="logo" mode="aspectFit" />
    </view> -->
    <swiper
      v-if="banners"
      class="banners"
      :indicator-dots="true"
      :circular="false"
      :autoplay="true"
    >
      <swiper-item
        class="banner_item"
        v-for="(item, index) in banners"
        :key="index"
      >
        <image
          :src="item.src"
          @tap="gotoUrl(item.url)"
          class="banner_img"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>
    <view class="notice_bar" v-if="notice.length > 0">
      <image
        class="notice_ico"
        src="../../assets/img/notice.svg"
        mode="widthFix"
      />
      <swiper
        class="notice_bar_list"
        :circular="false"
        :vertical="true"
        :autoplay="true"
      >
        <swiper-item
          class="notice_bar_list_item"
          v-for="(item, index) in notice"
          :key="index"
          @tap="goNotice(item.id)"
          ><text class="txt el">{{ item.title }}</text></swiper-item
        >
      </swiper>
      <image
        class="notice_menu"
        @tap="goNoticeList"
        src="../../assets/img/menu.svg"
        mode="widthFix"
      />
    </view>
    <!-- <view class="home_nav">
      <view class="home_nav_item" @tap="goPage('/pages/combolist/combolist')">
        <image
          class="home_nav_ico"
          src="../../assets/img/a1.svg"
          mode="widthFix"
        />
        <text>合成专区</text>
      </view>
      <view class="home_nav_item" @tap="goPage('/pages/mall/mall')">
        <image
          class="home_nav_ico"
          src="../../assets/img/a2.svg"
          mode="widthFix"
        />
        <text>积分商城</text>
      </view>
    </view> -->
    <view>
      <view class="nft_list" v-if="nft_list.length > 0">
        <view
          class="nft_item"
          v-for="item in nft_list"
          :key="item.id"
          @tap="goDetail(item.id, item.exchange_sta)"
        >
          <view>
            <view class="sale_status" v-if="item.sold_out == 1">已售罄</view>
            <view class="sale_status" v-else>{{
              item.sale_sta == 1 ? "抢购中" : item.sale_date + " 开售"
            }}</view>
          </view>
          <!-- <view class="is_box" v-if="item.nft_type == 2">盲盒</view> -->
          <image class="nft_cover" :src="item.cover" mode="widthFix" />
          <view class="nft_info">
            <view class="title">{{ item.title }}</view>
            <view class="nft_meta flex_start">
              <view class="tag_label flex_center"
                ><text class="xl">限量</text
                ><view class="val">{{ item.total_num }}份</view></view
              >
              <view class="tag_label flex_center" v-if="item.tag_a"
                ><text class="val">{{ item.tag_a }}</text></view
              >
              <view class="tag_label flex_center" v-if="item.tag_b"
                ><text class="val">{{ item.tag_b }}</text></view
              >
              <view class="price price_font" v-if="item.exchange_sta == 1"
                >限时兑换</view
              >
              <view class="price price_font" v-else
                >&yen;<text class="fee">{{ item.price }}</text></view
              >
            </view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/wait2.svg"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">敬请期待</view>
      </view>
    </view>
    <view class="rz_bar flex_start" v-if="user && user.rz_sta == 0">
      <view class="text">实名认证后才能购买数字藏品</view>
      <view class="rz_go flex_center" @tap="goPage('/pages/verify/verify')"
        >去认证</view
      >
    </view>



    <Chain />
    <footerBar />
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import footerBar from "../../components/footer";
import Chain from "../../components/chain";
import "./index.less";
import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import { isBeta } from "../../utils/util";

export default {
  components: {
    footerBar,
    Chain,
  },
  data() {
    return {
      banners: [],
      user: null,
      token: getToken(),
      nft_list: [],
      box_list: [],
      coming_nft_list: [],
      page: 1,
      loading: false,
      loadAll: false,
      nav_tab: 1,
      config: null,
      isBeta: isBeta(),
      notice: [],
    };
  },

  onShareAppMessage() {},
  onShareTimeline() {
    return {
      title: this.config.app_name,
      imageUrl: "",
      query: "",
    };
  },
  onShow() {
    if (isLogined()) {
      this.getUser();
    }
  },
  onLoad() {
    this.getConfig();
    this.getBanners();
    this.getNftList();
    // this.getComingNftList();
    this.getNoticeList();
  },
  onReachBottom() {
    this.getNftList();
  },
  methods: {
    gotoUrl(url) {
      if (url) {
        window.location.href = url;
      }
    },
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
          document.title = res.data.data.app_name;
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
      return m + "/" + d + " " + h + ":" + minute;
    },
    switchTab(tab) {
      this.nav_tab = tab;
    },
    getBanners() {
      Taro.request({
        url: serverUrl + "/api/getbanners",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.banners = res.data.data;
        }
      });
    },
    getNoticeList() {
      Taro.request({
        url: serverUrl + "/api/notice",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.notice = res.data.data;
        }
      });
    },
    getComingNftList() {
      Taro.request({
        url: serverUrl + "/api/getcominglist",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.coming_nft_list = res.data.data;
        }
      });
    },
    getBoxList() {
      Taro.request({
        url: serverUrl + "/api/getboxlist",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.box_list = res.data.data;
        }
      });
    },
    getNftList() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.request({
          url: serverUrl + "/api/getlist",
          data: {
            page: this.page,
            token: this.token,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            if (this.page == 1) {
              if (res.data.data.length > 0) {
                this.nft_list = res.data.data;
                this.page++;
              } else {
                this.loadAll = true;
              }
            } else {
              if (res.data.data.length > 0) {
                this.nft_list = [...this.nft_list, ...res.data.data];
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
    goNotice(id) {
      Taro.navigateTo({
        url: "/pages/noticeinfo/noticeinfo?id=" + id,
      });
    },
    goNoticeList() {
      Taro.navigateTo({
        url: "/pages/notice/notice",
      });
    },
    goDetail(id, exchange_sta) {
      if (exchange_sta > 0) {
        Taro.navigateTo({
          url: "/pages/exchange/exchange?id=" + id,
        });
      } else {
        Taro.navigateTo({
          url: "/pages/detail/detail?id=" + id,
        });
      }
    },
    goBox(id) {
      Taro.navigateTo({
        url: "/pages/box/box?id=" + id,
      });
    },
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
  },
};
</script>
