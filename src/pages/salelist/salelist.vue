<template>
  <view class="main">
    <view class="m_top">
      <!-- <view class="search_area">
        <view class="search_box">
          <input
            type="text"
            class="s_ipt"
            v-model="keyword"
            placeholder="输入要搜索的编号"
          />
          <view class="search_btn flex_center" @tap="search">搜索</view>
        </view>
      </view> -->
      <view class="filter_bar2">
        <view class="filter_item2 sz">
          <text class="tit">藏品列表</text>
        </view>

        <view class="filter_item2">
          <view class="sousuo">
            <input
              type="text"
              v-model="keyword"
              class="sou_input"
              placeholder="搜索藏品编号"
            />

            <image
              src="../../assets/img/search.svg"
              mode="aspectFill"
              class="sou_icon"
              @tap="search"
            />
          </view>
        </view>
        <view class="filter_item2" @tap="sortTime">
          <text class="tit">最新</text>
          <image
            v-if="sort_time == 2"
            src="../../assets/img/up.png"
            mode="aspectFill"
            class="sort_icon"
          />
          <image
            v-if="sort_time == 1"
            src="../../assets/img/down.png"
            mode="aspectFill"
            class="sort_icon"
          />
        </view>
        <view class="filter_item2" @tap="sortPrice">
          <text class="tit">价格</text>
          <image
            v-if="sort_price == 2"
            src="../../assets/img/up.png"
            mode="aspectFill"
            class="sort_icon"
          />
          <image
            v-if="sort_price == 1"
            src="../../assets/img/down.png"
            mode="aspectFill"
            class="sort_icon"
          />
        </view>
      </view>
    </view>

    <view class="info_box">
      <view class="good_list" v-if="good_list.length > 0">
        <view
          class="good_item"
          v-for="item in good_list"
          :key="item.id"
          @tap="goItem(item.id)"
        >
          <view class="is_lock" v-if="item.is_lock == 1">
            <image
              src="../../assets/img/is_lock.svg"
              mode="aspectFill"
              class="is_lock_img"
            />
          </view>
          <image :src="item.cover" mode="aspectFill" class="good_cover" />
          <view class="good_info">
            <view class="good_title el">{{ item.title }}</view>
            <view class="good_meta">
              <view class="u_num" v-if="item.nft_type == 1"
                >#{{ item.nftinfo.no }}/{{ item.nftinfo.max_no }}</view
              >
              <view class="u_num" v-if="item.nft_type == 2">盲盒</view>
              <view class="price"
                >&yen;<text class="big">{{ item.price }}</text></view
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
      <view class="no_more" v-if="loadAll">没有更多了</view>
    </view>
    <footerBar />
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./salelist.less";
import Navbar from "../../components/navbar";
import footerBar from "../../components/footer";
import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
    footerBar,
  },
  data() {
    return {
      user: {},
      keyword: "",
      title: "",
      loading: false,
      loadAll: false,
      sort_price: 0,
      sort_time: 1,
      good_list: [],
      page: 1,
    };
  },
  onLoad(options) {
    this.title = options.title;
  },
  onShow() {
    this.getData();
  },
  onReachBottom() {
    this.getData();
  },
  methods: {
    search() {
      // if (this.keyword.length < 1) {
      //   Taro.showToast({
      //     title: "请输入搜索内容",
      //     icon: "none",
      //   });
      //   return;
      // }
      this.page = 1;
      this.loading = false;
      this.loadAll = false;
      this.good_list = [];
      this.getData();
    },
    sortPrice() {
      this.loading = false;
      this.loadAll = false;
      this.page = 1;
      this.good_list = [];
      this.sort_time = 0;
      if (this.sort_price > 1) {
        this.sort_price = 0;
      } else {
        this.sort_price += 1;
      }
      this.getData();
    },
    sortTime() {
      this.loading = false;
      this.loadAll = false;
      this.page = 1;
      this.good_list = [];
      this.sort_price = 0;
      if (this.sort_time > 1) {
        this.sort_time = 0;
      } else {
        this.sort_time += 1;
      }
      this.getData();
    },
    goItem(id) {
      Taro.navigateTo({
        url: "/pages/item/item?id=" + id,
      });
    },
    getData() {
      if (!this.loading && !this.loadAll) {
        Taro.showLoading({
          title: "加载中",
        });
        this.loading = true;
        Taro.request({
          url: serverUrl + "/market/onsalelist",
          data: {
            keyword: this.keyword,
            sort_price: this.sort_price,
            sort_time: this.sort_time,
            title: this.title,
            page: this.page,
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
            this.loading = false;
          }
          Taro.hideLoading();
        });
      }
    },
  },
};
</script>