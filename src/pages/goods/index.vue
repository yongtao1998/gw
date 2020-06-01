<template>
  <view class="wrapper">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <!-- 循环 goods里面的 pics -->
      <swiper-item 
        v-for="item in goods.pics"
        :key="item.pics_id"
      >
        <image :src="item.pics_big_url"></image>
      </swiper-item>
  
    </swiper>
    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{goods.goods_price}}</view>
      <view class="name">{{goods.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <!-- <rich-text></rich-text> -->
      <!-- html字符串 渲染成页面 -->
      <!-- <view v-html="goods.goods_introduce"></view> -->
      <!--rich-text 小程序用来 把html字符串 转换成 页面效果  -->
      <rich-text :nodes="goods.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <!-- <button open-type="getPhoneNumber">获取手机号-我们的账号没有权限</button> -->
      <!-- <button open-type="getUserInfo">获取个人微信信息-后面</button> -->
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart">购物车</text>
      <text class="add" @click="addCart">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
         params:null, // 传来的参数 {id: "57224"}
         goods:null ,//当前商品 建议知道 后面赋值是个 数组 写 [] 知道是对象 写 null 字符串 '' 数字 0
         //  如果storage里面有 购物车 拿出来  没有 才是 []
         carts: uni.getStorageSync('carts') ||  []// 购物车数组 用来存商品
      }
    },
    onLoad(params){
      console.log('商品详情参数',params);// {id: "57224"}
      this.params=params
      // 根据商品id  发送请求  商品详情数据  渲染页面	
      this.getGoodsDetail()
    },
    methods: {
      // 点击 加入购物车  把 当前商品  加入购物车(存到storage)
      addCart(){
        console.log('goods当前商品',this.goods)
        // good当前商品 信息太多  我们有些没必要  取出 重要的 存起来
        // 商品id 商品价格price  商品购买数量（默认1） 商品标题 商品小图片goods_small_logo
        let {goods_id,goods_price,goods_name,goods_small_logo}=this.goods
        // 判断 carts购物车 有没有 这个商品  有 就 数量+1 没有 才追加
        //1 循环购物车 判断  商品id  是否  和 当前商品id 有一样的
        // 数组.findIndex()  循环数组carts 返回 满足条件的 那项的 索引
        let index=this.carts.findIndex((item)=>{
                // 判断  商品id  是否  和 当前商品id 一样的
                return item.goods_id===this.goods.goods_id
            })
        // console.log('商品的索引 index',index) // 找到商品 就返回 对应索引 没有 就返回-1
        if(index===-1){// 没有 这个商品
          // 把当前商品重要信息 加入购物车
          this.carts.push({
            goods_id,
            goods_price,
            goods_name,
            goods_small_logo,
            goods_number:1,  // 默认加一条
            // 在多加 一个 属性 名字随便 类似 goods_checked:true/false 代表 选中与未选中
            // 在购物车页面 需要 通过他 来判断  是否选中
            goods_checked:true 
          })

        }else{//有这个商品 数量 +1 正好有个索引 可以
          this.carts[index].goods_number+=1
        }
        // 把carts存到storage 
        uni.setStorageSync('carts', this.carts);
        
        // 提示加入购物车成功
        uni.showToast({title:"加入购物车成功"})
      },
      // 根据商品id  发送请求  商品详情数据  渲染页面	
      async getGoodsDetail(){
         let res=await this.http({
                url:"/api/public/v1/goods/detail",
                data:{
                  goods_id:this.params.id // 商品id
                }
              })
          console.log('商品详情数据',res)
          // 赋值
          this.goods=res.message
      },
      // 点击 购物车 跳转到 购物车页面
      goCart () {
        // 购物车页面 是 底部tabbar四个页面之一
        uni.switchTab({
          url: '/pages/cart/index'
        })
      },
      createOrder () {
        uni.navigateTo({
          url: '/pages/order/index'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
