<template>
  <!-- 搜索 -->
  <div class="search" :class="{active: isfocus}">
    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch">
      <!-- v-model 只是绑定了值 
         1 监听 文本框 输入 关键字 @input   
         2 文本框里面回车 小程序文本框自带回车事件 confirm
          -->
      <input 
      type="text" 
      placeholder="请输入搜索商品"
      v-model="keyword"  
      @input="query"
      @confirm="goList"
      >
      <span class="cancle" @click.stop="goCancel">取消</span>
    </div>
    <!-- 搜索结果 -->
    <div class="search-content">
      <div class="title">
        搜索历史
        <!-- 点击x 清空历史 -->
        <span @click="removeHistory" class="clear"></span>
      </div>
      <div class="history">
        <!-- 循环 搜索历史 列表 -->
        <navigator url="/pages/list/index"
         v-for="(item,index) in history"
         :key="index"
        >
          {{item}}
        </navigator>

      </div>
      <!-- 结果列表 -->
      <!-- 有结果才有必要显示 
        这是uniapp的一个bug  v-show在这不行 v-if可以
      -->
      <scroll-view
       scroll-y class="result"
       v-if="list.length>0"
       >
        <!-- 循环搜索结果list 生成列表 -->
        <navigator url="/pages/goods/index"
          v-for="item in list"
          :key="item.goods_id"
        >
            {{item.goods_name}}
        </navigator>
       
      </scroll-view>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isfocus: false,
        placeholder: '',
        keyword:"",// 文本框值 
        list:[], //搜索结果
        //如果storage有 就取出来 没有才写 []
        history:uni.getStorageSync('history') || [] //  搜索过的 关键字 数组 [小米,大米..]
      }
    },
    methods: {
      // 先注释 刚刚的代码 不然会影响我们写功能

      // 文本框回车 跳转到商品列表页面 并带上参数传过去
      goList(){
          //1  搜索过的 关键字 追加到history数组
          this.history.push(this.keyword)
          console.log('搜索历史history',this.history)
          // 去重
          this.history=[...new Set(this.history)]
          // 注意 要把 history存在 localStorage 下次进来 拿出来用
          // wx.setStorageSync('键名', '值可以是任何类型')
          uni.setStorageSync('history', this.history )
          //2 跳转到商品列表页面 并带上参数传过去
          uni.navigateTo({
            // url: '/pages/list/index?query=小米',
            url: '/pages/list/index?query='+this.keyword,
          });
      },
      // input当文本框输入值 时候 执行
      async query(){
        console.log('关键字',this.keyword)
        // 发送请求 获取对应数据 循环显示在下面结果列表
       let res=await this.http({
              url:"/api/public/v1/goods/qsearch",
              data:{
                query:this.keyword // query:小米
              }
          })
        console.log('搜索结果',res)
        // 赋值 搜索结果
        this.list=res.message
      },
      // 清空 搜索历史
      removeHistory(){
          // 1 清空数组
          this.history=[]
          // 2 清空storage
          uni.removeStorageSync("history")
      },
      goSearch (ev) {
        // 获取焦点 isfocus true 加上 active
        this.isfocus=true;
        // 获取屏幕高度 微信提供了
        // wx. ---》换成 uni. 就行
        let res= uni.getSystemInfoSync()
        console.log('结果',res)
        this.$emit("my",res.windowHeight+'px')

        // 隐藏tabBar
        uni.hideTabBar();
      },
      // 取消
      goCancel () {
        // 取消 清空 文本框值
        this.keyword=''
        // 取消 清空 搜索结果列表list
        this.list=[]
        // 取消 isfocus false 加上 active
        this.isfocus=false;

        // 触发父组件自定义事件
        this.$emit('my', 'auto');

        // 显示tabBar
        uni.showTabBar();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      // &::before,
      // &::after {
      //   height: 44rpx;
      //   line-height: 1;
      //   background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
      //   background-size: 32rpx;
      //   background-position: 6rpx center;
      //   background-repeat: no-repeat;

      //   position: absolute;
      //   top: 28rpx;
      //   z-index: 9;
      // }

      // &::before {
      //   content: '搜索';
      //   display: block;

      //   width: 100rpx;
      //   padding: 11rpx 0 10rpx 44rpx;
      //   box-sizing: border-box;
      //   color: #666;
      //   font-size: 24rpx;
      //   left: 325rpx;
      // }

      // &::after {
      //   display: none;
      //   content: '';
      //   width: 44rpx;
      //   left: 40rpx;
      // }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .search-content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(http://static.botue.com/ugo/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.active {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

       
      }

      span.cancle {
        display: block;
      }

      .search-content {
        display: block;
      }
    }
  }
</style>