<template>
  <view class="main">
    <Navbar title="收款设置" />
    <view class="info_box2">
      <view class="pay_form">
        <view class="pay_row">
          <view class="pay_row_label">支付宝帐号</view>
          <view class="pay_row_val">
            <input
              class="pay_row_ipt"
              v-model="alipay_id"
              placeholder="请输入支付宝账号"
            />
          </view>
        </view>
        <view class="pay_row">
          <view class="pay_row_label">微信号</view>
          <view class="pay_row_val">
            <input
              class="pay_row_ipt"
              v-model="wechat_id"
              placeholder="请输入微信号"
            />
          </view>
        </view>
        <view class="pay_row">
          <view class="pay_row_label">收款姓名</view>
          <view class="pay_row_val">
            <input
              class="pay_row_ipt"
              v-model="real_name"
              placeholder="请输入收款姓名"
            />
          </view>
        </view>
        <view class="pay_row">
          <view class="pay_row_label">开户银行</view>
          <view class="pay_row_val">
            <input
              class="pay_row_ipt"
              v-model="bank_name"
              placeholder="请输入开户银行"
            />
          </view>
        </view>
        <view class="pay_row">
          <view class="pay_row_label">银行卡号</view>
          <view class="pay_row_val">
            <input
              class="pay_row_ipt"
              v-model="bank_no"
              placeholder="请输入银行卡号"
            />
          </view>
        </view>
        <p class="red_tips">*温馨提示：需要同时提交三个收款信息</p>
        <view class="save_btn flex_center" @tap="savePayConfig">保存</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./payconfig.less";
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
      alipay_id: "",
      wechat_id: "",
      real_name: "",
      bank_name: "",
      bank_no: "",
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getpayconfig();
  },
  methods: {
    getpayconfig() {
      Taro.request({
        url: serverUrl + "/userapi/getpayconfig",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          if (res.data.pay_config) {
            this.alipay_id = res.data.pay_config.alipay_id;
            this.wechat_id = res.data.pay_config.wechat_id;
            this.real_name = res.data.pay_config.real_name;
            this.bank_name = res.data.pay_config.bank_name;
            this.bank_no = res.data.pay_config.bank_no;
          }
        }
      });
    },
    savePayConfig() {
      if(this.alipay_id.length < 1 || this.wechat_id.length < 1 || this.real_name.length < 1 || this.bank_name.length < 1 || this.bank_no.length < 1) {
        Taro.showToast({
          title: "请先完善收款信息",
          icon: "none",
          duration: 2000
        })
        return
      }
      Taro.request({
        url: serverUrl + "/userapi/savepayconfig",
        data: {
          token: this.token,
          alipay_id: this.alipay_id,
          wechat_id: this.wechat_id,
          real_name: this.real_name,
          bank_name: this.bank_name,
          bank_no: this.bank_no,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "保存成功",
            icon: "success",
          });
          this.getpayconfig();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
          return;
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
