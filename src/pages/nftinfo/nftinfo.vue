<template>
  <view class="main">
    <Navbar title="藏品详情" />
    <view class="info_box2">
      <view
        class="img_show"
        v-if="nftinfo.nft_info.format == 1 || nftinfo.nft_info.format == 2"
      >
        <view class="img_con" :class="sta_3d ? 'rotate' : ''">
          <image
            class="cover_img"
            :src="nftinfo.nft_info.cover"
            mode="widthFix"
            @tap="previewImage(nftinfo.nft_info.cover)"
          />
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
        <image
          src="../../assets/img/wutai3.png"
          class="wutai"
          mode="widthFix"
        />
      </view>
      <video
        v-else-if="nftinfo.nft_info.format == 3"
        :poster="nftinfo.nft_info.cover"
        :src="nftinfo.nft_info.asset_url"
        :controls="false"
        :autoplay="true"
        :loop="true"
        initial-time="0"
        class="mp4_cover"
      ></video>
      <view class="chain_info card">
        <view class="info_title">藏品介绍</view>
        <view class="chain_row">
          <view class="chain_label">藏品编号</view>
          <view class="chain_val flex_start">
            <text class="hash el"
              ># {{ nftinfo.no }} / {{ nftinfo.max_no }}</text
            >
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品名称</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ nftinfo.name }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品持有者</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ user.nickname }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">持有者地址</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{
              nftinfo.owner
            }}</text>
          </view>
        </view>
        <view v-if="nftinfo.chain_sta == 2">
          <view class="chain_row">
            <view class="chain_label">藏品地址</view>
            <view class="chain_val flex_start">
              <text class="hash el">{{ nftinfo.nft_id }}</text>
            </view>
          </view>
          <view class="chain_row">
            <view class="chain_label">交易哈希</view>
            <view class="chain_val flex_start">
              <text class="hash el">{{
                nftinfo.tx_hash
              }}</text>
            </view>
          </view>
          <view class="chain_row">
            <view class="chain_label">最后更新时间</view>
            <view class="chain_val flex_start">
              <text class="hash el">{{ formatDate(nftinfo.update_time) }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">藏品介绍</view>
        <view class="info_tips">{{ nftinfo.nft_info.long_desc }}</view>
        <view class="content">
          <image
            :src="nftinfo.nft_info.content_src"
            mode="widthFix"
            class="content_src"
          />
        </view>
      </view>
    </view>
    <view class="op_blank"></view>
    <view class="op_bars">
      <view class="op_item" @tap="download">
        <image
          src="../../assets/img/download.svg"
          mode="widthFix"
          class="op_item_img"
        />
        <view>保存</view>
      </view>
      <view
        class="op_item"
        v-if="config.trans_sta == 1 && market.onsale == 0"
        @tap="goPage('/pages/send/send?id=' + id + '&class_id=' + class_id)"
      >
        <image
          src="../../assets/img/send.svg"
          mode="widthFix"
          class="op_item_img"
        />
        <view>转赠</view>
      </view>
      <view
        class="op_item"
        v-if="(config.market_sta == 1 && market.onsale == 0) || user.uid == 63949"
        @tap="sell"
      >
        <image
          src="../../assets/img/sale.svg"
          mode="widthFix"
          class="op_item_img"
        />
        <view>寄售</view>
      </view>
      <view class="op_item" v-if="market.onsale == 1" @tap="xiajia">
        <image
          src="../../assets/img/sale.svg"
          mode="widthFix"
          class="op_item_img"
        />
        <view>下架</view>
      </view>
      <view class="op_item" v-if="nftinfo.nft_info.score_sta == 1" @tap="duihuan">
        <image
          src="../../assets/img/jf.svg"
          mode="widthFix"
          class="op_item_img"
        />
        <view>兑换积分</view>
      </view>
    </view>
    <view class="poster_box" v-if="show_poster">
      <Poster :title="info.name" :cover="info.uri" :ewm="ewm" />
      <image
        src="../../assets/img/close.svg"
        class="close_icon"
        mode="widthFix"
        @tap="show_poster = false"
      />
    </view>

    <view class="mask" v-if="sell_box" @tap="hideSell"></view>
    <view class="sell_box" v-if="sell_box">
      <view class="title">寄售藏品</view>
      <view class="sell_price">
        <text>售卖价格</text>
        <input
          type="text"
          class="sell_price_ipt"
          placeholder="填写售卖价格"
          v-model="price"
        />
      </view>
      <view class="sell_price">
        <text>安全密码</text>
        <input
          type="password"
          class="sell_price_ipt"
          placeholder="填写账户安全密码"
          v-model="password"
        />
      </view>
      <view class="sell_btn flex_center" @tap="upSell">立即上架</view>
      <view class="fee_tips">
        <view>平台服务费：{{ nftinfo.nft_info.sxf }}%</view>
        <view>版权费：{{ nftinfo.nft_info.copy_fee }}%</view>
      </view>
    </view>




  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./nftinfo.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
import Poster from "../../components/poster";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
    Poster,
  },
  data() {
    return {
      id: "",
      order: {},
      user: {},
      info: {},
      chain: {},
      token: getToken(),
      show_poster: false,
      nftinfo: {},
      config: {},
      ewm: "",
      price: "",
      sell_box: false,
      class_id: "",
      sta_3d: false,
      market: {
        onsale: 0,
      },
      password: "",
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  onShow() {
    this.checkAuth();
    this.getNftInfo();
    this.getUser();
    this.getConfig();
    this.getMarketInfo();
  },
  methods: {
    duihuan() {
      Taro.showModal({
        title: "提示",
        content: "确定将该藏品兑换成积分吗？",
        success: (res) => {
          if (res.confirm) {
            this.duihuanNft();
          }
        },
      });
    },
    duihuanNft() {
      Taro.request({
        url: serverUrl + "/userapi/scoretrans",
        data: {
          token: this.token,
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "兑换成功",
            icon: "success",
          });
          setTimeout(() => {
            Taro.navigateTo({
              url: "/pages/user/user",
            });
          }, 1000);

        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      });
    },
    xiajia() {
      Taro.showModal({
        title: "提示",
        content: "确定下架该藏品？",
        success: (res) => {
          if (res.confirm) {
            this.xiajiaNft();
          }
        },
      });
    },
    xiajiaNft() {
      Taro.request({
        url: serverUrl + "/userapi/xiajia",
        data: {
          token: this.token,
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "下架成功",
            icon: "success",
          });
          this.sell_box = false;
          this.getMarketInfo();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      });
    },
    upSell() {
      if (!this.price) {
        Taro.showToast({
          title: "请填写售卖价格",
          icon: "none",
        });
        return;
      }
      if (this.password.length < 6) {
        Taro.showToast({
          title: "请输入正确的安全密码",
          icon: "none",
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/userapi/sell",
        data: {
          token: this.token,
          id: this.id,
          price: this.price,
          password: this.password,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "上架成功",
            icon: "success",
          });
          this.sell_box = false;
          this.getMarketInfo();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      });
    },
    sell() {
      this.checkpass();
    },
    checkpass() {
      Taro.request({
        url: serverUrl + "/userapi/checkpass",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.sell_box = true;
        } else {
          Taro.navigateTo({
            url: "/pages/safepass/safepass",
          });
        }
      });
    },
    hideSell() {
      this.sell_box = false;
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
    download() {
      Taro.previewImage({
        current: "", // 当前显示图片的http链接
        urls: [this.nftinfo.uri], // 需要预览的图片http链接列表
      });
      Taro.showToast({
        title: "长按可保存到本地",
        icon: "none",
      });
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
    getNftInfo() {
      Taro.request({
        url: serverUrl + "/userapi/nftinfo",
        data: {
          token: this.token,
          id: this.id,
        },
      }).then((res) => {
        this.nftinfo = res.data.nftinfo;
      });
    },
    getMarketInfo() {
      Taro.request({
        url: serverUrl + "/userapi/markerinfo",
        data: {
          token: this.token,
          id: this.id,
        },
      }).then((res) => {
        if (res.data.market) {
          this.market = res.data.market;
        }
      });
    },
    goPage(page) {
      Taro.navigateTo({
        url: page,
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
