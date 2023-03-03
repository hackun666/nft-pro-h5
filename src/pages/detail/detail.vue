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



      <view class="info_tips_box card" v-if="info.artist">
        <view class="info_title">艺术家简介</view>
        <view class="info_tips">{{ info.artist.desc }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">藏品介绍</view>
        <view class="info_tips">{{ info.long_desc }}</view>
        <view class="content">
          <image :src="info.content_src" mode="widthFix" class="content_src" />
        </view>
      </view>



      <view class="info_tips_box card">
        <view class="info_title">区块链认证信息</view>
        <view class="chain_info2 ">
          <view class="chain_row">
            <view class="chain_label">认证网络</view>
            <view class="chain_val flex_start">
              <text class="hash el">BSN文昌链</text>
            </view>
          </view>
          <view class="chain_row">
            <view class="chain_label">合约地址</view>
            <view class="chain_val flex_start">
              <text class="hash el">{{ info.class_id }}</text>
            </view>
          </view>
          <view class="chain_row">
            <view class="chain_label">交易哈希</view>
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
        <view class="info_title">权益须知</view>
        <view class="info_tips">{{ config.quanyi }}</view>
      </view>
      <view class="info_tips_box card">
        <view class="info_title">购买须知</view>
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
          <view class="buy_btn flex_center disable">已售罄</view>
        </view>
        <view class="fix_buy_innder" v-else>
          <view class="price_area price_font">
            &yen; <text class="bigg">{{ info.price }}</text>
          </view>
          <view
            class="buy_btn flex_center roll"
            v-if="djs > 0 && info.prize_sta == 1 && info.roll_sta == 0"
            @tap="roll"
            >{{ roll_sta ? "已参与抽签" : "参与抽签" }}</view
          >
          <view
            class="buy_btn flex_center roll"
            v-if="info.roll_sta == 1 && winner_sta"
            >您已中签</view
          >
          <view class="buy_btn flex_center djs_time" v-if="djs > 0">
            <view>开售倒计时</view>
            <view>{{ djs_str }}</view>
          </view>
          <view class="buy_btn flex_center" v-else @tap="buy">立即抢购</view>
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
      <view class="btnbuy" @tap="multibuy"> 立即抢购 </view>
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
            title: "成功参与抽签",
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
    multibuy() {
      if (isLogined()) {
        if(this.buynum > this.buy_num_max) {
          Taro.showToast({
            title: "最多只能购买" + this.buy_num_max + "件",
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
            title: "最多只能购买" + this.buy_num_max + "件",
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
        this.djs_str = nD + "天" + nH + "小时" + nM + "分" + nS + "秒";
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
