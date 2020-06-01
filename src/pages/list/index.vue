<template>
  <view class="list">
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <view class="goods">
      <!--循环goodslist 渲染商品列表  一个商品 -->
      <view class="item" 
        v-for="item in goodslist"
        :key="item.goods_id"
        @click="goDetail(item.goods_id)"
      >
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{item.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{item.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>
      
      <!-- 没有更多了 -->
      <view v-show="isend">客官 没有更多了哦~~</view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        params:'',//查询关键字  {query: "大米"}
        pagenum:1,// 默认显示第一页
        pagesize:20,// 默认每次 显示20条数据
        goodslist:[],// 商品列表数组
        total:0,// 数据总条数
        isend:false,// 数据 还没有结束 结束 改成true
      }
    },
    onLoad(params){
      console.log('商品列表接受的参数',params)
      // params=={query: "大米"}
      this.params=params
      // 发送请求 获取  商品列表 数据 20条
      this.getGoodsList()
    },
    methods: {
      // 发送请求 获取  商品列表 数据
      async getGoodsList(){
         let res= await this.http({
            url:"/api/public/v1/goods/search",
            data:{
              query:this.params.query,//大米
              pagenum:this.pagenum,// 页码
              pagesize:this.pagesize // 每页显示的条数
            }
          })
        console.log('商品列表数据',res)
        // 赋值
        // 不应该 替换 应该 追加合并 数据越来越多
        this.goodslist=[...this.goodslist,...res.message.goods]// 数组20条
        this.total=res.message.total // 61
      },
      // 点击跳转到详情页面-传商品id参数
      goDetail (id) {
        uni.navigateTo({
          url: '/pages/goods/index?id='+id
        })
      }
    },
    // 监听上拉加载 执行的函数onReachBottom
    onReachBottom(){
        console.log('上拉 到底 啦 ~~')
        // 上拉到底了 肯定就做 发送请求 加载更多数据
        // 1 判断 是否还有数据 
        // 没有数据  goodslist商品数据 === 总条数
        if(this.goodslist.length===this.total){
           this.isend=true // 显示 没有更多
           return;// 不执行后面代码
        }

        // 2 进来是 第一页 数据  上拉 第二页数据 ...
        // 页码 +1  上拉一次 就获取一次 页码 +1 的数据
        this.pagenum+=1
        // 发送请求 加载更多数据
        this.getGoodsList()
    }
  }
</script>

<style scoped lang="scss">
  .list{
    padding-top: 100rpx;
  }
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    background-color: #fff;

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }
</style>
