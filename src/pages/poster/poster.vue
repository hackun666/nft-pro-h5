<template>
  <view class="main">
    <Navbar title="邀请好友" />
    <view class="log_btn" @tap="showLog">邀请记录</view>
    <view class="info_box2">
      <view class="poster_tips">长按保存</view>
      <image :src="imgSrc" class="poster_img" mode="widthFix" />
      <view class="link_show">
        <input type="text" class="l_ipt" :value="refer_link" readonly />
        <view class="copy_btn flex_center" @tap="copyTxt">复制链接</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./poster.less";
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
      show: false,
      imgWidth: 0,
      imgHeight: 0,
      config: {},
      imgSrc: "",
      ewm: "",
      refer_link: "",
    };
  },
  onShow() {
    this.checkAuth();
    this.getUser();
  },
  methods: {
    showLog(){
      console.log(1)
      Taro.navigateTo({
        url: "/pages/referlog/referlog",
      });
    },
    copyTxt() {
      Taro.setClipboardData({
        data: this.refer_link,
        success: function (res) {
          Taro.showToast({
            title: "复制成功",
            icon: "none",
          });
        },
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
          this.getConfig();
        }
      });
    },
    getImgInfo() {
      let self = this;
      let img = new Image();
      img.src = '',//this.config.refer_img;
      console.log(img);
      img.onload = function () {
        self.imgWidth = img.width;
        self.imgHeight = img.height;
        self.drawCanvasBgImg();
      };
    },
    getWindowInfo() {
      var windowInfo = {};
      windowInfo.dpr = window.devicePixelRatio;
      if (window.innerWidth) {
        windowInfo.width = window.innerWidth;
      } else {
        windowInfo.width = document.body.clientWidth;
      }
      return windowInfo;
    },
    //拿到数据后开始画背景大图 想法很简单就是把图片画到canvas中然后在画布上再画头像文字让后转成img
    drawCanvasBgImg() {
      console.log("绘制背景");
      var vm = this;
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var clientWidth = this.getWindowInfo().width; //获取屏幕宽度用于canvas宽度自适应移动端屏幕
      var dpr = this.getWindowInfo().dpr;

      ctx.globalCompositeOperation = "source-atop"; //** 坑锯齿感觉没什么用不知道是不是用错地方了 **
      canvas.width = this.imgWidth; //dpr * clientWidth;  //由于手机屏幕时retina屏，都会多倍渲染，用dpr来动态设置画布宽高，避免图片模糊
      canvas.height = this.imgHeight; //dpr * clientWidth * 609 / 375;//去掉微信头部的状态栏应该是603 没搞懂603还是不能让图片满屏直接多加到了609
      var img = new Image();
      img.crossOrigin = ""; //死坑的图片跨域 （img.crossOrigin = "Anonymous"这种写法还是不能显示base64格式图片）
      img.src = this.config.refer_img; //背景图
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore(); // 还原状态
        vm.drawCanvasqrImg(canvas, ctx, dpr);
      };
    },
    // 绘制二维码
    drawCanvasqrImg: function (canvas, ctx, dpr) {
      console.log("绘制二维码");
      var vm = this;
      var imgX = 450; //图片X开始坐标
      var imgY = 1660; //图片Y开始坐标
      var imgWidth = 200;
      var img = new Image();
      img.crossOrigin = "";
      img.src = this.ewm;
      console.log(this.ewm);
      img.onload = function () {
        ctx.drawImage(img, imgX, imgY, imgWidth, imgWidth);
        ctx.restore(); // 还原状态
        // vm.canvasFillPin(canvas, ctx, dpr);

        
        vm.convertCanvasToImage(canvas);
      };
    },
    canvasFillPin(canvas, ctx, dpr) {
      var vm = this;
      var fontSizeThis = 60 + "px" + " Arial";
      ctx.font = fontSizeThis;
      // 需要用户名是写入用户名
      if (this.config.app_name) {
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        // var w = ctx.measureText(this.title).width;
        ctx.fillText(this.config.app_name, 50, 1720);
        ctx.restore(); // 还原状态
        vm.canvasFillTips(canvas, ctx, dpr);
      }
    },
    canvasFillTips(canvas, ctx, dpr) {
      var vm = this;
      var fontSizeThis = 40 + "px" + " Arial";
      ctx.font = fontSizeThis;
      // 需要用户名是写入用户名
      if (this.config.refer_words) {
        ctx.fillStyle = "gray";
        ctx.textAlign = "left";
        // var w = ctx.measureText(this.title).width;
        ctx.fillText(this.config.refer_words, 50, 1800);

        ctx.restore(); // 还原状态
        this.convertCanvasToImage(canvas);
      }
    },

    convertCanvasToImage(canvas) {
      Taro.hideLoading();
      this.imgSrc = canvas.toDataURL("image/jpeg"); //png有毒在安卓机下识别二维码无法跳转
    },
    getConfig() {
      Taro.request({
        url: serverUrl + "/api/baseconfig",
      }).then((res) => {
        if (res.data.errcode == 0) {
          this.config = res.data.data;
          this.ewm =
            "http://eicshop.7192.com/ewm.php?url=" +
            encodeURIComponent(
              this.config.domain +
                "/#/pages/reg/reg?ref_code=" +
                this.user.ref_code
            );
          this.refer_link =
            this.config.domain +
            "/#/pages/reg/reg?ref_code=" +
            this.user.ref_code;
          Taro.showLoading({
            title: "加载中",
          });
          setTimeout(() => {
            this.getImgInfo();
          }, 500);
        }
      });
    },
  },
};
</script>
