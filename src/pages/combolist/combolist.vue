<template>
  <view class="main">
    <Navbar title="合成藏品" />
    <view class="info_box2">
      <view class="combo_list" v-if="combo_list.length > 0">
        <view
          class="combo_item"
          v-for="item in combo_list"
          :key="item.id"
          @tap="goCombo(item.id)"
        >
          <image :src="item.cover" mode="aspectFill" class="combo_cover"/>
          <view class="combo_info">
            <view class="combo_title">{{item.title}}</view>
            <view class="combo_meta">
              <text>限量：{{item.total_num}}份</text>
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
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./combolist.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      combo_list: [],
    };
  },
  onShow() {
    this.getData();
  },
  methods: {
    getData() {
      Taro.request({
        url: serverUrl + "/api/combolist",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.combo_list = res.data.data;
        }
      });
    },
    goCombo(id) {
      Taro.navigateTo({
        url: "/pages/combo/combo?id=" + id,
      });
    },
  },
};
</script>
