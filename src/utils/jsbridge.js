import { isIos } from './util'

var jsBridge = {};
jsBridge.postNotification = function (name, data) {
    window.webkit.messageHandlers.oc.postMessage(data);
}
export function wxPay(paydata) {
    if (isIos()) {
        jsBridge.postNotification('oc', {
            'wxPay': (paydata)
        });
    } else {
        window.qyapp.wxPay(JSON.stringify(paydata));
    }
}

export function aliPay(paydata) {
    if (isIos()) {
        jsBridge.postNotification('oc', {
            'aliPay': (paydata)
        });
    } else {
        window.qyapp.aliPay(paydata);
    }
}

export function opennewview(url) {
  console.log(url)
  if (isIos()) {
    console.log('iOS')
    jsBridge.postNotification('oc', {
      'opennewview': (url)
    });
  } else {
    console.log('android')
    window.qyapp.opennewview(url);
  }
}

export function reciveImage(data) {
  console.log(data)
  if (isIos()) {
    console.log('iOS')
    jsBridge.postNotification('oc', {
      'reciveImage': (data)
    });
  } else {
    console.log('android')
    window.qyapp.reciveImage(data);
  }
}

export function upImg(maxNum) {
  if (isIos()) {
    console.log('iOS')
    jsBridge.postNotification('oc', {
      'upImg': (maxNum)
    });
  } else {
    console.log('android')
    window.qyapp.upImg(maxNum);
  }
}

export function qianming(data) {
  console.log(data)
  if (isIos()) {
    console.log('iOS')
    jsBridge.postNotification('oc', {
      'qianming': (data)
    });
  } else {
    console.log('android')
    window.qyapp.qianming(data);
  }
}

export function saveqianming(data) {
  console.log(data);
  if (isIos()) {
    console.log("iOS");
    jsBridge.postNotification("oc", {
      saveqianming: data,
    });
  } else {
    console.log("android");
    window.qyapp.saveqianming(data);
  }
}

export function ysfPay(data) {
  console.log(data);
  if (isIos()) {
    console.log("iOS");
    jsBridge.postNotification("oc", {
      ysfPay: data,
    });
  } else {
    console.log("android");
    window.qyapp.ysfPay(data);
  }
}