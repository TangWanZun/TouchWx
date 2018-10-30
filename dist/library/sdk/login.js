//获取用户登陆状态
function doLogin(){
  //获取code
  wx.login({
    success: function (loginRes) {
      console.log(loginRes);
      if (loginRes.code) {
        // 将code传到后台，并换取后台自定义的用户登录态标识
        wx.$request({
          url:'',
          data:{
            code: loginRes.code
          },
          success:function(response){
            //将后台返回的自定义用户登陆标识存入storage中
            wx.setStorage({
              key: "skey",
              data: response.skey
            });
          }
        })
      }
    }
  });
}
//正式信息调取
function login(){
  //获取storage中的skey
  let loginFlag = wx.getStorageSync('skey');
  if (loginFlag) {
    // 检查 session_key 是否过期
    wx.checkSession({
      // session_key 有效(未过期)
      success: function () {
        //获取用户非敏感信息(这些信息是无需登陆状态的，只需要用户授权即可)
        wx.getUserInfo({
          withCredentials:false,
          success:function(res){
            getApp().privateData.userInfo = res.userInfo;
          }
        })
      },
      // session_key 过期
      fail: function () {
        // session_key过期，重新登录
        doLogin();
      }
    });
  } else {
    // 无skey，作为首次登录
    doLogin();
  }
}

//测试信息调取
function loginTest() {
  //获取用户非敏感信息(这些信息是无需登陆状态的，只需要用户授权即可)
  // wx.authorize({
  //   scope:"scope.userInfo",
  //   success(res){
  //     wx.getUserInfo({
  //       withCredentials: false,
  //       success: function (res) {
  //         getApp().privateData.userInfo = res.userInfo;
  //       }
  //     })
  //   },
  //   fail(res){
  //     console.log(res);
  //   }
  // })
  // 跳转到登陆页面
  let loginFlag = wx.getStorageSync('skey');
  if (loginFlag){

  }else{
    wx.redirectTo({
      url: "/pages/user/login"
    })
  }
}
export { loginTest as default}