<template>
  <view class="main">
    <Navbar title="邀请排行榜" />
    <view class="info_box2">
      <view class="rank_list" v-if="list.length > 0">
        <view class="rank_row">
          <view class="no">排名</view>
          <view class="mobile">手机号</view>
          <view class="ref_num">拉新人数</view>
          <!-- <view class="ref_num">有效人数</view> -->
        </view>
        <view class="rank_row" v-for="(item,index) in list" :key="item.uid">
          <view class="no">{{index + 1}}</view>
          <view class="mobile">{{hidePhone(item.mobile)}}</view>
          <view class="ref_num">{{item.ref_num}}人</view>
          <!-- <view class="ref_num">{{item.real_num}}人</view> -->
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
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./rank.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
import { isLogined, getToken } from "../../utils/tools";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      user: {},
      token: getToken(),
      list: [],
      page: 1,
      loading: false,
      loadAll: false,
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getData();
  },
  onReachBottom() {
    this.getData();
  },
  methods: {
    hidePhone(mobile){
      return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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
          this.getConfig();
        }
      });
    },
    getData() {
      if (!this.loading && !this.loadAll) {
        this.loading = true;
        Taro.request({
          url: serverUrl + "/userapi/rankdata",
          data: {
            token: this.token,
            page: this.page
          },
        }).then((res) => {
            if (this.page == 1) {
              if (res.data.data.length > 0) {
                this.list = res.data.data;
                this.page++;
              }
            } else {
              if (res.data.data.length > 0) {
                this.list = [...this.list, ...res.data.data];
                this.page++;
              } else {
                this.loadAll = true;
              }
            }
           this.loading = false;
        });
      }
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
