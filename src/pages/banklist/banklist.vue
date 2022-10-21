<template>
  <view class="main">
    <Navbar title="我的银行卡" />
    <view class="info_box2">
      <view class="bank_list" v-if="banklist.length > 0">
        <view
          class="bank_item"
          v-for="item in banklist"
          :key="item.id"
        >
          <view class="bank_top">
            <view class="bank_name">{{ item.bank_name }}</view>
            <view class="bank_mobile price_font">手机号：{{ item.mobile }}</view>
          </view>
          <view class="bank_no price_font">{{ item.bank_card_no }}</view>
            <view class="bank_cert">证件号码：{{ item.cert_no }}</view>
          <!-- <view class="bank_meta">
            <view class="bank_t" @tap="unbind">解绑银行卡</view>
          </view> -->
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
    <view class="add_new_btn" @tap="addbank">绑定新银行卡</view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./banklist.less";
import Navbar from "../../components/navbar";
import { isLogined, getToken } from "../../utils/tools";
import { serverUrl } from "../../utils/config";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      cache: 0,
      user: {},
      token: getToken(),
      banklist: [],
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getBank();
  },
  mounted() {},
  methods: {
    unbind() {
      Taro.showModal({
        title: "系统提示",
        content: "您确认要解绑该银行卡吗",
        success: function (res) {
          if (res.confirm) {
          }
        },
      });
    },
    addbank() {
      // Taro.navigateTo({
      //   url: "/pages/addbank/addbank",
      // });

      Taro.request({
        url: serverUrl + "/heepay/addbank",
        data: {
          token: this.token,
          uid: this.user.uid,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          window.location.href = res.data.url
        }else{
          Taro.showToast({
            title: res.data.sub_msg,
            icon: "none",
          });
        }
      });
    },
    getBank() {
      Taro.request({
        url: serverUrl + "/userapi/banklist",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.banklist = res.data.data;
        }
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
  },
};
</script>
