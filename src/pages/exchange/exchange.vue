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
        <view
          class="back_img"
          :style="{
            background: 'url(' + config.logo + ') no-repeat center #0E111C',
            backgroundSize: '200px auto',
          }"
        ></view>
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
      <view class="combo_rules2 card">
        <view class="info_title">兑换方式</view>
        <view class="nft_need2">
          <view
            class="nft_need_item2"
            v-for="item in need_nfts"
            :key="item.id"
            @tap="chooseRule(item.id, item.has_num)"
          >
            <image
              :src="item.info.cover"
              class="need_nft_cover2"
              mode="aspectFill"
            />
            <view class="need_nft_info">
              <view class="need_nft_tit2 el">{{ item.info.title }}</view>
              <view class="need_nft_num2"
                >每消耗{{ item.need_num }}份 可兑换{{ item.get_num }}份</view
              >
              <view class="need_nft_num2 has_num"
                >当前持有数量 {{ item.has_num }}份</view
              >
            </view>
            <image
              class="chk_ico"
              v-if="rule_id == item.id"
              src="../../assets/img/chked.svg"
              mode="widthFix"
            /><image
              class="chk_ico"
              v-else
              src="../../assets/img/unchk.svg"
              mode="widthFix"
            />
          </view>

          <view
            class="nft_need_item2"
            v-if="info.thx_sta == 1"
            @tap="chooseRule(999, has_thx_num)"
          >
            <image
              src="https://dundunimg.oss-cn-zhangjiakou.aliyuncs.com/2022/8/21/oss0ff924a5-2fff-ce0e-fea1-e048ded6b8af.jpg"
              class="need_nft_cover2"
              mode="aspectFill"
            />
            <view class="need_nft_info">
              <view class="need_nft_tit2 el">再接再励</view>
              <view class="need_nft_num2"
                >每消耗{{ info.thx_num }}份 可兑换1份</view
              >
              <view class="need_nft_num2 has_num"
                >当前持有数量 {{ has_thx_num }}份</view
              >
            </view>
            <image
              class="chk_ico"
              v-if="rule_id == 999"
              src="../../assets/img/chked.svg"
              mode="widthFix"
            /><image
              class="chk_ico"
              v-else
              src="../../assets/img/unchk.svg"
              mode="widthFix"
            />
          </view>
        </view>
      </view>
      <view class="chain_info card">
        <view class="info_title">区块链信息</view>
        <view class="chain_row">
          <view class="chain_label">区块链地址</view>
          <view class="chain_val flex_start">
            <text class="hash" @tap="copyTxt(info.class_id)">{{
              info.class_id
            }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">交易哈希</view>
          <view class="chain_val flex_start">
            <text class="hash" @tap="copyTxt(info.tx_hash)">{{
              info.tx_hash
            }}</text>
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
          <image :src="info.content_src" mode="widthFix" class="content_src" />
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

    <view class="f_blank"></view>
    <view class="fix_buy_btn">
      <view class="fix_buy_btn_combo" v-if="info.sold_out == 1">
        <view class="buy_btn_combo flex_center disable">已售罄</view>
      </view>
      <view class="fix_buy_innder" v-else>
        <view class="counter">
          <image
            src="../../assets/img/minus.svg"
            class="counter_icon"
            mode="widthFix"
            @tap="minus"
          />
          <input v-model="num" disabled class="num_ipt" />
          <image
            src="../../assets/img/plus.svg"
            class="counter_icon"
            mode="widthFix"
            @tap="plus"
          />
        </view>
        <view class="buy_btn flex_center" @tap="exchange">立即兑换</view>
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
import "./exchange.less";

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
      token: getToken(),
      sta_3d: false,
      ewm: "",
      config: {},
      show_poster: false,
      isBeta: isBeta(),
      need_nfts: [],
      user: {},
      rule_id: 0,
      num: 1,
      max_num: 1000,
      has_thx_num: 0,
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.checkAuth();
    this.getUser();
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
    minus() {
      if (this.num > 1) {
        this.num--;
      }
    },
    plus() {
      if (this.num < this.max_num) {
        this.num++;
      }
    },
    chooseRule(id, num) {
      if (num > 0) {
        // this.max_num = num;
        // this.num = num;
        this.rule_id = id;
      } else {
        Taro.showToast({
          title: "该藏品未持有",
          icon: "none",
        });
      }
    },
    goBack() {
      Taro.navigateTo({
        url: "/pages/index/index",
      });
    },
    exchange() {
      if (this.rule_id == 0) {
        Taro.showToast({
          title: "选择要兑换的方式",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.num < 1) {
        Taro.showToast({
          title: "至少兑换1件",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.num > this.max_num) {
        Taro.showToast({
          title: "兑换数量超过持有数量",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.num > 1000) {
        Taro.showToast({
          title: "单次最大兑换1000件",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      Taro.showModal({
        title: "提示",
        content: "点击兑换后您所拥有的材料将被销毁，确定要兑换吗？",
        success: (res) => {
          if (res.confirm) {
            this.exchangeNft();
          }
        },
      });
    },
    exchangeNft() {
      Taro.showLoading({
        title: "兑换中",
        mask: true,
      });
      Taro.request({
        url: serverUrl + "/userapi/exchangenft",
        data: {
          id: this.id,
          rule_id: this.rule_id,
          num: this.num,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "success",
            duration: 2000,
          });
          this.getData()
          this.getNeed();
          this.rule_id = 0;
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
        Taro.hideLoading();
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
        url: serverUrl + "/userapi/getexchangeinfo",
        data: {
          id: this.id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
          this.has_thx_num = res.data.has_thx_num;
        }
      });
    },
    getNeed() {
      Taro.request({
        url: serverUrl + "/userapi/getneedlistex",
        data: {
          id: this.id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.need_nfts = res.data.data;
        }
      });
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
  },
};
</script>