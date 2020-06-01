<template>
  <view>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">
      <!-- 左侧 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <!-- active 选中的样式 
          发送请求 得到allCategory 数组  30个分类
          循环 index就是 数组的索引 
          -->
          <text 
          v-for="(item,index) in allCategory"
          :key="item.cat_id"
          :class="{ active :  activeIndex===index }"
          @click="getSubcate(index)"
          >
            {{item.cat_name}}
          </text>
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>
          
          <!-- children 右侧 的 电视 空调部分 默认大家电 0 索引 -->
          <view class="children" 
            v-for="child in allCategory[activeIndex].children"
            :key="child.cate_id"
          >
            <view class="title">{{child.cat_name}}</view>
            <!-- 品牌 -->
            <view class="brands">
              <!-- 再循环 电视 下面的 孩子品牌 -->
              <navigator 
              url="/pages/list/index"
              v-for="brand in child.children"
              :key="brand.cat_id"
              >
                <image :src="brand.cat_icon"></image>
                <text>{{brand.cat_name}}</text>
              </navigator>
           
            </view>
          </view>
         
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    components: {
      search
    },
    data(){
      return {
        allCategory:[], //所有分类
        activeIndex:0 //默认显示 0索引 数据
      }
    },
    onLoad(){
      // 页面打开 发送请求获取 所有分类
      this.getCategory()
    },
    methods:{
      // 页面打开 发送请求获取 所有分类
      async getCategory(){
          let res=await this.http({
            url:"/api/public/v1/categories"
          })
          console.log('分类数据',res)
          // 赋值
          this.allCategory=res.message
      },
      // 点击左侧 获取 当前分类的 索引  去修改右侧 显示对应数据
      getSubcate(index){
         console.log('索引',index)
         // 点击谁 就赋值谁的索引 
         this.activeIndex=index;
      }
    }
  }
</script>

<style scoped lang="scss">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
