<template>
  <view class="main">
    <Navbar title="区块链信息查询" />
    <view class="search_block">
        <view class="tt">请输入交易哈希值或藏品唯一编号</view>
        <view class="search_ipt">
            <textarea rows="2" v-model="hash" class="textarea" placeholder="点击填写或粘贴内容"></textarea>
        </view>
        <view class="search_btn flex_center" @tap="searchBlock">查询</view>
    </view>

    <view class="info_box2" v-if="info">
      
      <view class="chain_info card">
        <view class="title_bar">
          <image
            class="title_bar_img"
            src="../../assets/img/bl.png"
            mode="widthFix"
          />
          <text>查询结果</text>
          <image
            class="title_bar_img"
            src="../../assets/img/br.png"
            mode="widthFix"
          />
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品名称</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ order.title }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品发行方</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ info.company }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">获得时间</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ formatDate(order.pay_time) }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">唯一编号</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ order.shard_id }}</text>
            <image
              @tap="copyTxt(order.shard_id)"
              src="../../assets/img/copy.svg"
              class="copy_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">交易哈希</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ order.hash }}</text>
            <image
              @tap="copyTxt(order.hash)"
              src="../../assets/img/copy.svg"
              class="copy_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品哈希</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ info.hash }}</text>
            <image
              @tap="copyTxt(info.hash)"
              src="../../assets/img/copy.svg"
              class="copy_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">藏品持有者</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ buyer.nickname }}</text>
          </view>
        </view>
        <view class="chain_row">
          <view class="chain_label">持有者地址</view>
          <view class="chain_val flex_start">
            <text class="hash el">{{ buyer.address }}</text>
            <image
              @tap="copyTxt(buyer.address)"
              src="../../assets/img/copy.svg"
              class="copy_icon"
              mode="widthFix"
            />
          </view>
        </view>
      </view>

      
      <view class="order_thumb">
        <image class="thumb" :src="info.cover" mode="widthFix" />
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./chain.less";
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
      info: null,
      token: getToken(),
      hash: '',
      order: {},
      buyer: {},
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
  },
  methods: {
    searchBlock(){
        if(this.hash.length < 1){
            Taro.showToast({
                title: "请填写内容",
                icon: "none",
            });
            return
        }
        Taro.request({
          url: serverUrl + "/blockchain/search",
          data: {
            hash: this.hash,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            this.info = res.data.info
            this.order = res.data.data
            this.buyer = res.data.buyer
          }else{
              Taro.showToast({
                title: res.data.errmsg,
                icon: "none",
            });
            return
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
