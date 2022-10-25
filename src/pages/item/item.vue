<template>
  <view class="main">
    <view class="back_area flex_center" @tap="goBack" v-if="env != 'weapp'">
      <image
        src="../../assets/img/back.svg"
        class="back_icon"
        mode="widthFix"
      />
    </view>
    <view class="img_show" v-if="info.format == 1">
      <view class="img_con" :class="sta_3d ? 'rotate' : ''">
        <image class="cover_img" :src="info.cover" mode="widthFix"
          @tap="previewImage(info.cover)"/>
        <view
          class="back_img"
          :style="{
            background: 'url(' + config.logo + ') no-repeat center #fff',
            backgroundSize: '200px auto',
          }"
        ></view>
      </view>
      <view class="img_meta_detail">
        <image
          src="../../assets/img/3d_on.svg"
          v-if="sta_3d"
          class="img_3d"
          mode="widthFix"
          @tap="switch3d"
        />
        <image
          src="../../assets/img/3d_off.svg"
          v-else
          class="img_3d"
          mode="widthFix"
          @tap="switch3d"
        />
      </view>
      <image src="../../assets/img/wutai1.png" class="wutai" mode="widthFix" />
    </view>
    <video
      v-else-if="info.format == 2" :poster="info.cover" :src="info.asset_url"  :controls="false" :autoplay="true" :loop="true" initial-time="0"
      class="mp4_cover"
    ></video>
    <view class="info_box">
      <view class="nft_info_box card">
        <view class="nft_pirce"
          >&yen;
          <text class="fee">{{ market.price }}</text>
        </view>
        <view class="title">{{ info.title }}</view>
        <view class="nft_meta flex_start">
          <view class="tag_label flex_center" v-if="info.tag_a"
            ><text class="val">{{ info.tag_a }}</text></view
          >
          <view class="tag_label flex_center" v-if="info.tag_b"
            ><text class="val">{{ info.tag_b }}</text></view
          >
          <view class="sold" v-if="market.nft_type == 1">编号: #{{nftinfo.no }}/{{nftinfo.max_no}}</view>
        </view>
        <view class="nft_author" v-if="info.artist">
          <image
            :src="info.artist.face"
            class="author_face"
            mode="aspectFill"
          />
          <view class="author_info">
            <view>创作者</view>
            <view class="author_name">{{ info.artist.name }}</view>
          </view>
        </view>


      </view>

      <view class="chain_info card">
        <view class="info_title">转售人信息</view>
        <!-- <view class="chain_row">
          <view class="chain_label">转售人昵称</view>
          <view class="chain_val flex_start">
            <text class="hash">{{ holder.nickname }}</text>
          </view>
        </view> -->
        <view class="chain_row">
          <view class="chain_label">转售人地址</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ holder.address }}</text>
          </view>
        </view>
      </view>


      <view class="chain_info card">
        <view class="info_title">区块链信息</view>
        <view class="chain_row">
          <view class="chain_label">区块链地址</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ info.class_id }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">交易哈希</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ info.tx_hash }}</text>
          </view>
        </view>
      </view>


      <view class="info_tips_box card" v-if="info.artist">
        <view class="info_title">艺术家简介</view>
        <view class="info_tips">{{ info.artist.desc }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">藏品介绍</view>
        <view class="info_tips">{{ info.long_desc }}</view>
        <view class="content">
          <image :src="info.content_src" mode="widthFix" class="content_src"/>
        </view>
        <view class="author_box">
          <view class="flex_between" v-if="info.artist">
            <text>创作者</text>
            <text>{{ info.artist.name }}</text>
          </view>
          <view class="flex_between" v-if="info.producer">
            <text>发行方</text>
            <text>{{ info.producer.name }}</text>
          </view>
        </view>
      </view>

      <view class="info_tips_box card">
        <view class="info_title">权益须知</view>
        <view class="info_tips">{{config.quanyi}}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">购买须知</view>
        <view class="info_tips">{{config.goumai}}</view>
      </view>
    </view>
    <view class="f_blank"></view>
    <view class="fix_buy_btn_item">
      <view class="buy_btn_item flex_center" @tap="buy">立即购买</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./item.less";

import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
export default {
  components: {
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
      holder: {},
      nftinfo: {},
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getData();
    this.getConfig();
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
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
        }
      });
    },
    hidePoster(){
      this.show_poster = false;
      this.sta_3d = true
    },
    showPoster(){
      Taro.showLoading({
        title: '加载中'
      })
      this.sta_3d = false
      this.ewm = 'http://eicshop.7192.com/ewm.php?url='+encodeURIComponent(this.config.domain+'#/pages/detail/detail?id='+this.info.id)
      this.show_poster = true;
      setTimeout(() => {
        Taro.hideLoading()
      }, 1000);
    },
    switch3d(){
      this.sta_3d = !this.sta_3d;
    },
    previewImage(img_src) {
      this.sta_3d = false
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
    buy() {
      if (isLogined()) {
        Taro.request({
          url: serverUrl + "/userapi/buyitem",
          data: {
            id: this.id,
            token: this.token
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
        url: "/pages/market/market",
      });
    },
    getData() {
      Taro.request({
        url: serverUrl + "/api/getmarketitem",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
          this.market = res.data.item;
          this.holder = res.data.holder;
          this.nftinfo = res.data.nftinfo;
        }
      });
    },

  },
};
</script>
