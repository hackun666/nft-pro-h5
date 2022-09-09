<template>
  <view class="main">
    <Navbar title="选择银行卡" />
    <view class="info_box2">
      <view class="addcardform" v-if="bshowadd == true">
        <view class="add_titit">添加银行卡信息</view>
        <view class="form_item"
          ><view class="label">持卡人姓名: </view>
          <view class="input"
            ><input v-model="payer_name" placeholder="请填写开户人姓名" /></view
        ></view>
        <view class="form_item"
          ><view class="label">证件号码:</view>
          <view class="input"
            ><input v-model="id_no" placeholder="请填写证件号码" /></view
        ></view>
        <view class="form_item"
          ><view class="label">银行卡号:</view>
          <view class="input"
            ><input v-model="bank_card_no" placeholder="请填写银行卡号" /></view
        ></view>
        <view class="form_item">
          <view class="label">关联手机:</view>
          <view class="input"
            ><input v-model="mobile_no" placeholder="请填写关联手机"
          /></view>
        </view>

        <view class="form_item"
          ><view class="label">验证码:</view>
          <view class="input"
            ><input v-model="sms_code" placeholder="请填写验证码"
          /></view>
          <view class="sendcodetips" @tap="sendsms" v-if="yzmbtnlock == false"
            >发送验证码</view
          >

          <view class="sendcodetips" v-if="yzmbtnlock == true"
            >发送验证码({{ leaking }}秒)</view
          >
        </view>
        <view class="bottombtn">
          <view class="directpaybtn" @tap="smsPay()">保存账户</view>
          <view class="closeadd" @tap="bshowadd = false">关闭</view>
        </view>
      </view>
    <view class="addcardbtn" v-if="bshowadd == false" @tap="bshowadd = true">
      <view>添加银行卡</view>
    </view>
    <view class="cardlist" v-if="bshowadd == false">
      <view
        class="carditem"
        v-for="(item, index) in cardlist"
        :key="index"
        @tap="selectCard(item.sign_no, index)"
      >
        <image
          class="choosed"
          src="../../assets/img/choosed.svg"
          v-if="nowindex == index"
          mode="widthFix"
        />
        <view>持卡人姓名：{{ item.payer_name }}</view>
        <view>银行卡号：{{ item.bank_card_no }}</view>
      </view>
      <view
        v-if="cardlist.length > 0"
        class="rz_btn_2 flex_center"
        @tap="goPay()"
        >点击支付</view
      >
    </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./qpcard.less";
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
      leaking: 0,
      yzmbtnlock: false,
      tiemr: null,
      qid: 0,
      payer_name: "",
      id_no: "",
      bank_card_no: "",
      mobile_no: "",
      bshowadd: false,
      sms_code: "",
      cardlist: [],
      nowindex: 0,
      pay_type: 1,
      sign_no: "",
      pay_arr: [
        {
          id: 1,
          name: "微信支付",
        },
        {
          id: 2,
          name: "支付宝支付",
        },
        {
          id: 3,
          name: "杉德支付",
        },
      ],
      env: process.env.TARO_ENV,
      oid: 0,
      token: getToken(),
      is_app: false,
      orderInfo: {},
      config: null,
    };
  },
  onLoad(options) {
    this.oid = options.oid;
    this.getOrder();

    this.getCardList();
  },
  beforeDestroy() {
    clearInterval(this.intval);
  },
  onShow() {
    console.log(this.token);
    this.checkAuth();
  },
  methods: {
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
        }
      });
    },
    sendsms() {
      if (!this.payer_name) {
        Taro.showToast({
          title: "请填写持卡人姓名",
          icon: "none",
        });
        return;
      }
      if (!this.id_no) {
        Taro.showToast({
          title: "请填写身份证号",
          icon: "none",
        });
        return;
      }
      if (!this.bank_card_no) {
        Taro.showToast({
          title: "请填写银行卡号",
          icon: "none",
        });
        return;
      }
      if (!this.mobile_no) {
        Taro.showToast({
          title: "请填写手机号",
          icon: "none",
        });
        return;
      } else {
        if (!/^1[34578]\d{9}$/.test(this.mobile_no)) {
          Taro.showToast({
            title: "请输入正确的手机号",
            icon: "none",
          });
          return;
        }
      }
      let that = this;
      Taro.request({
        url: serverUrl + "/api/getsmscode",
        data: {
          token: this.token,
          payer_name: this.payer_name,
          id_no: this.id_no,
          bank_card_no: this.bank_card_no,
          mobile_no: this.mobile_no,
          id: this.oid,
        },
      }).then((resp) => {
        if (resp.data.errcode == 0) {
          that.qid = resp.data.data.id;
          that.leaking = 60;
          that.yzmbtnlock = true;
          that.timer = setInterval(function () {
            if (that.leaking > 0) {
              that.leaking--;
            } else {
              that.leaking = 0;
              clearInterval(that.timer);
              that.yzmbtnlock = false;
              that.timer = null;
            }
          }, 1000);
        } else {
          Taro.showToast({
            title: "支付失败",
            icon: "none",
          });
        }
      });
    },
    smsPay() {
      let that = this;
      if (!this.payer_name) {
        Taro.showToast({
          title: "请填写持卡人姓名",
          icon: "none",
        });
        return;
      }
      if (!this.id_no) {
        Taro.showToast({
          title: "请填写身份证号",
          icon: "none",
        });
        return;
      }
      if (!this.bank_card_no) {
        Taro.showToast({
          title: "请填写银行卡号",
          icon: "none",
        });
        return;
      }
      if (!this.mobile_no) {
        Taro.showToast({
          title: "请填写手机号",
          icon: "none",
        });
        return;
      } else {
        if (!/^1[34578]\d{9}$/.test(this.mobile_no)) {
          Taro.showToast({
            title: "请输入正确的手机号",
            icon: "none",
          });
          return;
        }
      }
      Taro.request({
        url: serverUrl + "/api/signsms",
        data: {
          token: this.token,
          sms_code: this.sms_code,
          id: this.orderInfo.id,
          qid: this.qid,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          let sign_no = res.data.sign_no;
          that.bshowadd = false;
          that.getCardList();
          // Taro.request({
          //   url: serverUrl + "/api/quickpay",
          //   data: {
          //     token: this.token,
          //     sign_no: sign_no,
          //     id: that.orderInfo.id,
          //   },
          // }).then((resp) => {
          //   if (resp.data.errcode == 0) {
          //     Taro.navigateTo({
          //       url: "/pages/orders/orders",
          //     });
          //   } else {
          //     Taro.showToast({
          //       title: "支付失败",
          //       icon: "none",
          //     });
          //   }
          // });
        } else {
          // Taro.showToast({
          //   title: "支付失败",
          //   icon: "none",
          // });
        }
      });
    },
    goPay() {
      this.sign_no = this.cardlist[this.nowindex].sign_no;
      Taro.request({
        url: serverUrl + "/api/quickpay",
        data: {
          token: this.token,
          sign_no: this.sign_no,
          id: this.orderInfo.id,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.navigateTo({
            url: "/pages/orders/orders",
          });
        } else {
          Taro.showToast({
            title: "支付失败",
            icon: "none",
          });
        }
      });
    },
    selectCard(sign_no, index) {
      this.sign_no = sign_no;
      this.nowindex = index;
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
            //Taro.removeStorageSync("token");
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
    getCardList() {
      let that = this;
      Taro.request({
        url: serverUrl + "/userapi/getbankcardlist",
        data: {
          token: this.token,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          that.cardlist = res.data.data;
          if (that.cardlist.length == 0) {
            that.bshowadd = true;
          }
        }
      });
    },
    pay() {
      if (this.config.pay_sta == 0) {
        Taro.showToast({
          title: "系统维护中 暂时无法支付",
          icon: "none",
        });
        return;
      }

      if (this.pay_type == 3) {
        location.href = "/api/joinpay?id=" + this.oid + "&channel=2";
      } else if (this.pay_type == 4) {
      } else if (this.pay_type == 2) {
        location.href = "/api/joinpay?id=" + this.oid + "&channel=2";
        return;
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
        }
      });
    },
  },
};
</script>
