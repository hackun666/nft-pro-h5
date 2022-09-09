<template>
  <view class="main">
    <view class="filter_top">
       <view class="search_box">
        <view class="search_innser">
        <image src="../../assets/img/s_ico.svg" class="search_ico" mode="widthFix" />
        <input
          type="text"
          class="s_ipt"
          v-model="keyword"
          placeholder="搜索商品、专辑、盲盒"
        />
        </view>
        <view class="search_btn flex_center" @tap="search">搜索</view>
      </view>
      <view class="filter_bar">
        <view class="filter_item nft_type">
          <text class="tit " @tap="showType(1)" :class="now_type == 1 ? 'now' : ''">藏品</text>
          <text class="tit" @tap="showType(2)" :class="now_type == 2 ? 'now' : ''">盲盒</text>
        </view>
        <view class="line"></view>
        <view class="filter_item" @tap="showFilter(3)">
          <text class="tit">价格排序</text>
        </view>
        <view class="line"></view>
        <view class="filter_item"  @tap="showFilter(2)">
          <text class="tit">时间排序</text>
        </view>
        <view class="line"></view>
        <view class="filter_item" @tap="showFilter(1)">
          <text class="tit">系列</text>
        </view>
      </view>

     
    </view>
    <view class="mask" v-if="show_filter > 0" @tap="hideFilter"></view>
    <view class="filter_box" v-if="show_filter > 0">
      <view class="f_list" v-if="show_filter == 1">
        <view
          class="f_row"
          v-for="item in nfts"
          :key="item.id"
          @tap="findNft(item.id)"
          :class="nft_id == item.nft_id ? 'active' : ''"
          >{{ item.title }}</view
        >
      </view>
      <view class="f_list" v-if="show_filter == 3">
        <view class="f_row" @tap="sortPrice(1)">价格由低到高</view>
        <view class="f_row" @tap="sortPrice(2)">价格由高到低</view>
      </view>
      <view class="f_list" v-if="show_filter == 2">
        <view class="f_row" @tap="sortTime(1)">最新发布</view>
        <view class="f_row" @tap="sortTime(2)">最早发布</view>
      </view>
    </view>
    <view class="info_box2">
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
              <view class="u_num"
                >{{ item.nftinfo.no }}/{{ item.total_num }}</view
              >
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
import "./market.less";
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
      good_list: [],
      page: 1,
      show_search: false,
      keyword: "",
      loading: false,
      loadAll: false,
      sort_price: 0,
      sort_time: 0,
      show_filter: 0,
      artist: [],
      producer: [],
      artist_id: 0,
      producer_id: 0,
      now_type: 1,
      nfts: [],
      nft_id: 0,
    };
  },
  onShow() {
    this.getData();
    this.getNfts();
  },
  onReachBottom() {
    this.getData();
  },
  methods: {
    showType(type){
      this.now_type = type;
      this.good_list = [];
      this.page = 1;
      this.loadAll = false;
      this.getData();
    },
    findNft(id){
      this.loading = false;
      this.loadAll = false;
      this.good_list = [];
      this.page = 1;
      this.nft_id = id;
      this.show_filter = 0;
      this.getData();
    },
    onRefresh(done) {
      this.good_list = [];
      this.page = 1;
      this.loadAll = false;
      this.getData();
    },
    findArtist(id) {
      this.loading = false;
      this.loadAll = false;
      this.good_list = [];
      this.page = 1;
      this.artist_id = id;
      this.producer_id = 0;
      this.show_filter = 0;
      this.getData();
    },
    findProducer(id) {
      this.loading = false;
      this.loadAll = false;
      this.good_list = [];
      this.page = 1;
      this.producer_id = id;
      this.artist_id = 0;
      this.show_filter = 0;
      this.getData();
    },
    getNfts() {
      Taro.request({
        url: serverUrl + "/api/nftslist",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.nfts = res.data.data;
        }
      });
    },
    getArtist() {
      Taro.request({
        url: serverUrl + "/api/artistlist",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.artist = res.data.data;
        }
      });
    },
    getProducer() {
      Taro.request({
        url: serverUrl + "/api/producerlist",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.producer = res.data.data;
        }
      });
    },
    hideFilter() {
      this.show_filter = 0;
    },
    showFilter(tab) {
      this.page = 1;
      console.log(tab);
      this.show_search = false;
      this.show_filter = tab;
    },
    sortPrice(tp) {
      this.loading = false;
      this.loadAll = false;
      this.page = 1;
      this.loadAll = false;
      this.good_list = [];
      this.sort_time = 0;
      this.sort_price = tp;
      this.show_filter = 0;
      this.getData();
    },
    sortTime(tp) {
      this.loading = false;
      this.loadAll = false;
      this.page = 1;
      this.loadAll = false;
      this.good_list = [];
      this.sort_price = 0;
      this.sort_time = tp;
      this.show_filter = 0;
      this.getData();
    },
    search() {
      if (this.keyword.length < 1) {
        Taro.showToast({
          title: "请输入搜索内容",
          icon: "none",
        });
        return;
      }
      this.page = 1;
      this.good_list = [];
      this.getData();
    },
    showSearch() {
      this.show_filter = 0;
      this.show_search = !this.show_search;
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
          url: serverUrl + "/market/market",
          data: {
            page: this.page,
            keyword: this.keyword,
            sort_price: this.sort_price,
            sort_time: this.sort_time,
            artist_id: this.artist_id,
            producer_id: this.producer_id,
            nft_type: this.now_type,
            nft_id: this.nft_id,
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
          Taro.stopPullDownRefresh();
        });
      }
    },
  },
};
</script>
