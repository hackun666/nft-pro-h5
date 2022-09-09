<template>
  <view class="main">
    <Navbar title="修改资料" />
    <view class="form_page">
      <view class="user_form">
        <view class="user_form_row">
          <view class="user_form_label">用户头像</view>
          <view class="u_face_edit" @tap="uploadHttp">
            <image class="face" :src="user.avatar?user.avatar:require('../../assets/img/avatar.png')" mode="aspectFill" />
            <image
              src="../../assets/img/arrow.svg"
              class="arrow_icon"
              mode="widthFix"
            />
          </view>
        </view>
        <view class="user_form_row">
          <view class="user_form_label">用户昵称</view>
          <view class="u_face_edit">
            <input
              class="nick"
              type="text"
              placeholder="请填写用户昵称"
              v-model="user.nickname"
              maxlength="10"
            />
          </view>
        </view>
      </view>
      <view class="form_btn flex_center" @tap="saveUserInfo">保存</view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import "./userinfo.less";
import Navbar from "../../components/navbar";
import { serverUrl } from "../../utils/config";
import request from "../../utils/request";

import { isLogined, getToken } from "../../utils/tools";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      user: {},
      token: getToken(),
    };
  },
  onLoad() {
    this.getUser();
  },
  methods: {
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
    uploadHttp() {
      var that = this;
      Taro.chooseImage({
        success(res) {
          Taro.showLoading({
            title: '上传中'
          })
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)
          Taro.uploadFile({
            url: serverUrl + '/userapi/uploadavatar?token=' + that.token,
            filePath: tempFilePaths[0],
            name: "file",
            success(res) {
              Taro.hideLoading()
              console.log(res);
              var json = JSON.parse(res.data);
              if (json.errcode == "200") {
                that.user.avatar = json.src;
              }else{
                Taro.showToast({
                  title: json.errmsg,
                  icon: "none",
                  duration: 2000,
                });
              }
            },
          });
        },
      });
    },
    saveUserInfo() {
      var that = this
      Taro.request({
        url: serverUrl + "/userapi/saveuserinfo",
        method: "POST",
        dataType: "json",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          token: this.token,
          avatar: this.user.avatar,
          nickname: this.user.nickname,
        },
      }).then((res) => {
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: "保存成功",
            icon: "success",
          });
          that.getUser();
        } else {
          Taro.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      });
    },
    goBackUser() {
      Taro.navigateTo({
        url: "/pages/user/user",
      });
    },
  },
};
</script>
