<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment"
      v-if="address"
    >
        <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{address.userName}}</text>
          <text class="phone">{{address.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{detailAddress}}</view>
    </view>
    <!-- 添加收货地址按钮 -->
    <button 
    v-else
    type="primary" @click="getAddress">添加收货地址</button>

    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆1</view>
        <!-- 循环 购物车 carts  生成 商品列表 --> 
        <view class="goods"
          v-for="(item,index) in carts"
          :key="item.goods_id"
        >
            <!-- 商品图片 -->
            <image class="pic" :src="item.goods_small_logo"></image>
            <!-- 商品信息 -->
            <view class="meta">
              <view class="name">{{item.goods_name}}</view>
              <view class="price">
                <text>￥</text>{{item.goods_price}}<text>.00</text>
                <text @click="delCart(index)">删除</text>
              </view>
              <!-- 加减 -->
              <view class="amount">
                <text class="reduce" @click="reduceNum(index)">-</text>
                <!-- 文本框 v-model 绑定数据-- v-model 只能双向绑定值 
                      需求 不仅要绑定值  
                          当文本框输入值 input事件 还要 写代码 操作storage
                      这里 就不用 v-model 了  就自己绑定 value 和input
                -->
                <input type="number" 
                :value="item.goods_number" 
                @input="setValue(index,$event)"
                class="number"
                >

                <text class="plus" @click="addNum(index)">+</text>
              </view>
            </view>
            <!-- 选框 -->
            <view class="checkbox">
              <!--   goods_checked 勾选 true选中 #ea4451 红色   false未选中 #ccc 灰色 -->
              <!-- 默认 true  都是选中 -->
              <icon type="success" size="20" 
              :color="item.goods_checked ? '#ea4451':'#ccc' "
              @click="toggle(index)"
              ></icon>
            </view>
          
        </view>
    
      
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <!-- 全选图标
          全选：购物车商品总数===购物车选中的商品总数
       -->
      <label class="checkall">
        <icon type="success" 
          :color="allChecked ? '#ea4451' : '#ccc' " 
          size="20"
          @click="setAllChecked"
        >
        </icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{total}}</label><text>.00</text>
      </view>
      <!-- 结算 商品个数 -->
      <view class="pay" 
      @click="createOrder"
      >结算({{checkedGoods.length}})</view>
    </view>
  </view>
</template>

<script>

  export default {

     data(){
        return {
           carts:[], // 购物车页面 的 购物车 数据
           address:null //收货地址
        
        }
     },
     methods:{
        // 点击 结算 生成 订单  --- 跳转到订单列表页面  支付
        async createOrder(){
            // 1 需要收货地址 
            if(!this.address){
              uni.showToast({
                title:"请填写收货地址！"
              })
              return;//不执行后面代码
            }
            // 2 至少选择一件商品 
            if(this.checkedGoods.length<1){
                 uni.showToast({
                  title:"至少一件商品"
                })
                return;//不执行后面代码
            }
            // 3 需要登录--如果没有登录 应该先去的登录页面登录
            // 我们登录后会 storage存token  --这里可以判断token torage没有token 就代表没有登录
            let token=uni.getStorageSync("token")
            if(!token){//没有登录
                // 先跳转去登录页面 登录
                uni.navigateTo({
                  url:"/pages/auth/index"
                })
                return;
            }
            console.log('生成订单')
            let res=await this.http({
                            url:"/api/public/v1/my/orders/create",
                            method:"post",
                            header:{
                              // 请求头加上 token 注意main.js的http 要有header
                              Authorization: uni.getStorageSync("token")
                            },
                            data:{
                              order_price: this.total,  //订单总价格
                              consignee_addr: this.detailAddress, // 订单详细地址
                              goods: this.checkedGoods // 订单商品列表
                            }
            })
            console.log('生成订单成功',res)
            if(res.meta.status===200){//生成订单成功 跳转到订单列表页面
                uni.showToast({title:"生成订单成功"})
                // 跳转到订单列表页面
                uni.navigateTo({
                  url:"/pages/order/index"
                })
            }
        }, 
        // 点击 +  让数量 +1
        addNum(index){
          console.log('索引',index)
          // 判断 如果 加 到  商品库存数量  就不能再加了 
          let num=this.carts[index].goods_number;//当前购买数量
          if(num>=10){ //购买数量>=库存 假设 10件
            return;// 不执行后面+1操作
          }
          // 点击哪个商品 把他的索引 传来  可以在carts购物车找到
          this.carts[index].goods_number+=1
          
          // 购物车carts数据改变了 要重新存一下storage
          uni.setStorageSync("carts",this.carts)
        },
        // 点击 - 让数量 -1
        reduceNum(index){
          // 判断  减 到 1  就不能再减了
          let num=this.carts[index].goods_number
          if(num<=1){// 购买数量 <= 1
            return;
          }
          // 购买数量 -1
          this.carts[index].goods_number-=1
          // 购物车carts数据改变了 要重新存一下storage
          uni.setStorageSync("carts",this.carts)
        },
        // 当文本框 值改变 input事件执行
        setValue(index,e){
          //当文本框输入数量 把对应商品 的数量   修改
          console.log('文本框数量改了',e.detail.value)
          let val=e.detail.value //文本框数量 
          // 注意 这个val数量 文本框值 是 字符串类型
          val=parseInt(val) // 需要转成数字 
          // 判断 数量 不能<=1 数量 不能>=库存10
          if(val<=1){
            val=1 //强制为1
          }
          if(val>=10){
             val=10 //强制为10
          }
          // 修改 carts数组 对应商品数量
          this.carts[index].goods_number=val

          // 购物车carts数据改变了 要重新存一下storage
          uni.setStorageSync("carts",this.carts)
          
        },
        // 点击 商品勾选图标 切换 选中与未选中
        toggle(index){
          //  点哪商品 就切换 对应商品的  选中与未选中
          //  goods_checked 勾选 true选中 #ea4451 红色   false未选中 #ccc 灰色
          // if(this.carts[index].goods_checked===true){
          //   this.carts[index].goods_checked=false
          // }else{
          //    this.carts[index].goods_checked=true
          // }
          this.carts[index].goods_checked= !this.carts[index].goods_checked
           // 购物车carts数据改变了 要重新存一下storage
          uni.setStorageSync("carts",this.carts)
        },
        //  点击全选图标  
        setAllChecked(){
          // 切换所有商品的 选中与不选中
          if(this.allChecked){//现在是true 点击 所有商品变false
             this.carts.forEach((goods)=>{
                goods.goods_checked=false
             })
          }else{// 现在是false 所有商品变true
              this.carts.forEach((goods)=>{
                goods.goods_checked=true
              })
          }
          // 购物车carts数据改变了 要重新存一下storage
          uni.setStorageSync("carts",this.carts)
        },
        // 点击添加收货地址按钮 添加地址
        getAddress(){
          //  小程序只需要调用 小程序的api函数就行
          // 微信开发者工具测试 只有一个张三 如果你在手机上打开 就是正常的可以填写选择
          // 手机上正常 
          uni.chooseAddress({
            success:(res)=>{
              // 点击确定 
              console.log('收货地址',res)
              // 赋值
              this.address=res
            }
          })
        },
        // 删除
        delCart(index){
          // 根据索引删除当前这一项
          // 数组.splice(2,1) 从索引2 开始 删除1个 
          this.carts.splice(index,1) 
          // 购物车carts数据改变了 要重新存一下storage
          uni.setStorageSync("carts",this.carts)
        }
        
     },
     computed:{
        // 计算属性 一般用在 计算总价 计算总数 计算是否全选 等等 总量总数总价 这些地方
        // 计算属性  只要有一变化 就会实时的给你 动态计算
        //  checkedGoods 循环购物车 拿出购物车选中的商品 数组
        checkedGoods(){
            // 循环购物车 找到 true的商品 代表的是选中的
            // 数组.filter 返回 满足true条件的项  组成一个 新数组
            
            let checkedGoods=this.carts.filter((item)=>{
                return item.goods_checked===true //选中的
            })
            // console.log('checkedGood',checkedGood)
            return checkedGoods
        },
        // 判断 是否全选
        allChecked(){
            // 当购物车商品总数 === 选中的商品总数 
            return this.carts.length===this.checkedGoods.length
        },
        // 计算总价
        total(){
          //所有选中的商品的总价
          // 1 this.carts循环判断计算 2 直接checkedGoods
          let total=0
          this.checkedGoods.forEach((goods)=>{
              // 数量*价格 相加 
              total+=goods.goods_number*goods.goods_price
          })
          return total
        },
        //拼接 详细地址
        detailAddress(){
          if(this.address){
            return this.address.provinceName+this.address.cityName+this.address.countyName+this.address.detailInfo
          }
        }
     },
     onLoad(){ 
       console.log('购物车页面onLoad')
        // 页面加载 获取购物车数据  本来是要发送 请求 但是 现在 购物车数据在 storage
        // 从 storage 取出 购物车数据
        // 第一次 2条 取出来了  第二次再打开  3条没有取出来？
        // this.carts=uni.getStorageSync('carts') || [];
     },
     onShow(){
       console.log('购物车页面onShow-1')
      //  每次打开 都执行  肯定 都是 从storage拿到新数据
       this.carts=uni.getStorageSync('carts') || [];
     }
  }
</script>

<style scoped lang="scss">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
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

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

