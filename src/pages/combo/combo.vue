<template>
  <view class="main">
    <view class="back_area flex_center" @tap="goBack" v-if="env != 'weapp'">
      <image
        src="../../assets/img/back.svg"
        class="back_icon"
        mode="widthFix"
      />
    </view>
    <view class="img_show">
      <view class="img_con" :class="sta_3d ? 'rotate' : ''">
        <image class="cover_img" :src="info.cover" mode="widthFix" />
        <view class="back_img" :style="{ background:'url(' + config.logo + ') no-repeat center #0E111C',backgroundSize: '200px auto' }"></view>
      </view>
      <view class="img_meta_detail">
        <image
          src="../../assets/img/look.svg"
          class="look"
          mode="widthFix"
          @tap="previewImage(info.cover)"
        />
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
      <image src="../../assets/img/wutai3.png" class="wutai" mode="widthFix" />
    </view>
    <view class="info_box2">
      <view class="nft_info_box card">
        <image
          src="../../assets/img/sold_out.png"
          v-if="info.sold_out == 1"
          class="sold_out"
          mode="widthFix"
        />
        <view class="title">{{ info.title }}</view>
        <view class="nft_meta flex_start">
          <view class="tag_label flex_center"
            ><text class="xl">限量</text
            ><view class="val">{{ info.total_num }}份</view></view
          >
          <view class="tag_label flex_center" v-if="info.tag_a"
            ><text class="val">{{ info.tag_a }}</text></view
          >
          <view class="tag_label flex_center" v-if="info.tag_b"
            ><text class="val">{{ info.tag_b }}</text></view
          >
          <view class="sold">剩余{{ info.num }}份</view>
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
      <view class="combo_rules card">
        <view class="info_title">合成材料</view>
        <view class="nft_need">
          <view class="nft_need_item" v-for="item in need_nfts" :key="item.id">
            <image :src="item.info.cover" class="need_nft_cover" mode="aspectFill"/>
            <view class="need_nft_tit el">{{item.info.title}}</view>
            <view class="need_nft_num">×{{item.need_num}}</view>
          </view>
          
        </view>
      </view>
      <view class="chain_info card">
        <view class="info_title">区块链信息</view>
        <view class="chain_row">
          <view class="chain_label">区块链地址</view>
          <view class="chain_val flex_start">
            <text class="hash" @tap="copyTxt(info.class_id)">{{ info.class_id }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">交易哈希</view>
          <view class="chain_val flex_start">
            <text class="hash" @tap="copyTxt(info.tx_hash)">{{ info.tx_hash }}</text>
          </view>
        </view>
      </view>

      <view class="info_tips_box card" v-if="info.author_desc">
        <view class="info_title">艺术家简介</view>
        <view class="info_tips">{{ info.author_desc }}</view>
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
        <view class="info_tips">{{ config.quanyi }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">购买须知</view>
        <view class="info_tips">{{ config.goumai }}</view>
      </view>
    </view>
    <view>
      <view class="f_blank"></view>
      <view class="fix_buy_btn_combo" v-if="info.sold_out == 1">
        <view class="buy_btn_combo flex_center disable">已售罄</view>
      </view>
      <view class="fix_buy_btn_combo" v-else>
        <view class="buy_btn_combo flex_center"  @tap="combin">立即合成</view>
      </view>
    </view>

    <!-- <view class="share_icon flex_center" @tap="showPoster">
      <image
        class="share_img"
        src="../../assets/img/share_top.svg"
        mode="widthFix"
      />
    </view> -->
    <view class="poster_box" v-if="show_poster">
      <Poster :title="info.title" :cover="info.cover" :ewm="ewm" />
      <image
        src="../../assets/img/close.svg"
        class="close_icon"
        mode="widthFix"
        @tap="hidePoster"
      />
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./combo.less";

import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import Poster from "../../components/poster";
import { isBeta } from "../../utils/util";
export default {
  components: {
    Poster
  },
  data() {
    return {
      id: 0,
      info: {},
      env: process.env.TARO_ENV,
      token: getToken(),
      sta_3d: false,
      ewm: "",
      config: {},
      show_poster: false,
      isBeta: isBeta(),
      need_nfts: [],
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getData();
    this.getConfig();
    this.getNeed();
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
    
    goBack() {
      Taro.navigateTo({
        url: "/pages/index/index",
      });
    },
    combin(){
      Taro.showModal({
        title: '提示',
        content: '点击合成后您所拥有的材料将被销毁，确定要合成吗？',
        success: (res) => {
          if (res.confirm) {
            this.combinNft();
          }
        }
      })
    },
    combinNft(){
      Taro.showLoading({
        title: '合成中',
        mask: true
      });
      Taro.request({
        url: serverUrl + "/userapi/combinnft",
        data: {
          id: this.id,
          token: this.token
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: res.data.errmsg,
            icon: 'success',
            duration: 2000
          });
        }else{
          Taro.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
        Taro.hideLoading()
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
        "https://api.qrserver.com/v1/create-qr-code/?data=" +
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
    getData() {
      Taro.request({
        url: serverUrl + "/api/getinfo",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
        }
      });
    },
    getNeed(){
      Taro.request({
        url: serverUrl + "/api/getneedlist",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.need_nfts = res.data.data;
        }
      });
    }
  },
};
</script>
