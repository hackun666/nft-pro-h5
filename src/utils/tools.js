import Taro from "@tarojs/taro";


export function setToken(token) {
    Taro.setStorageSync('token', token);
}

export function setUserInfo(data) {
  Taro.setStorageSync('userInfo', data);
}
export function setUserName(data) {
  Taro.setStorageSync('username', data);
}
export function setUserFace(data) {
  Taro.setStorageSync('face', data);
}
export function getToken(params) {
    return Taro.getStorageSync('token');
}
export function getUserName(params) {
  return Taro.getStorageSync('username');
}
export function getUserFace(params) {
  return Taro.getStorageSync('face');
}


export function getUserInfo(params) {
  return Taro.getStorageSync('userInfo');
}

export function isLogined() { 
    if (getToken()) {
        return true;
    } else {
        console.log('未登录')
        return false;
    }
}