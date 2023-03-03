<template>
  <view class="poster" @tap="show = false">
    <image :src="imgSrc" class="poster_img" mode="widthFix" />
  </view>
</template>

<script>
import "./poster.less";
export default {
  props: ["cover", "ewm","title"],
  data() {
    return {
      default_bg: '',
      imgSrc: "",
      show: false,
      imgSrc: "",
      imgWidth: 0,
      imgHeight: 0,
      tips: '新的数字藏品上线了 快来看看吧',
    };
  },
  mounted() {
    setTimeout(() => {
      this.getImgInfo();
    }, 1000);
  },
  methods: {
    getImgInfo() {
      let self = this;
      let img = new Image();
      img.src = this.cover;
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
      canvas.width = 800;//this.imgWidth; //dpr * clientWidth;  //由于手机屏幕时retina屏，都会多倍渲染，用dpr来动态设置画布宽高，避免图片模糊
      canvas.height = 1000;//this.imgHeight; //dpr * clientWidth * 609 / 375;//去掉微信头部的状态栏应该是603 没搞懂603还是不能让图片满屏直接多加到了609
      var img = new Image();
      img.crossOrigin = ""; //死坑的图片跨域 （img.crossOrigin = "Anonymous"这种写法还是不能显示base64格式图片）
      img.src = this.default_bg; //背景图
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        vm.drawCoverImg(canvas, ctx, dpr);
      };
    },
    drawCoverImg(canvas, ctx, dpr) {
      console.log("绘制封面");
      var vm = this;
      var imgX = 0; //图片X开始坐标
      var imgY = 0; //图片Y开始坐标
      var imgWidth = 800;
      var imgHeight = 800;
      var img = new Image();
      img.crossOrigin = ""; //死坑的图片跨域 （img.crossOrigin = "Anonymous"这种写法还是不能显示base64格式图片）
      img.src = this.cover; //背景图
      img.onload = function () {
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        ctx.restore(); // 还原状态
        vm.drawCanvasqrImg(canvas, ctx, dpr);
      };
    },
    // 绘制二维码
    drawCanvasqrImg: function (canvas, ctx, dpr) {
      console.log("绘制二维码");
      var vm = this;
      var imgX = 620; //图片X开始坐标
      var imgY = 820; //图片Y开始坐标
      var imgWidth = 160;
      var img = new Image();
      img.crossOrigin = "";
      img.src = this.ewm;
      img.onload = function () {
        ctx.drawImage(img, imgX, imgY, imgWidth, imgWidth);
        ctx.restore(); // 还原状态
        vm.canvasFillPin(canvas, ctx, dpr);
      };
    },
    canvasFillPin(canvas, ctx, dpr) {
      var vm = this;
      var fontSizeThis = 50 + "px" + " Arial";
      ctx.font = fontSizeThis;
      // 需要用户名是写入用户名
      if (this.title) {
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        // var w = ctx.measureText(this.title).width;
        ctx.fillText(this.title,20, 880);
        ctx.restore(); // 还原状态
        vm.canvasFillTips(canvas, ctx, dpr);
      }
    },
    canvasFillTips(canvas, ctx, dpr) {
      var vm = this;
      var fontSizeThis = 30 + "px" + " Arial";
      ctx.font = fontSizeThis;
      // 需要用户名是写入用户名
      if (this.tips) {
        ctx.fillStyle = "gray";
        ctx.textAlign = "left";
        // var w = ctx.measureText(this.title).width;
        ctx.fillText(this.tips,20, 950);

        ctx.restore(); // 还原状态
        this.convertCanvasToImage(canvas);
      }
    },

    convertCanvasToImage(canvas) {
      this.imgSrc = canvas.toDataURL("image/jpeg"); //png有毒在安卓机下识别二维码无法跳转
    },
  },
};
</script>

<style scoped lang="less"></style>
