<template>
  <view class="main">
    <Navbar title="支付订单" />
    <view class="order_thumb">
      <image class="thumb" :src="orderInfo.cover" mode="aspectFill" />
    </view>
    <view class="info_box2">
      <view class="pay_djs">付款倒计时：{{ djs_str }}</view>
      <view class="o_card">
        <view class="order_no">订单号: {{ orderInfo.order_no }}</view>
        <view class="price">
          ¥<text class="big">{{ orderInfo.fee }}</text>
        </view>
        <view class="img_title">{{ orderInfo.title }}</view>
        <view class="tags">
          <view class="tag_item">购买数量 × {{ orderInfo.buy_num }}</view>
        </view>
      </view>
      <view class="o_card">
        <view class="info_title">选择支付方式</view>
        <view class="pay_choose">
          <view class="pay_row" @tap="choosePay(1)">
            <image
              class="pay_ico"
              src="../../assets/img/wechat.svg"
              mode="widthFix"
            />
            <text>微信支付</text>
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
          <view class="pay_row" v-if="!inWeixin" @tap="choosePay(2)">
            <image
              class="pay_ico"
              src="../../assets/img/alipay.svg"
              mode="widthFix"
            />
            <text>支付宝支付</text>
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
            <text>杉德快捷支付</text>
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

          <view class="pay_row" @tap="choosePay(4)">
            <image
              class="pay_ico"
              src="../../assets/img/llpay.svg"
              mode="widthFix"
            />
            <text>汇元支付</text>
            <image
              class="chk_ico"
              v-if="pay_type == 4"
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
      </view>
      <view class="rz_btn flex_center" @tap="pay">确定支付</view>
    </view>

    <view class="mask" v-if="hy_pay" @tap="hy_pay = false"></view>
    <view class="hy_pay" v-if="hy_pay">
      <view class="info_tit">选择银行卡</view>
      <view class="bank_list">
        <view
          class="bank_choose_item flex_start"
          v-for="item in banklist"
          :key="item.id"
          @tap="chooseBank(item.id)"
        >
          <view class="bank_data">
            <view class="bank_name el">{{ item.bank_name }}</view>
            <view class="bank_no price_font el">{{ item.bank_card_no }}</view>
          </view>
          <image
            class="chk_ico"
            v-if="bank_id == item.id"
            src="../../assets/img/chked.svg"
            mode="widthFix"
          /><image
            class="chk_ico"
            v-else
            src="../../assets/img/unchk.svg"
            mode="widthFix"
          />
        </view>
        <view class="choose_btn flex_center" @tap="hyPay">提交订单</view>
      </view>
    </view>

    <view class="mask" v-if="hy_box" @tap="hy_box = false"></view>
    <view class="sms_box" v-if="hy_box">
      <view class="info_tit">付款验证码</view>
      <view class="sms_input">
        <input
          class="price_font"
          maxlength="6"
          type="text"
          placeholder="填写支付验证码"
          v-model="hy_sms"
        />
      </view>
      <view class="smspay_btn flex_center" @tap="hyPayOk">确认支付</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./pay.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
import { isLogined, getToken } from "../../utils/tools";
import { wxPay, aliPay } from "../../utils/jsbridge";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      djs_str: "",
      pay_type: 0,
      env: process.env.TARO_ENV,
      inWeixin: this.isWeixin(),
      oid: 0,
      token: getToken(),
      is_app: false,
      orderInfo: {},
      config: null,

      djs: 0,
      runtimes: 0,
      agree_sta: false,
      hy_pay: false,
      banklist: [],
      bank_id: 0,
      hy_box: false,
      hy_sms: "",
      user: {},
    };
  },
  onLoad(options) {
    this.oid = options.oid;
  },
  beforeDestroy() {
    clearInterval(this.intval);
  },
  onShow() {
    this.checkAuth();
    this.getOrder();
    this.intval = setInterval(() => {
      this.checkOrder();
    }, 1000);
    this.getConfig();
    this.getUser();
  },
  methods: {
    pay() {
      if (this.config.pay_sta == 0) {
        Taro.showToast({
          title: "系统维护中 暂时无法支付",
          icon: "none",
        });
        return;
      }
      if (this.pay_type == 0) {
        Taro.showToast({
          title: "请选择支付方式",
          icon: "none",
        });
        return;
      }
      if (this.pay_type == 3) {
        window.location.href = serverUrl + "/api/sandpay?id=" + this.oid;
        return;
      } else if (this.pay_type == 2) {
        window.location.href = serverUrl + "/wxpay/alipaywap?oid=" + this.oid;
        return;
      } else if (this.pay_type == 4) {
        if (this.user.user_uid == 0) {
          Taro.showToast({
            title: "请先开通钱包账户",
            icon: "none",
          });
          setTimeout(() => {
            this.goHee();
          }, 1000);
          return;
        } else {
          Taro.request({
            url: serverUrl + "/heepay/applypay",
            data: {
              oid: this.oid,
            },
          }).then((res) => {
            if (res.data.result_code == "SUCCESS") {
              window.location.href = res.data.redirect_url;
              return
            } else {
              Taro.showToast({
                title: res.data.return_msg,
                icon: "none",
              });
              return;
            }
          });
        }
      } else {
        if (process.env.TARO_ENV === "h5") {
          if (this.inWeixin) {
            //在微信内部
            window.location.href = serverUrl + "/wxpay/index?oid=" + this.oid;
          } else {
            Taro.request({
              url: serverUrl + "/wxpay/mpay",
              data: {
                oid: this.oid,
              },
            }).then((res) => {
              if (res.data.errcode == 0) {
                window.location.href = res.data.mwebUrl;
              } else {
                Taro.showToast({
                  title: res.data.errmsg,
                  icon: "none",
                });
                return;
              }
            });
          }
        }
      }
    },
    goHee() {
      Taro.request({
        url: serverUrl + "/heepay/open",
        data: {
          uid: this.user.uid,
        },
      }).then((res) => {
        if (res.data.result_code == "SUCCESS") {
          window.location.href = res.data.redirect_url;
        }
      });
    },
    // chooseBank(bank_id){
    //   this.bank_id = bank_id
    // },
    // hyPayOk(){
    //   if(this.hy_sms.length < 1){
    //     Taro.showToast({
    //       title: "请填写支付验证码",
    //       icon: "none",
    //     });
    //     return
    //   }
    //   Taro.request({
    //     url: serverUrl + "/heepay/dopay",
    //     data: {
    //       token: this.token,
    //       oid: this.oid,
    //       sms: this.hy_sms
    //     },
    //   }).then((res) => {
    //     if (res.data.errcode == 0) {
    //     }else{
    //       Taro.showToast({
    //         title: res.data.errmsg,
    //         icon: "none",
    //       });
    //       return
    //     }
    //   });
    // },
    // hyPay(){
    //   if(this.bank_id == 0){
    //     Taro.showToast({
    //       title: "请选择付款银行卡",
    //       icon: "none",
    //     });
    //     return
    //   }
    //   Taro.request({
    //     url: serverUrl + "/heepay/webpay",
    //     data: {
    //       token: this.token,
    //       bank_id: this.bank_id,
    //       oid: this.oid,
    //     },
    //   }).then((res) => {
    //     if (res.data.errcode == 0) {
    //       this.hy_pay = false
    //       this.hy_box = true
    //     }else{
    //       Taro.showToast({
    //         title: res.data.errmsg,
    //         icon: "none",
    //       });
    //       return
    //     }
    //   });
    // },
    // getBank() {
    //   Taro.request({
    //     url: serverUrl + "/userapi/banklist",
    //     data: {
    //       token: this.token,
    //     },
    //   }).then((res) => {
    //     if (res.data.errcode == 0) {
    //       if(res.data.data.length > 0){
    //         this.banklist = res.data.data;
    //         this.hy_pay = true
    //       }else{
    //         Taro.showToast({
    //           title: "请先进行银行卡签约",
    //           icon: "none",
    //         });
    //         setTimeout(() => {
    //           Taro.navigateTo({
    //             url: "/pages/banklist/banklist",
    //           });
    //         }, 500);
    //       }
    //     }
    //   });
    // },
    agree() {
      this.agree_sta = !this.agree_sta;
    },
    showXY() {
      window.location.href = "/llpayxieyi.docx";
    },
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
        }
      });
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
    checkOrder() {
      Taro.request({
        url: serverUrl + "/userapi/checkordersta",
        data: {
          token: this.token,
          id: this.oid,
        },
      }).then((res) => {
        if (res.data.errcode == 1) {
          clearInterval(this.intval);
          Taro.redirectTo({
            url: "/pages/orders/orders",
          });
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
    choosePay(type) {
      this.pay_type = type;
    },
    checkOrder() {
      Taro.request({
        url: serverUrl + "/userapi/checkordersta",
        data: {
          token: this.token,
          id: this.oid,
        },
      }).then((res) => {
        if (res.data.errcode == 1) {
          clearInterval(this.intval);
          Taro.redirectTo({
            url: "/pages/orders/orders",
          });
        }
      });
    },
    isWeixin() {
      var ua = navigator.userAgent.toLowerCase();
      console.log(ua);
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },

    getOrder() {
      Taro.request({
        url: serverUrl + "/userapi/getorder",
        data: {
          token: this.token,
          oid: this.oid,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.orderInfo = res.data.data;
          if (res.data.data.status != 0) {
            Taro.redirectTo({
              url: "/pages/orders/orders",
            });
          } else {
            if (res.data.data.djs > 0) {
              this.djs = res.data.data.djs;
              this.countdown();
            } else {
              setTimeout(() => {
                Taro.redirectTo({
                  url: "/pages/orders/orders",
                });
              }, 500);
            }
          }
        }
      });
    },
    countdown() {
      console.log("执行倒计时");
      var nMS = this.djs * 1000 - this.runtimes * 1000;
      if (nMS >= 0) {
        var nD = Math.floor(nMS / (1000 * 60 * 60 * 24));
        var nH = Math.floor(nMS / (1000 * 60 * 60)) % 24;
        var nM = Math.floor(nMS / (1000 * 60)) % 60;
        if (nM < 10) {
          nM = "0" + nM;
        }
        var nS = Math.floor(nMS / 1000) % 60;
        if (nS < 10) {
          nS = "0" + nS;
        }
        this.djs_str = nM + "分" + nS + "秒";
        console.log(this.djs_str);
        if (nMS == 5 * 60 * 1000) {
          Taro.showToast({
            title: "付款时间仅剩五分钟！",
            icon: "none",
          });
        }
        if (nMS == 1 * 60 * 1000) {
          Taro.showToast({
            title: "付款时间仅剩最后一分钟！",
            icon: "none",
          });
        }
        this.runtimes++;
        setTimeout(() => {
          this.countdown();
        }, 1000);
      } else {
        this.getOrder();
      }
    },
  },
};
</script>
