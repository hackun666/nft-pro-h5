<template>
  <view class="main">
    <Navbar title="积分商城" />

    <view class="info_box">
      <view class="good_list" v-if="good_list.length > 0">
        <view
          class="good_item"
          v-for="item in good_list"
          :key="item.id"
          @tap="goGoodItem(item.id)"
        >
          <view class="sold_out" v-if="item.num == 0" >
            <image src="../../assets/img/dui_out.png" mode="aspectFill" class="sold_out_img" />
          </view>
          <image :src="item.cover" mode="aspectFill" class="good_cover" />
          <view class="good_info">
            <view class="good_title el">{{ item.title }}</view>
            <view class="good_meta">
              <view class="u_num">共发售{{ item.total_num }}份</view>
              <view class="price"
                ><text class="big price_font">{{ item.score }}</text
                >积分</view
              >
            </view>
          </view>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_result.svg"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无商品</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./mall.less";
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
      page: 1,
      good_list: [],
      token: getToken(),
    };
  },
  onShow() {
    this.getGoods();
  },
  onReachBottom() {
    this.getGoods();
  },
  methods: {
    goGoodItem(id) {
      Taro.navigateTo({
        url: "/pages/good/good?id=" + id,
      });
    },

    getGoods() {
      if (!this.loading && !this.loadAll) {
        Taro.showLoading({
          title: "加载中",
        });
        this.loading = true;
        Taro.request({
          url: serverUrl + "/userapi/goods",
          data: {
            page: this.page,
            token: this.token,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            if (this.page == 1) {
              if (res.data.data.length > 0) {
                this.good_list = res.data.data;
                this.page++;
              }
            } else {
              if (res.data.data.length > 0) {
                this.good_list = [...this.good_list, ...res.data.data];
                this.page++;
              } else {
                this.loadAll = true;
              }
            }
          }
          Taro.hideLoading();
          this.loading = false;
        });
      }
    },
  },
};
</script>
