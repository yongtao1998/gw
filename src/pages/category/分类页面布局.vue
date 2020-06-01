<template>
    <view class="cate">
      <!-- 小程序 提供了一个 scroll-view 标签 配合 scroll-y 来实现区域滚动 效果更好  -->
        <!-- 左边 -->
        <scroll-view scroll-y class="left"> 
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
               <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
               <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
              <view>左边的</view>
        </scroll-view>

        <!-- 右边 -->
        <scroll-view scroll-y class="right"> 
              <view>
                  <!-- 一行 三个  浮动或者flex 都可以 -->
                  <navigator>
                      <image></image>
                      <text>曲面电视</text>
                  </navigator>
                  <navigator>
                      <image></image>
                      <text>海信</text>
                  </navigator>
                  <navigator>
                      <image></image>
                      <text>夏普</text>
                  </navigator>
                  <navigator>
                      <image></image>
                      <text>创维</text>
                  </navigator>
                  <navigator>
                      <image></image>
                      <text>曲面电视</text>
                  </navigator>
              </view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
               <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
               <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
               <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
              <view>嘿嘿嘿</view>
        </scroll-view>
        
    </view>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
};
</script>

<style scoped lang="less">
.cate{
  display: flex; //让左右横排
  height: 400px;
  .left{
    width: 200rpx;
    height: 100% ;
    background-color: #eee;
    // 内容超出 盒子配合  需要 overflow: scroll;
    // overflow: scroll;
  }
  .right{
    flex:1; // 除去 左侧宽度 占满剩余的
    height: 100%;
    background-color: pink;
    // 内容超出 盒子配合  需要 overflow: scroll;
    // overflow: scroll;
  }
}
</style>
