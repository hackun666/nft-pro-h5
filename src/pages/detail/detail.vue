<template>
  <view class="main">
    <view class="back_area flex_center" @tap="goBack">
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
        <image
          src="../../assets/img/sold_out.png"
          v-if="info.sold_out == 1 || info.num == 0"
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



      <view class="info_tips_box card" v-if="info.artist">
        <view class="info_title">่บๆฏๅฎถ็ฎไป</view>
        <view class="info_tips">{{ info.artist.desc }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">่ๅไป็ป</view>
        <view class="info_tips">{{ info.long_desc }}</view>
        <view class="content">
          <image :src="info.content_src" mode="widthFix" class="content_src" />
        </view>
      </view>



      <view class="info_tips_box card">
        <view class="info_title">ๅบๅ้พ่ฎค่ฏไฟกๆฏ</view>
        <view class="chain_info2 ">
          <view class="chain_row">
            <view class="chain_label">่ฎค่ฏ็ฝ็ป</view>
            <view class="chain_val flex_start">
              <text class="hash el">BSNๆๆ้พ</text>
            </view>
          </view>
          <view class="chain_row">
            <view class="chain_label">ๅ็บฆๅฐๅ</view>
            <view class="chain_val flex_start">
              <text class="hash el">{{ info.class_id }}</text>
            </view>
          </view>
          <view class="chain_row">
            <view class="chain_label">ไบคๆๅๅธ</view>
            <view class="chain_val flex_start">
              <text class="hash el">{{ info.tx_hash }}</text>
              <!-- <image
                @tap="copyTxt(info.tx_hash)"
                src="../../assets/img/copy.svg"
                class="copy_icon"
                mode="widthFix"
              /> -->
            </view>
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
    <view v-if="load_data">
      <view class="f_blank"></view>
      <view class="fix_buy_btn">
        <view class="fix_buy_innder" v-if="info.sold_out == 1">
          <view class="price_area price_font">
            &yen;<text class="bigg">{{ info.price }}</text>
          </view>
          <view class="buy_btn flex_center disable">ๅทฒๅฎ็ฝ</view>
        </view>
        <view class="fix_buy_innder" v-else>
          <view class="price_area price_font">
            &yen; <text class="bigg">{{ info.price }}</text>
          </view>
          <view
            class="buy_btn flex_center roll"
            v-if="djs > 0 && info.prize_sta == 1 && info.roll_sta == 0"
            @tap="roll"
            >{{ roll_sta ? "ๅทฒๅไธๆฝ็ญพ" : "ๅไธๆฝ็ญพ" }}</view
          >
          <view
            class="buy_btn flex_center roll"
            v-if="info.roll_sta == 1 && winner_sta"
            >ๆจๅทฒไธญ็ญพ</view
          >
          <view class="buy_btn flex_center djs_time" v-if="djs > 0">
            <view>ๅผๅฎๅ่ฎกๆถ</view>
            <view>{{ djs_str }}</view>
          </view>
          <view class="buy_btn flex_center" v-else @tap="buy">็ซๅณๆข่ดญ</view>
        </view>
      </view>
    </view>

    <view
      class="mask"
      v-if="bshownumdialog"
      @tap="bshownumdialog = false"
    ></view>
    <view class="buynumdialog" v-if="bshownumdialog">
      <view class="num_op">
        <view class="sub" @tap="subnum()">-</view>
        <view><input v-model="buynum" /></view>
        <view class="add" @tap="addnum()">+</view>
      </view>
      <view class="btnbuy" @tap="multibuy"> ็ซๅณๆข่ดญ </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./detail.less";

import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import Navbar from "../../components/navbar";
export default {
  components: {
    Navbar
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
      buy_num_max: 1,
      buynum: 1,
      bshownumdialog: false,
      roll_sta: false,
      winner_sta: false,
      buy_sta: true,
      load_data: false,
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getData();
    this.getConfig();
  },
  onShow() {
    this.getRoll();
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
    roll() {
      if (!isLogined()) {
        Taro.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/userapi/roll",
        data: {
          id: this.id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "ๆๅๅไธๆฝ็ญพ",
            icon: "success",
          });
          this.getRoll();
        }
      });
    },
    getRoll() {
      if (isLogined()) {
        Taro.request({
          url: serverUrl + "/userapi/rolldata",
          data: {
            id: this.id,
            token: this.token,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            this.roll_sta = res.data.roll_sta;
            this.winner_sta = res.data.winner_sta;
          }
        });
      }
    },
    subnum() {
      if (this.buynum > 1) {
        this.buynum--;
      }
    },
    addnum() {
      if (this.buynum < this.buy_num_max) {
        this.buynum++;
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
    multibuy() {
      if (isLogined()) {
        if(this.buynum > this.buy_num_max) {
          Taro.showToast({
            title: "ๆๅคๅช่ฝ่ดญไนฐ" + this.buy_num_max + "ไปถ",
            icon: "none",
          });
          return;
        }
        if (this.buy_sta) {
          this.buy_sta = false;
          Taro.request({
            url: serverUrl + "/userapi/buy",
            data: {
              id: this.id,
              buy_num: this.buynum,
              token: this.token,
            },
          }).then((res) => {
            if (res.data.errcode == 0) {
              Taro.navigateTo({
                url: "/pages/pay/pay?oid=" + res.data.order_id,
              });
            } else if (res.data.errcode == 40005) {
              Taro.showToast({
                title: "ๆจ่ฟๆฒกๆ้่ฟๅฎๅ่ฎค่ฏ",
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
            }
            this.buy_sta = true;
          });
        }
      }
    },
    buy() {
      if (isLogined()) {

        if(this.buynum > this.buy_num_max) {
          Taro.showToast({
            title: "ๆๅคๅช่ฝ่ดญไนฐ" + this.buy_num_max + "ไปถ",
            icon: "none",
          });
          return;
        }
        if (this.buy_num_max == 1) {
          if (this.buy_sta) {
            this.buy_sta = false;
            Taro.request({
              url: serverUrl + "/userapi/buy",
              data: {
                id: this.id,
                buy_num: this.buynum,
                token: this.token,
              },
            }).then((res) => {
              if (res.data.errcode == 0) {
                Taro.navigateTo({
                  url: "/pages/pay/pay?oid=" + res.data.order_id,
                });
              } else if (res.data.errcode == 40005) {
                Taro.showToast({
                  title: "ๆจ่ฟๆฒกๆ้่ฟๅฎๅ่ฎค่ฏ",
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
              }
              this.buy_sta = true;
            });
          }
        } else {
          this.bshownumdialog = true;
        }
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
        url: serverUrl + "/api/getinfo",
        data: {
          id: this.id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
          this.djs = res.data.djs;
          this.buy_num_max = res.data.buy_num;
          if (res.data.djs > 0) {
            this.countdown();
          }
          this.load_data = true;
        }
      });
    },
    countdown() {
      console.log("ๆง่กๅ่ฎกๆถ");
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
        this.djs_str = nD + "ๅคฉ" + nH + "ๅฐๆถ" + nM + "ๅ" + nS + "็ง";
        if (nMS == 5 * 60 * 1000) {
          Taro.showToast({
            title: "่ฟๆๆๅไบๅ้๏ผ",
            icon: "none",
          });
        }
        if (nMS == 1 * 60 * 1000) {
          Taro.showToast({
            title: "่ฟๆๆๅไธๅ้๏ผ",
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
