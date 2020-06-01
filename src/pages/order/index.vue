<template>
  <view class="wrapper">
    <!-- 订单状态 -->
    <view class="tabs">
      <text :class="{active: type===1 }" @click="chooseOrder(1)">全部</text>
      <text :class="{active: type===2 }" @click="chooseOrder(2)">待付款</text>
      <text :class="{active: type===3 }" @click="chooseOrder(3)">已付款</text>
      <text @click="chooseOrder">退款/退货</text>
    </view>
    <!-- 订单 -->
    <scroll-view class="orders" scroll-y>
      <!-- item每一个订单 循环 order 渲染页面 -->
      <!-- 一个订单 一般包含 很多商品  -->
      <view 
      class="item"
      v-for="item in order"
      :key="item.order_id"
      >
          <!-- 一个商品 block包裹整体 但是页面不会显示block -->
        <block v-for="good in item.goods" :key="good.goods_id">
           <!-- 商品图片 -->
            <image class="pic" :src="good.goods_small_logo"></image>
            <!-- 商品信息 -->
            <view class="meta">
              <view class="name">{{good.goods_name}}</view>
              <view class="price">
                <text>￥</text>{{good.goods_price}}<text>.00</text>
              </view>
              <view class="num">x{{good.goods_number}}</view>
            </view>
        </block>
        
        <!-- 总价 -->
        <view class="amount">
          共{{item.total_count}}件商品 总计: ￥{{item.order_price}}(含运费0.00)
        </view>
        <!-- 其它 -->
        <view class="extra">
          订单号: {{item.order_number}}
          <button size="mini" type="primary" @click="pay(item.order_number)">支付</button>
        </view>
      </view>

    </scroll-view>
  </view>
</template>

<script>
  export default {
     data(){
       return {
          order:[], //订单列表数据
          type:1 //1  全部订单     2 待付款订单    3 已付款订单
       }
     },
     onLoad(){
       //  发送请求获取订单列表数据
       this.getOrder()
     },
     methods:{
      //  发送请求获取订单列表数据
      async getOrder(){
        let res=await this.http({
          url:"/api/public/v1/my/orders/all",
          header:{
            Authorization:uni.getStorageSync("token")
          },
          data:{
            type: this.type //1  全部订单     2 待付款订单    3 已付款订单
          }
        })
        console.log('订单列表数据',res)
        //赋值
        this.order=res.message.orders
      },
      //  点击 显示对应的订单
      chooseOrder(type){
         //1  全部订单     2 待付款订单    3 已付款
         this.type=type// 1 2 3
         // 重新发送请求 获取对应订单
         this.getOrder() 
      },
      // 点击支付按钮  去微信支付
      async pay(order_number){
          console.log('去微信支付') // 微信支付流程
          // 1 把要支付的订单 信息传给后台 后台返回我们支付信息(预付单)
          let res=await this.http({
            url:"/api/public/v1/my/orders/req_unifiedorder",
            method:"post",
            header:{
              Authorization:uni.getStorageSync("token")
            },
            data:{
              order_number:order_number //当前付款的订单编号
            }
          })
          console.log('支付数据',res) 
          // res.message.pay  
          // 拿到支付 支付--一般支付方法 都是 文档会有 
          //  wx.requestPayment() 发起支付 微信就会弹出那个付款窗口 不是我们写的弹窗
          uni.requestPayment({
            timeStamp: res.message.pay.timeStamp,
            nonceStr: res.message.pay.nonceStr,
            package: res.message.pay.package,
            signType: 'MD5',
            paySign: res.message.pay.paySign,
            success (res) {
                console.log('支付得结果是什么？',res)
            },
            fail (res) { }
          })

      }
     }
  }
</script>

<style scoped lang="scss">
  .tabs {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 10rpx #ccc;

    text {
      flex: 1;
      text-align: center;
      font-size: 27rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }

  .orders {
    width: 100%;
    background-color: #f4f4f4;

    position: absolute;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    padding: 30rpx 20rpx 0;
    margin-top: 16rpx;
    background-color: #fff;

    .pic {
      width: 200rpx;
      height: 200rpx;
      float: left;
    }

    .meta {
      height: 200rpx;
      margin-left: 230rpx;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }

    .num {
      position: absolute;
      bottom: 0;
      right: 20rpx;
      color: #333;
    }

    .amount {
      text-align: right;
      padding: 20rpx;
      font-size: 24rpx;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      margin-top: 20rpx;
      color: #999;
    }

    .extra {
      padding: 30rpx;
      font-size: 24rpx;
      color: #999;
      position: relative;

      button {
        position: absolute;
        right: 20rpx;
        font-size: 24rpx;
        margin-top: -10rpx;
      }
    }
  }
</style>
