<template>
  <view class="main">
    <view class="filter_top">
      <view class="search_box">
        <view class="search_innser">
          <image
            src="../../assets/img/s_ico.svg"
            class="search_ico"
            mode="widthFix"
          />
          <input
            type="text"
            class="s_ipt"
            v-model="keyword"
            placeholder="搜索商品"
          />
        </view>
        <view class="search_btn flex_center" @tap="search">搜索</view>
      </view>
      <view class="filter_bar_index">
        <view class="filter_item_index" @tap="showNft">
          <text class="tit" :class="show_type == 1 ? 'now' : ''">藏品</text>
          <!-- <text class="tit" @tap="showType(2)" :class="now_type == 2 ? 'now' : ''">盲盒</text> -->
        </view>
        <!-- <view class="line"></view>
        <view class="filter_item_index" @tap="showXilie">
          <text class="tit">系列</text>
        </view> -->
        <view class="line"></view>
        <view class="filter_item_index" @tap="sortPrice">
          <text class="tit">价格排序</text>

          <image
            v-if="sort_price == 2"
            src="../../assets/img/up.png"
            mode="aspectFill"
            class="sort_icon"
          />
          <image
            v-if="sort_price == 1"
            src="../../assets/img/down.png"
            mode="aspectFill"
            class="sort_icon"
          />
        </view>
        <view class="line"></view>
        <view class="filter_item_index" @tap="sortTime">
          <text class="tit">时间排序</text>
          <image
            v-if="sort_time == 2"
            src="../../assets/img/up.png"
            mode="aspectFill"
            class="sort_icon"
          />
          <image
            v-if="sort_time == 1"
            src="../../assets/img/down.png"
            mode="aspectFill"
            class="sort_icon"
          />
        </view>
      </view>
    </view>

    <view class="mask" v-if="xilie_box > 0" @tap="hideFilter"></view>
    <view class="filter_box" v-if="xilie_box > 0">
      <view class="f_list">
        <view
          class="f_row"
          v-for="item in xilie"
          :key="item.id"
          @tap="goXItem(item.id)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <view class="info_box" v-if="show_type == 1">
      <view class="good_list" v-if="nft_on_sale.length > 0">
        <view
          class="good_item"
          v-for="item in nft_on_sale"
          :key="item.id"
          @tap="goItem(item.title)"
        >
          <image :src="item.cover" mode="aspectFill" class="good_cover" />
          <view class="good_info">
            <view class="good_title el">{{ item.title }}</view>
            <view class="good_meta">
              <!-- <view class="u_num" v-if="item.nft_type == 1"
                >{{ item.nftinfo.no }}/{{ item.nftinfo.max_no }}</view
              >
              <view class="u_num" v-if="item.nft_type == 2">盲盒</view> -->
              <view class="u_num">共{{ item.sale_num }}件寄售</view>
              <view class="price"
                >&yen;<text class="big price_font">{{ item.price }}</text
                >起</view
              >
            </view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_data.png"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无商品</view>
      </view>
    </view>
    <!-- <view class="info_box" v-else>
      <view class="good_list" v-if="nft_on_sale.length > 0">
        <view
          class="good_item"
          v-for="item in xilie_list"
          :key="item.id"
          @tap="goXItem(item.id)"
        >
          <image :src="item.cover" mode="aspectFill" class="good_cover" />
          <view class="good_info">
            <view class="good_title el">{{ item.name }}</view>
            <view class="good_meta">
              <view class="u_num" v-if="item.sale_num > 0"
                >共{{ item.sale_num }}件寄售</view
              ><view class="u_num" v-else>暂无寄售</view>
              <view class="price" v-if="item.sale_num > 0"
                >&yen;<text class="big price_font">{{ item.price }}</text
                >起</view
              >
            </view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_data.png"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无商品</view>
      </view>
    </view> -->
    <footerBar />
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./market.less";
import { isLogined, getToken } from "../../utils/tools";
import Navbar from "../../components/navbar";
import footerBar from "../../components/footer";
import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
    footerBar,
  },
  data() {
    return {
      user: {},
      keyword: "",
      sort_price: 1,
      sort_time: 1,
      nft_on_sale: [],
      config: {},
      token: getToken(),
      show_type: 1,
      xilie_list: [],
      xilie: [],
      xilie_box: false,
    };
  },
  onShow() {
    this.checkAuth();
    this.getData();
    this.getConfig();
    this.getUser();
  },
  methods: {
    showNft() {
      this.show_type = 1;
      this.xilie_box = false;
      this.getData();
    },
    showXilie() {
      this.xilie_box = true;
    },
    hideFilter() {
      this.xilie_box = false;
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
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
        }
      });
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
    sortPrice() {
      this.sort_time = 0;
      if (this.sort_price > 1) {
        this.sort_price = 0;
      } else {
        this.sort_price += 1;
      }
      this.getData();
    },
    sortTime() {
      this.sort_price = 0;
      if (this.sort_time > 1) {
        this.sort_time = 0;
      } else {
        this.sort_time += 1;
      }
      this.getData();
    },
    goItem(title) {
      Taro.navigateTo({
        url: "/pages/salelist/salelist?title=" + title,
      });
    },
    goXItem(xl_id) {
      Taro.navigateTo({
        url: "/pages/xilie/xilie?xl_id=" + xl_id,
      });
    },
    search() {
      this.page = 1;
      this.nft_on_sale = [];
      this.getData();
    },
    getData() {
      Taro.showLoading({
        title: "加载中",
      });
      this.loading = true;
      Taro.request({
        url: serverUrl + "/market/nftonsale",
        data: {
          keyword: this.keyword,
          sort_price: this.sort_price,
          sort_time: this.sort_time,
          show_type: this.show_type,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.nft_on_sale = res.data.data;
          this.xilie = res.data.xilie;
        }
        Taro.hideLoading();
      });
    },
    getXilie() {
      Taro.showLoading({
        title: "加载中",
      });
      this.loading = true;
      Taro.request({
        url: serverUrl + "/market/xilie",
        data: {
          keyword: this.keyword,
          sort_price: this.sort_price,
          sort_time: this.sort_time,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.xilie_list = res.data.data;
        }
        Taro.hideLoading();
      });
    },
  },
};
</script>
