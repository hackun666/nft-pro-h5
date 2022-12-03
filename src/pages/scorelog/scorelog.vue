<template>
  <view class="main">
    <Navbar title="积分记录" />
    <view class="info_box2">
      <view class="refer_list" v-if="list.length > 0">
        <view class="total_refer">您当前积分数：{{user.score}}人</view>
        <view
          class="refer_item"
          v-for="item in list"
          :key="item.id"
        >

          <view class="refer_item_meta">
            <text>积分数：{{item.type == 1 ? '增加' : '减少'}} {{ item.score }} 分</text>
          </view>
          <view class="refer_item_meta">
            <text>积分变动时间：{{ formatDate(item.addtime) }}</text>
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
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./scorelog.less";
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
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getData();
  },
  methods: {
    phb(){
      console.log(1)
      Taro.navigateTo({
        url: "/pages/rank/rank",
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
          // this.getConfig();
        }
      });
    },
    getData() {
      Taro.request({
        url: serverUrl + "/userapi/scorelog",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.list = res.data.data;
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
