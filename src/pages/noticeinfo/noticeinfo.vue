<template>
  <view class="main">
    <Navbar title="公告详情" />
    <view class="info_box2">
      <view class="notice_title">{{info.title}}</view>
      <view class="notice_meta"><text>发布时间：{{formatDate(info.addtime)}}</text></view>
      <view class="notice_content">
        <rich-text :nodes="info.content"></rich-text>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./noticeinfo.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      id: 0,
      info: {},
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getNoticeInfo();
  },
  methods: {
    
    getNoticeInfo() {
      Taro.request({
        url: serverUrl + "/api/noticeinfo",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.info = res.data.data;
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
      return y + "-" + m + "-" + d;
    },
  },
};
</script>
