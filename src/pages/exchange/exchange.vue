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
            ><text class="xl">้้</text
            ><view class="val">{{ info.total_num }}ไปฝ</view></view
          >
          <view class="tag_label flex_center" v-if="info.tag_a"
            ><text class="val">{{ info.tag_a }}</text></view
          >
          <view class="tag_label flex_center" v-if="info.tag_b"
            ><text class="val">{{ info.tag_b }}</text></view
          >
          <view class="sold">ๅฉไฝ{{ info.num }}ไปฝ</view>
        </view>
        <view class="nft_author" v-if="info.artist">
          <image
            :src="info.artist.face"
            class="author_face"
            mode="aspectFill"
          />
          <view class="author_info">
            <view>ๅไฝ่</view>
            <view class="author_name">{{ info.artist.name }}</view>
          </view>
        </view>
      </view>
      <view class="combo_rules2 card">
        <view class="info_title">ๅๆขๆนๅผ</view>
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
                >ๆฏๆถ่{{ item.need_num }}ไปฝ ๅฏๅๆข{{ item.get_num }}ไปฝ</view
              >
              <view class="need_nft_num2 has_num"
                >ๅฝๅๆๆๆฐ้ {{ item.has_num }}ไปฝ</view
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
              <view class="need_nft_tit2 el">ๅๆฅๅๅฑ</view>
              <view class="need_nft_num2"
                >ๆฏๆถ่{{ info.thx_num }}ไปฝ ๅฏๅๆข1ไปฝ</view
              >
              <view class="need_nft_num2 has_num"
                >ๅฝๅๆๆๆฐ้ {{ has_thx_num }}ไปฝ</view
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
        <view class="info_title">ๅบๅ้พไฟกๆฏ</view>
        <view class="chain_row">
          <view class="chain_label">ๅบๅ้พๅฐๅ</view>
          <view class="chain_val flex_start">
            <text class="hash" @tap="copyTxt(info.class_id)">{{
              info.class_id
            }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">ไบคๆๅๅธ</view>
          <view class="chain_val flex_start">
            <text class="hash" @tap="copyTxt(info.tx_hash)">{{
              info.tx_hash
            }}</text>
          </view>
        </view>
      </view>

      <view class="info_tips_box card" v-if="info.author_desc">
        <view class="info_title">่บๆฏๅฎถ็ฎไป</view>
        <view class="info_tips">{{ info.author_desc }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">่ๅไป็ป</view>
        <view class="info_tips">{{ info.long_desc }}</view>
        <view class="content">
          <image :src="info.content_src" mode="widthFix" class="content_src" />
        </view>
        <view class="author_box">
          <view class="flex_between" v-if="info.artist">
            <text>ๅไฝ่</text>
            <text>{{ info.artist.name }}</text>
          </view>
          <view class="flex_between" v-if="info.producer">
            <text>ๅ่กๆน</text>
            <text>{{ info.producer.name }}</text>
          </view>
        </view>
      </view>

      <view class="info_tips_box card">
        <view class="info_title">ๆ็้กป็ฅ</view>
        <view class="info_tips">{{ config.quanyi }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">่ดญไนฐ้กป็ฅ</view>
        <view class="info_tips">{{ config.goumai }}</view>
      </view>
    </view>

    <view class="f_blank"></view>
    <view class="fix_buy_btn">
      <view class="fix_buy_btn_combo" v-if="info.sold_out == 1">
        <view class="buy_btn_combo flex_center disable">ๅทฒๅฎ็ฝ</view>
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
        <view class="buy_btn flex_center" @tap="exchange">็ซๅณๅๆข</view>
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
          title: "่ฏฅ่ๅๆชๆๆ",
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
          title: "้ๆฉ่ฆๅๆข็ๆนๅผ",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.num < 1) {
        Taro.showToast({
          title: "่ณๅฐๅๆข1ไปถ",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.num > this.max_num) {
        Taro.showToast({
          title: "ๅๆขๆฐ้่ถ่ฟๆๆๆฐ้",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.num > 1000) {
        Taro.showToast({
          title: "ๅๆฌกๆๅคงๅๆข1000ไปถ",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      Taro.showModal({
        title: "ๆ็คบ",
        content: "็นๅปๅๆขๅๆจๆๆฅๆ็ๆๆๅฐ่ขซ้ๆฏ๏ผ็กฎๅฎ่ฆๅๆขๅ๏ผ",
        success: (res) => {
          if (res.confirm) {
            this.exchangeNft();
          }
        },
      });
    },
    exchangeNft() {
      Taro.showLoading({
        title: "ๅๆขไธญ",
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
        title: "ๅ?่ฝฝไธญ",
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
        current: "", // ๅฝๅๆพ็คบๅพ็็http้พๆฅ
        urls: [img_src], // ้่ฆ้ข่ง็ๅพ็http้พๆฅๅ่กจ
      });
    },
    copyTxt(txt) {
      Taro.setClipboardData({
        data: txt,
        success: function (res) {
          Taro.showToast({
            title: "ๅคๅถๆๅ",
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