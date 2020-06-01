<template>
  <view>
    <!-- 
        button  有 open-type 可以实现各种功能 --- 客服contact 反馈 feedback 
                                                            bindtap
                              getUserInfo	获取用户信息，
                              可以从bindgetuserinfo 事件函数中获取到用户信息
     -->
       <!-- 点击登录 
          1 调用微信特有方法 获取到我们的  微信账号信息
          2 用 我们账号去  登录
          3 登录成功  storage存 token
        -->
    <button type="primary" 
    open-type="getUserInfo"
    @getuserinfo="getUser"
    >微信登录</button>

  </view>
</template>

<script>
  export default {
      data(){
        return {}
      },
      methods:{
        // 点击按钮 获取微信用户信息
        async getUser(user){
            console.log('微信用户',user)
            // 拒绝 user.detail.errMsg  =》 getUserInfo:fail auth deny
            if(user.detail.errMsg==='getUserInfo:fail auth deny'){
                uni.showToast({title:"别拒绝啊~~"})
                return;
            }
            //1  允许  调用微信特有方法 获取到我们的  微信账号信息
            // 2 用 我们账号去  登录--还需要code(小程序登录都需要)
            let res=await uni.login()

            console.log('微信login-res',res);// res[1].code
            let loginRes=await this.http({
                url:"/api/public/v1/users/wxlogin",
                method:"post",
                data:{
                  code:res[1].code,
                  encryptedData:user.detail.encryptedData,
                  iv:user.detail.iv,
                  rawData:user.detail.rawData,
                  signature:user.detail.signature
                }
              })
            // 3 登录成功  storage存 token
            // 思路代码是对的 但是 code有错--因为要 公司appid 和添加成员管理
            console.log('登录结果loginRes',loginRes)
            if(loginRes.meta.status===200){//登录成功
                // storage存 token
                uni.setStorageSync("token",loginRes.message.token)
                // 跳转回去 结算
                uni.navigateBack() //返回上一页
            }

        }
      }
  }
</script>

<style lang="scss" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>