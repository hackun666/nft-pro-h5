<template>
  <view class="main">
    <Navbar title="我的账户" />
    <view class="log_btn" @tap="showLog">出售记录</view>
    <view class="info_box">
      <view class="account">
        <view class="ttit">我的余额（元）</view>
        <view class="cash_num">{{ user.cash }}</view>
        <view class="tx_box flex_center">
          <view class="tx_btn flex_center" @tap="charge_box = true"
            >余额充值</view
          >
          <view class="tx_btn flex_center" @tap="tx_box = true">申请提现</view>
        </view>
      </view>
      <view class="tx_list" v-if="list.length > 0">
        <view class="tx_list_item">
          <text class="t1">提现时间</text>
          <text class="t2">金额</text>
          <text class="t3">状态</text>
        </view>
        <view class="tx_list_item" v-for="item in list" :key="item.id">
          <text class="t1">{{ formatDate(item.addtime) }}</text>
          <text class="t2">{{ item.cash }}</text>
          <text class="t3">{{ item.status == 1 ? "已审核" : "待审核" }}</text>
        </view>
      </view>
      <view class="no_result" v-else>
        <image
          src="../../assets/img/no_result.svg"
          mode="widthFix"
          class="no_result_img"
        />
        <view class="no_result_text">暂无提现记录</view>
      </view>
    </view>

    <view class="mask" v-if="charge_box" @tap="charge_box = false"></view>
    <view class="tx_form" v-if="charge_box">
      <view class="info_title">选择充值方式</view>
      <view class="pay_choose">
        <!-- <view class="pay_row" @tap="choosePay(1)">
          <image
            class="pay_ico"
            src="../../assets/img/wechat.svg"
            mode="widthFix"
          />
          <text>微信</text>
          <image
            class="chk_ico"
            v-if="pay_type == 1"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view> -->
        <view class="pay_row" @tap="choosePay(2)">
          <image
            class="pay_ico"
            src="../../assets/img/alipay.svg"
            mode="widthFix"
          />
          <text>支付宝</text>
          <image
            class="chk_ico"
            v-if="pay_type == 2"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view>
        <view class="pay_row" @tap="choosePay(3)">
          <image
            class="pay_ico"
            src="../../assets/img/shande.svg"
            mode="widthFix"
          />
          <text>汇元钱包支付</text>
          <image
            class="chk_ico"
            v-if="pay_type == 3"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view>
      </view>
      <view class="info_title">填写充值金额</view>
      <view class="tx_input_box">
        <text class="tx_unit">&yen;</text>
        <input
          class="tx_input"
          v-model="cash"
          type="text"
          placeholder="最低充值金额为10.00元"
        />
      </view>
      <view class="tx_big_btn flex_center" @tap="recharge">立即充值</view>
    </view>

    <view class="mask" v-if="tx_box" @tap="tx_box = false"></view>
    <view class="tx_form" v-if="tx_box">
      <view class="info_title">选择提现方式</view>
      <view class="pay_choose">
        <view class="pay_row" @tap="choosePay(1)">
          <image
            class="pay_ico"
            src="../../assets/img/wechat.svg"
            mode="widthFix"
          />
          <text>微信</text>
          <image
            class="chk_ico"
            v-if="pay_type == 1"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view>
        <view class="pay_row" @tap="choosePay(2)">
          <image
            class="pay_ico"
            src="../../assets/img/alipay.svg"
            mode="widthFix"
          />
          <text>支付宝</text>
          <image
            class="chk_ico"
            v-if="pay_type == 2"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view>
        <view class="pay_row" @tap="choosePay(3)">
          <image
            class="pay_ico"
            src="../../assets/img/bank.svg"
            mode="widthFix"
          />
          <text>银行卡</text>
          <image
            class="chk_ico"
            v-if="pay_type == 3"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view>
      </view>
      <view class="info_title">填写提现金额</view>
      <view class="tx_input_box">
        <text class="tx_unit">&yen;</text>
        <input
          class="tx_input"
          v-model="cash"
          type="text"
          placeholder="最低提现金额为50.00元"
        />
        <text class="tx_all" @tap="tx_all">全部提现</text>
      </view>
      <view class="tx_big_btn flex_center" @tap="savetx">立即提现</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./balance.less";
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
      list: [],
      pay_type: 3,
      tx_box: false,
      cash: "",
      charge_box: false,
      btn_sta: true,
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
    this.getData();
  },
  methods: {
    showLog(){
      console.log(1)
      Taro.navigateTo({
        url: "/pages/tradelog/tradelog",
      });
    },
    recharge() {
      if (this.cash < 10) {
        Taro.showToast({
          title: "充值金额不能小于10元",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.btn_sta) {
        this.btn_sta = false;
        if(this.pay_type == 2){
          window.location.href =
          serverUrl +
          "/userapi/recharge?token=" +
          this.token +
          "&cash=" +
          this.cash +
          "&pay_type=" +
          this.pay_type;
        }else if(this.pay_type == 3){

          if (this.user.user_uid == 0) {
            Taro.showToast({
              title: "请先开通钱包账户",
              icon: "none",
            });
            setTimeout(() => {
              this.goHee();
            }, 1000);
            return;
          }


          Taro.request({
            url: serverUrl + "/userapi/recharge",
            data: {
              token: this.token,
              cash: this.cash,
              pay_type: this.pay_type,
            },
          }).then((res) => {
            if (res.data.errcode == 0) {

              Taro.request({
                url: serverUrl + "/heepay/applypay",
                data: {
                  oid: res.data.order_id,
                },
              }).then((res) => {
                if (res.data.result_code == "SUCCESS") {
                  window.location.href = res.data.redirect_url;
                  return;
                } else {
                  Taro.showToast({
                    title: res.data.return_msg,
                    icon: "none",
                  });
                  return;
                }
              });
            }
          });
        }

      }else{
        Taro.showToast({
          title: "支付处理中，请刷新页面重试",
          icon: "none",
          duration: 2000,
        });
      }
    },
    savetx() {
      if (this.user.cash >= 50) {
        if (this.cash < 50) {
          Taro.showToast({
            title: "提现金额不能小于50元",
            icon: "none",
            duration: 2000,
          });
          return;
        }
        Taro.request({
          url: serverUrl + "/userapi/tixian",
          data: {
            token: this.token,
            cash: this.cash,
            pay_type: this.pay_type,
          },
        }).then((res) => {
          if (res.data.errcode == 0) {
            Taro.showToast({
              title: "提现申请成功",
              icon: "none",
              duration: 2000,
            });
            this.tx_box = false;
            this.getData();
          } else {
            Taro.showToast({
              title: res.data.errmsg,
              icon: "none",
              duration: 2000,
            });
            if (res.data.errcode == 40001) {
              setTimeout(() => {
                Taro.navigateTo({
                  url: "/pages/payconfig/payconfig",
                });
              }, 1000);
            }
          }
        });
      } else {
        Taro.showToast({
          title: "账户金额不足1元无法提现",
          icon: "none",
          duration: 2000,
        });
      }
    },
    tx_all() {
      if (this.user.cash >= 50) {
        this.cash = this.user.cash;
      } else {
        Taro.showToast({
          title: "提现金额不足50元",
          icon: "none",
          duration: 2000,
        });
      }
    },
    choosePay(type) {
      this.pay_type = type;
    },
    getData() {
      Taro.request({
        url: serverUrl + "/userapi/txlog",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.list = res.data.data;
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
      return y + "-" + m + "-" + d + " " + h + ":" + minute;
    },
  },
};
</script>
