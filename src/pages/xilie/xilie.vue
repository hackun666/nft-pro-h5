<template>
  <view class="main">
    <Navbar :title="title" />
    <view class="info_box">
      <view class="good_list" v-if="xilie_list.length > 0">
        <view
          class="good_item"
          v-for="item in xilie_list"
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

    <footerBar />
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./xilie.less";
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
      config: {},
      token: getToken(),
      xl_id: 0,
      xilie_list: [],
      title: "查看藏品系列",
    };
  },
  onLoad(options) {
    this.xl_id = options.xl_id;
  },
  onShow() {
    this.checkAuth();
    this.getData();
    this.getConfig();
    this.getUser();
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
    goItem(title) {
      Taro.navigateTo({
        url: "/pages/salelist/salelist?title=" + title,
      });
    },
    getData() {
      Taro.showLoading({
        title: "加载中",
      });
      this.loading = true;
      Taro.request({
        url: serverUrl + "/market/xilielist",
        data: {
          xl_id: this.xl_id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.title = res.data.title;
          this.xilie_list = res.data.data;
        }
        Taro.hideLoading();
      });
    },
  },
};
</script>
