<template>
  <view class="main">
    <Navbar title="收货地址" />
    <view class="info_box">
      <view class="address_list" v-if="address_list.length > 0">
        <view class="address_item" v-for="item in address_list" :key="item.id">
          <view  @tap="chooseAddress(item.id)">
            <view class="add_top flex_start">
              <view class="add_name">{{ item.name }}</view>
              <view class="add_tel">{{ item.tel }}</view>
            </view>
            <view class="add_detail">{{ item.address }}</view>
          </view>
          <view class="address_meta flex_start">
            <view class="address_meta_item" @tap="setMoren(item.id)">
              <image
                class="chk_ico"
                v-if="item.is_default == 1"
                src="../../assets/img/chked.svg"
                mode="widthFix"
              /><image
                class="chk_ico"
                v-else
                src="../../assets/img/unchk.svg"
                mode="widthFix"
              />
              <text>默认地址</text>
            </view>
            <view class="address_meta_item" @tap="editAddress(item)">编辑</view>
            <view class="address_meta_item" @tap="deleAddress(item.id)"
              >删除</view
            >
          </view>
        </view>
      </view>

      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_address.svg"
          mode="widthFix"
          class="no_result_img"
        />
      </view>
    </view>
    <view class="f_blank"></view>
    <view class="fix_buy_btn_item">
      <view class="buy_btn_item flex_center" @tap="addAddress"
        >新增收货地址</view
      >
    </view>
    <view class="mask" v-if="address_box" @tap="address_box = false"></view>
    <view class="add_address_box" v-if="address_box">
      <view class="add_address_form">
        <view class="big_title">编辑收货地址</view>
        <view class="add_address_item">
          <view class="add_address_title">收货人姓名</view>
          <view class="add_address_input">
            <input
              type="text"
              v-model="address.name"
              placeholder="请输入收货人姓名"
            />
          </view>
        </view>
        <view class="add_address_item">
          <view class="add_address_title">收货人手机号</view>
          <view class="add_address_input">
            <input
              type="tel"
              v-model="address.tel"
              placeholder="请输入收货人手机号"
            />
          </view>
        </view>
        <view class="add_address_item">
          <view class="add_address_title">收货人详细地址</view>
          <view class="add_address_input">
            <input
              type="text"
              v-model="address.address"
              placeholder="请输入收货人详细地址"
            />
          </view>
        </view>
        <view class="save_address_btn flex_center" @tap="saveAddress"
          >保存地址</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./address.less";

import Navbar from "../../components/navbar";
import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
import Poster from "../../components/poster";
export default {
  components: {
    Poster,
    Navbar,
  },
  data() {
    return {
      good_id: 0,
      token: getToken(),
      address_list: [],
      address_box: false,
      address: {
        id: 0,
        name: "",
        tel: "",
        address: "",
      },
    };
  },
  onLoad(options) {
    this.good_id = options.good_id;
    this.getData();
    this.checkAuth();
  },
  methods: {
    setMoren(id){
      Taro.request({
        url: serverUrl + "/userapi/setmoren",
        data: {
          token: this.token,
          id: id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "设置成功",
            icon: "success",
            duration: 2000,
          });
          this.getData();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    chooseAddress(id) {
      Taro.reLaunch({
        url: "/pages/good/good?id=" + this.good_id + "&address_id=" + id,
      });
    },
    deleAddress(id) {
      Taro.showModal({
        title: "提示",
        content: "确定删除该地址吗？",
        success: (res) => {
          if (res.confirm) {
            Taro.request({
              url: serverUrl + "/userapi/deleaddress",
              data: {
                token: this.token,
                id: id,
              },
            }).then((res) => {
              if (res.data.errcode == 0) {
                Taro.showToast({
                  title: "收货地址删除成功",
                  icon: "success",
                  duration: 2000,
                });
                this.getData();
              } else {
                Taro.showToast({
                  title: res.data.errmsg,
                  icon: "none",
                  duration: 2000,
                });
              }
            });
          }
        },
      });
    },
    saveAddress() {
      if (this.address.name.length < 1) {
        Taro.showToast({
          title: "请输入收货人姓名",
          icon: "none",
        });
        return;
      }
      if (this.address.tel.length < 1) {
        Taro.showToast({
          title: "请输入收货人手机号",
          icon: "none",
        });
        return;
      }
      if (this.address.address.length < 1) {
        Taro.showToast({
          title: "请输入收货人详细地址",
          icon: "none",
        });
        return;
      }
      Taro.request({
        url: serverUrl + "/userapi/saveaddress",
        data: {
          token: this.token,
          address: this.address,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "收货地址保存成功",
            icon: "success",
            duration: 2000,
          });
          this.address_box = false;
          this.getData();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    editAddress(item) {
      this.address = item;
      this.address_box = true;
    },
    addAddress() {
      this.address = {
        id: 0,
        name: "",
        tel: "",
        address: "",
      };
      this.address_box = true;
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
    getData() {
      Taro.request({
        url: serverUrl + "/userapi/address",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.address_list = res.data.data;
        }
      });
    },
  },
};
</script>
