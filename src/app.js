import Vue from 'vue'
import './app.less'

import LottiePlayer from "lottie-player-vue";
Vue.use(LottiePlayer);
import VueLoadmore from "vuejs-loadmore";

Vue.use(VueLoadmore);

const App = {
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}

export default App
