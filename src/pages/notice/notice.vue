<template>
  <view class="main">
    <Navbar title="系统公告" />
    <view class="info_box2">
      <view class="notice_list" v-if="list.length > 0">
        <view
          class="notice_item"
          v-for="item in list"
          :key="item.id"
          @tap="goNoticeInfo(item.id)"
        >
          <view class="notice_item_title">
            <text class="zhiding" v-if="item.zhiding == 1">置顶</text>
            <text class="n_tt el">{{ item.title }}</text>
          </view>
          <view class="notice_item_meta">
            <text>发布时间：{{ formatDate(item.addtime) }}</text>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_result.svg"
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
import "./notice.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      list: [],
    };
  },
  onShow() {
    this.getData();
  },
  methods: {
    getData() {
      Taro.request({
        url: serverUrl + "/api/notice",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.list = res.data.data;
        }
      });
    },
    goNoticeInfo(id) {
      Taro.navigateTo({
        url: "/pages/noticeinfo/noticeinfo?id=" + id,
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
