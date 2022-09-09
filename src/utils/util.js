const isIos = () => {
    var u = window.navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    return isiOS;
};

const isAndroid = () => {
    var u = window.navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

    return isAndroid;
};

const isBeta = () => {
  var u = window.navigator.userAgent;
    var isBeta = u.indexOf("gcys2022_ios_20220602_ok") > -1; //android终端

  return isBeta;
};


export {
    isIos,
    isAndroid,
    isBeta
};