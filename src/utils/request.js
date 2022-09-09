import Taro from '@tarojs/taro'

export default function request(url, method, data, callback) {
    Taro.showLoading({
        title: '加载中...'
    })
    return Taro.request({
        url,
        method,
        data,
        header: {
            'content-type': "application/x-www-form-urlencoded",
        }
    }).then(res => {
        Taro.hideLoading()
		if(res.data.errcode == 4000000){
			Taro.redirectTo({
			  url: "pages/login/login",
			});
		}
        return callback(res)
    }).catch (err => {
        Taro.hideLoading()
        return err
    })
}