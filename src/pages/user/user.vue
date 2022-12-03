<template>
  <view class="main">
    <view class="user_top">
      <image
        src="../../assets/img/setting.svg"
        class="sys_icon"
        mode="aspectFit"
        @tap="goPage('/pages/setting/setting')"
      />

      <view class="user_info">
        <view class="face_box">
          <image
            :src="
              user.avatar ? user.avatar : require('../../assets/img/avatar.png')
            "
            class="face"
            mode="aspectFill"
          />
          <view
            class="renzheng flex_center"
            v-if="user.rz_sta == 0"
            @tap="goPage('/pages/verify/verify')"
            >未认证</view
          >
          <view v-else class="renzheng flex_center">已认证</view>
        </view>
        <view class="u_info">
          <view class="nickname">
            <view class="name">{{ user.nickname }}</view>
            <image
              src="../../assets/img/edit_info.svg"
              class="edit_info"
              mode="aspectFit"
              @tap="goPage('/pages/userinfo/userinfo')"
            />
          </view>

          <view class="address price_font" @tap="goPage('/pages/scorelog/scorelog')">我的积分：{{ user.score }}</view>
          <view class="address price_font">
            <text class="address_hash el price_font" v-if="user.address"
              >钱包地址：{{ user.address }}</text
            >
            <!-- <image
              v-if="user.address"
              @tap="copyTxt(user.address)"
              src="../../assets/img/copy.svg"
              class="copy_icon"
              mode="widthFix"
            /> -->
          </view>
        </view>
      </view>

      <view class="u_nav" v-if="!isBeta">
        <view class="u_nav_list flex_between">
          <view class="u_nav_item" @tap="goPage('/pages/orders/orders')">
            <image
              class="u_nav_ico"
              src="../../assets/img/bills.svg"
              mode="widthFix"
            />
            <text>我的订单</text>
          </view>
          <view class="u_nav_item" @tap="goPage('/pages/balance/balance')">
            <image
              class="u_nav_ico"
              src="../../assets/img/cash2.svg"
              mode="widthFix"
            />
            <text>我的账户</text>
          </view>
          <view class="u_nav_item" @tap="goHee">
            <image
              class="u_nav_ico"
              src="../../assets/img/cash.svg"
              mode="widthFix"
            />
            <text>汇元钱包</text>
          </view>
          <!-- <view class="u_nav_item" @tap="goPage('/pages/cashlog/cashlog')">
            <image
              class="u_nav_ico"
              src="../../assets/img/cashlog.svg"
              mode="widthFix"
            />
            <text>账户明细</text>
          </view> -->
          <view class="u_nav_item" @tap="goPage('/pages/combolist/combolist')">
            <image
              class="u_nav_ico"
              src="../../assets/img/combo.svg"
              mode="widthFix"
            />
            <text>合成专区</text>
          </view>
          <view class="u_nav_item" @tap="goPage('/pages/mybox/mybox')">
            <image
              class="u_nav_ico"
              src="../../assets/img/box.svg"
              mode="widthFix"
            />
            <text>盲盒</text>
          </view>
          <view class="u_nav_item" @tap="goPage('/pages/tradelog/tradelog')">
            <image
              class="u_nav_ico"
              src="../../assets/img/trans.svg"
              mode="widthFix"
            />
            <text>出售记录</text>
          </view>
          <view class="u_nav_item" @tap="goPage('/pages/poster/poster')">
            <image
              class="u_nav_ico"
              src="../../assets/img/share_ico.svg"
              mode="widthFix"
            />
            <text>邀请好友</text>
          </view>
          <view class="u_nav_item" @tap="goPage('/pages/mall/mall')">
            <image
              class="u_nav_ico"
              src="../../assets/img/phb.svg"
              mode="widthFix"
            />
            <text>积分商城</text>
          </view>
        </view>
      </view>
    </view>

    <view class="my_gallery">
      <view class="gallery_tabs">
        <view
          class="g_tab"
          @tap="changeTab(1)"
          :class="now_tab == 1 ? 'now_on' : ''"
          >我的藏品 <text class="price_font">{{ mynft_num }}</text></view
        >
        <!-- <view
          class="g_tab"
          @tap="changeTab(2)"
          :class="now_tab == 2 ? 'now_on' : ''"
          >我的盲盒</view
        > -->
      </view>
    </view>
    <view class="art_list_box" v-if="now_tab == 1">
      <view class="art_list" v-if="nft_list.length > 0">
        <view
          class="nft_item"
          v-for="item in nft_list"
          :key="item.id"
          @tap="goSameNft(item.id)"
        >
          <view class="nft_cover">
            <image :src="item.uri" mode="widthFix" class="nft_cover_img" />
          </view>
          <view class="nft_info">
            <view class="nft_tit el">{{ item.name }}</view>
            <view class="nft_no">持有数量：×{{ item.num }} </view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_data.png"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无记录</view>
      </view>
    </view>
    <view class="art_list_box" v-if="now_tab == 2">
      <view class="art_list" v-if="box_list.length > 0">
        <view class="nft_item" v-for="item in box_list" :key="item.id">
          <view class="nft_cover">
            <image :src="item.cover" mode="widthFix" class="nft_cover_img" />
          </view>
          <view class="nft_info">
            <view class="nft_tit el">{{ item.name }}</view>
            <view class="nft_no">持有数量：×{{ item.num }} </view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_data.png"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无记录</view>
      </view>
    </view>
    <Chain />
    <footerBar />
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import footerBar from "../../components/footer";
import "./user.less";
import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import Chain from "../../components/chain";
import { isBeta } from "../../utils/util";

export default {
  components: {
    footerBar,
    Chain,
  },
  data() {
    return {
      usermobile: "",
      amount: "",
      user: {},
      sh_sta: false,
      token: getToken(),
      env: process.env.TARO_ENV,
      isBeta: isBeta(),
      config: {},
      now_tab: 1,
      nft_list: [],
      box_list: [],
      mynft_num: 0,
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getConfig();
    this.getMyNft();
  },
  methods: {
    changeTab(tab) {
      this.now_tab = tab;
    },
    goHee(){
      Taro.request({
        url: serverUrl + "/heepay/open",
        data: {
          uid: this.user.uid,
        },
      }).then((res) => {
        if (res.data.result_code == 'SUCCESS') {
          window.location.href = res.data.redirect_url;
        }
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
    goSameNft(id) {
      Taro.navigateTo({
        url: "/pages/samenft/samenft?id=" + id,
      });
    },
    getMyNft() {
      Taro.request({
        url: serverUrl + "/userapi/getmynft",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.nft_list = res.data.nft_list;
          this.box_list = res.data.box_list;
          this.mynft_num = res.data.mynft_num;
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
          if (this.user.address == "" || this.user.address == null) {
            setTimeout(() => {
              Taro.navigateTo({
                url: "/pages/chaincreate/chaincreate",
              });
            }, 1000);
          }
        }
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
    goPage(page) {
      Taro.navigateTo({
        url: page,
      });
    },
    callKF() {
      Taro.makePhoneCall({
        phoneNumber: this.config.tel,
      });
    },
  },
};
</script>
