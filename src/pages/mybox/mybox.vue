<template>
  <view class="main">
    <Navbar title="我的盲盒" />
    <view class="info_box2">
      <view class="box_tab">
        <view
          class="box_tab_item"
          :class="now_tab == 1 ? 'on' : ''"
          @tap="switchTab(1)"
          >待拆盲盒</view
        >
        <view class="line_a"></view>
        <view
          class="box_tab_item"
          :class="now_tab == 2 ? 'on' : ''"
          @tap="switchTab(2)"
          >已拆盲盒</view
        >
      </view>
      <view class="my_box_list" v-if="list.length > 0">
        <view class="my_box_list_item" v-for="item in list" :key="item.id">
          <image
            class="my_box_item_img"
            :src="item.info.cover"
            mode="widthFix"
          />
          <view class="my_box_item_info">
            <view class="title">{{ item.info.title }}</view>
            <view class="box_btns">
              <view
                class="open_btn"
                v-if="item.open_sta == 0 && item.onsale == 0"
                @tap="openBox(item.id)"
                >拆盲盒</view
              >
              <view class="open_btn opened" v-if="item.open_sta == 1"
                >已拆开</view
              >
              <view
                class="open_btn"
                v-if="item.open_sta == 0 && item.onsale == 0 && item.info.trans_sta == 1"
                @tap="send(item.id)"
                >转赠</view
              >
              <view
                class="open_btn"
                v-if="
                  config.market_sta == 1 &&
                  item.onsale == 0 &&
                  item.open_sta == 0
                "
                @tap="sell(item.id)"
                >转售</view
              >
              <view
                class="open_btn"
                v-if="
                  config.market_sta == 1 &&
                  item.onsale == 1 &&
                  item.open_sta == 0
                "
                @tap="xiajia(item.id)"
                >下架</view
              >
            </view>
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
    <lottie-player
      v-if="show_ani"
      class="open_box_ani"
      :src="require('../../assets/json/openbox.json')"
      :options="options"
    />
    <view class="mask" v-if="sell_box" @tap="hideSell"></view>
    <view class="sell_box" v-if="sell_box">
      <view class="title">转售盲盒</view>
      <view class="sell_price">
        <text>售卖价格</text>
        <input
          type="text"
          class="sell_price_ipt"
          placeholder="填写售卖价格"
          v-model="price"
        />
      </view>
      <view class="sell_btn flex_center" @tap="upSell">立即上架</view>
    </view>
    <view class="no_more" v-if="loadAll">没有更多了</view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./mybox.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      options: {
        autoplay: true,
        loop: false,
        speed: 1,
        width: "100%",
      },
      show_ani: false,
      user: {},
      token: getToken(),
      list: [],
      config: {},
      price: "",
      sell_box: false,
      market: {
        onsale: 0,
      },
      id: 0,
      now_tab: 1,
      page: 1,
      loading: false,
      loadAll: false,
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getData();
    this.getConfig();
  },
  onReachBottom() {
    this.getData();
  },
  methods: {
    switchTab(tab) {
      this.now_tab = tab;
      this.list = [];
      this.page = 1;
      this.loading = false;
      this.loadAll = false;
      this.getData();
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
    send(id){
      Taro.navigateTo({
        url: "/pages/send/send?id=" + id+'&type=2',
      });
    },
    xiajia(id) {
      Taro.showModal({
        title: "提示",
        content: "确定下架该盲盒吗？",
        success: (res) => {
          if (res.confirm) {
            this.xiajiaNft(id);
          }
        },
      });
    },
    xiajiaNft(id) {
      Taro.request({
        url: serverUrl + "/userapi/xiajiabox",
        data: {
          token: this.token,
          id: id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "下架成功",
            icon: "success",
          });
          this.sell_box = false;
          this.getData();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      });
    },
    upSell(id) {
      if (!this.price) {
        Taro.showToast({
          title: "请填写售卖价格",
          icon: "none",
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/market/sellbox",
        data: {
          token: this.token,
          id: this.id,
          price: this.price,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "上架成功",
            icon: "success",
          });
          this.sell_box = false;
          this.getData();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      });
    },
    sell(id) {
      this.id = id;
      this.sell_box = true;
    },
    hideSell() {
      this.id = 0;
      this.sell_box = false;
    },
    openBox(id) {
      Taro.showLoading({
        title: "加载中",
        mask: true,
      });

      Taro.request({
        url: serverUrl + "/userapi/openbox",
        data: {
          id: id,
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.show_ani = true;
          setTimeout(() => {
            this.show_ani = false;
            Taro.showToast({
              title: res.data.errmsg,
              icon: "none",
              duration: 2000,
            });
            this.getData();
          }, 3000);
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
      });
      Taro.hideLoading();
    },
    goNftInfo(id) {
      Taro.navigateTo({
        url: "/pages/boxinfo/boxinfo?id=" + id,
      });
    },
    getData() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.request({
          url: serverUrl + "/userapi/mybox",
          data: {
            token: this.token,
            type: this.now_tab,
            page: this.page
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            if (this.page == 1) {
              if (res.data.data.length > 0) {
                this.list = res.data.data;
                this.page++;
              }
            } else {
              if (res.data.data.length > 0) {
                this.list = [...this.list, ...res.data.data];
                that.page++;
              } else {
                this.loadAll = true;
              }
            }
            this.loading = false;
          }
        });
      }
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
