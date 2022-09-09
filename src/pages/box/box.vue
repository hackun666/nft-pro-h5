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
      <view class="img_meta">
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
      <image src="../../assets/img/wutai2.png" class="wutai" mode="widthFix" />
    </view>
    <view class="info_box2">
      <view class="nft_info_box card">
        <image
          src="../../assets/img/sold_out.png"
          v-if="info.sold_out == 1"
          class="sold_out"
          mode="widthFix"
        />
        <view class="nft_pirce" v-if="!isBeta"
          >&yen;
          <text class="fee">{{ info.price }}</text>
        </view>
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
          <view class="sold">剩余{{ info.total_num - info.sold }}份</view>
        </view>
      </view>

      

      <view class="info_tips_box card" v-if="info.author_desc">
        <view class="info_title">艺术家简介</view>
        <view class="info_tips">{{ info.author_desc }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">藏品介绍</view>
        <view class="content">
          <rich-text :nodes="info.content"></rich-text>
        </view>
      </view>

      <view class="info_tips_box card" v-if="!isBeta">
        <view class="info_title">权益须知</view>
        <view class="info_tips">{{ config.quanyi }}</view>
      </view>
      <view class="info_tips_box card" v-if="!isBeta">
        <view class="info_title">购买须知</view>
        <view class="info_tips">{{ config.goumai }}</view>
      </view>
    </view>
    <view v-if="!isBeta">
      <view class="f_blank"></view>
      <view class="fix_buy_btn" v-if="info.sold_out == 1">
        <view class="buy_btn flex_center disable">已售罄</view>
      </view>
      <view class="fix_buy_btn" v-else>
        <view class="buy_btn flex_center disable" v-if="djs > 0" @tap="buy"
          >{{ djs_str }}后开售</view
        >
        <view class="buy_btn flex_center" v-else @tap="buy">立即抢购</view>
      </view>
    </view>

    <view class="share_icon flex_center" @tap="showPoster">
      <image
        class="share_img"
        src="../../assets/img/share_top.svg"
        mode="widthFix"
      />
    </view>
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
import "./box.less";

import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import Poster from "../../components/poster";
import { isBeta } from "../../utils/util";
export default {
  components: {
    Poster,
  },
  data() {
    return {
      id: 0,
      info: {},
      env: process.env.TARO_ENV,
      djs: 0,
      djs_str: "",
      runtimes: 0,
      token: getToken(),
      sta_3d: false,
      ewm: "",
      config: {},
      show_poster: false,
      isBeta: isBeta(),
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
          this.config.domain + "#/pages/box/box?id=" + this.info.id
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
    buy() {
      if (isLogined()) {
        Taro.request({
          url: serverUrl + "/userapi/buybox",
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
        url: "/pages/index/index",
      });
    },
    goProfile(uid) {
      Taro.navigateTo({
        url: "/pages/profile/profile?uid=" + uid,
      });
    },
    getData() {
      Taro.request({
        url: serverUrl + "/api/getboxinfo",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
          this.djs = res.data.djs;
          if (res.data.djs > 0) {
            this.countdown();
          }
        }
      });
    },
    countdown() {
      console.log("执行倒计时");
      var nMS = this.djs * 1000 - this.runtimes * 1000;
      if (nMS >= 0) {
        var nD = Math.floor(nMS / (1000 * 60 * 60 * 24));
        var nH = Math.floor(nMS / (1000 * 60 * 60)) % 24;
        var nM = Math.floor(nMS / (1000 * 60)) % 60;
        if (nM < 10) {
          nM = "0" + nM;
        }
        var nS = Math.floor(nMS / 1000) % 60;
        if (nS < 10) {
          nS = "0" + nS;
        }
        this.djs_str = nD + "天" + nH + "时" + nM + "分" + nS + "秒";
        if (nMS == 5 * 60 * 1000) {
          Taro.showToast({
            title: "还有最后五分钟！",
            icon: "none",
          });
        }
        if (nMS == 1 * 60 * 1000) {
          Taro.showToast({
            title: "还有最后一分钟！",
            icon: "none",
          });
        }
        this.runtimes++;
        setTimeout(() => {
          this.countdown();
        }, 1000);
      } else {
        this.getData();
      }
    },
  },
};
</script>
