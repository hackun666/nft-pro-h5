<template>
  <view class="main">
    <Navbar title="商品详情" />
    <view class="good_cover">
      <image class="good_cover_img" :src="info.cover" mode="widthFix" />
    </view>
    <view class="info_box">
      <view class="good_info card2">
        <view class="good_price_bar flex_between">
          <view class="good_info_price">
            <text class="fee">{{ info.score }}</text> 积分
          </view>
          <!-- <view class="trans_fee" v-if="info.type == 2">{{info.trans_fee == 0 ? '包邮':'运费:'+info.trans_fee + '元'}}</view> -->
        </view>
        <view class="good_info_title">{{ info.title }}</view>
        <view class="good_info_desc">{{ info.desc }}</view>
        <view class="nft_meta flex_start">
          <view class="tag_label flex_center"
            ><text class="xl">发售</text
            ><view class="val">{{ info.total_num }}份</view></view
          >
          <view class="sold">剩余{{ info.num }}份</view>
        </view>
      </view>
      <view class="choose_address card2" @tap="chooseAddress">
        <view class="songzhi">送至</view>
        <view class="address_detail el" v-if="!address">请选择收货地址</view>
        <view class="address_detail el" v-else>{{ address.address }}</view>

        <image src="../../assets/img/arrow.svg" class="arrow" mode="widthFix" />
      </view>
      <view class="content card2">
        <view class="info_title">商品详情</view>
        <rich-text :nodes="info.content"></rich-text>
      </view>
    </view>
    <view class="f_blank"></view>
    <view class="fix_buy_btn_item">
      <view class="buy_btn_item flex_center" @tap="duihuan"> 立即兑换</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./good.less";

import Navbar from "../../components/navbar";
import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import Poster from "../../components/poster";
export default {
  components: {
    Poster,
    Navbar,
  },
  data() {
    return {
      id: 0,
      info: {},
      env: process.env.TARO_ENV,
      market: {},
      token: getToken(),
      sta_3d: false,
      ewm: "",
      config: {},
      show_poster: false,
      holder: {},
      nftinfo: {},
      address: null,
      address_id: 0,
      tap_sta: false,
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getData();
    this.getConfig();
    if (options.address_id > 0) {
      this.address_id = options.address_id;
    }
    this.getAddress();
  },
  onShareAppMessage() {
    return {
      title: this.info.title,
      imageUrl: this.info.cover,
    };
  },
  onShareTimeline() {
    return {
      title: this.info.title,
      imageUrl: this.info.cover,
      query: "",
    };
  },
  methods: {
    getAddress() {
      Taro.request({
        url: serverUrl + "/userapi/addressinfo",
        data: {
          id: this.address_id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.address = res.data.data;
        }
      });
    },
    chooseAddress() {
      Taro.navigateTo({
        url: "/pages/address/address?good_id=" + this.id,
      });
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
    hidePoster() {
      this.show_poster = false;
      this.sta_3d = true;
    },
    showPoster() {
      Taro.showLoading({
        title: "加载中",
      });
      this.sta_3d = false;
      this.ewm =
        "http://eicshop.7192.com/ewm.php?url=" +
        encodeURIComponent(
          this.config.domain + "#/pages/detail/detail?id=" + this.info.id
        );
      this.show_poster = true;
      setTimeout(() => {
        Taro.hideLoading();
      }, 1000);
    },
    switch3d() {
      this.sta_3d = !this.sta_3d;
    },
    previewImage(img_src) {
      this.sta_3d = false;
      Taro.previewImage({
        current: "", // 当前显示图片的http链接
        urls: [img_src], // 需要预览的图片http链接列表
      });
    },
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
    duihuan() {
      if (!this.address) {
        Taro.showToast({
          title: "请选择收货地址",
          icon: "none",
        });
        return;
      }
      if (isLogined()) {
        if (!this.tap_sta) {
          this.tap_sta = true;
          Taro.request({
            url: serverUrl + "/userapi/duihuan",
            data: {
              id: this.id,
              token: this.token,
              address_id: this.address_id,
            },
          }).then((res) => {
            if (res.data.errcode == 0) {
              Taro.showToast({
                title: res.data.errmsg,
                icon: "none",
              });
              setTimeout(() => {
                Taro.redirectTo({
                  url: "/pages/orders/orders",
                });
              }, 1000);
            } else if (res.data.errcode == 40005) {
              Taro.showToast({
                title: "您还没有通过实名认证",
                icon: "none",
              });
              setTimeout(() => {
                Taro.navigateTo({
                  url: "/pages/verify/verify",
                });
              }, 1000);
            } else {
              Taro.showToast({
                title: res.data.errmsg,
                icon: "none",
              });

              this.tap_sta = false;
              return;
            }
          });
        }
      } else {
        Taro.navigateTo({
          url: `/pages/login/login`,
        });
      }
    },
    buy() {
      if (!this.address) {
        Taro.showToast({
          title: "请选择收货地址",
          icon: "none",
        });
        return;
      }
      if (isLogined()) {
        Taro.request({
          url: serverUrl + "/userapi/buygood",
          data: {
            id: this.id,
            token: this.token,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            Taro.navigateTo({
              url: "/pages/pay/pay?oid=" + res.data.order_id,
            });
          } else if (res.data.errcode == 40005) {
            Taro.showToast({
              title: "您还没有通过实名认证",
              icon: "none",
            });
            setTimeout(() => {
              Taro.navigateTo({
                url: "/pages/verify/verify",
              });
            }, 1000);
          } else {
            Taro.showToast({
              title: res.data.errmsg,
              icon: "none",
            });
            return;
          }
        });
      } else {
        Taro.navigateTo({
          url: `/pages/login/login`,
        });
      }
    },
    goBack() {
      Taro.navigateTo({
        url: "/pages/mall/mall",
      });
    },
    getData() {
      Taro.request({
        url: serverUrl + "/api/getgooditem",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
        }
      });
    },
  },
};
</script>
