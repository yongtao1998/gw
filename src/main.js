import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
// 封装全局请求
Vue.prototype.http=async function(options){
  // 发送之前loading
  uni.showLoading({
    title: '加载中',
    mask:true // 遮罩层
  })
  let baseURL="https://www.uinav.com"

  let res=await uni.request({
    url: baseURL+options.url,
    header:options.header,
    data:options.data,
    method: options.method?options.method:'GET'
  })
  // 发送成功之后 隐藏loading
  wx.hideLoading()
  // console.log('轮播图结果',res) // [null, {data:数据}]
  // console.log('轮播图数据',res[1].data)
  return res[1].data;
}
const app = new Vue({
  ...App
})
app.$mount()
