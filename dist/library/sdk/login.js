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
//保存用户信息
function saveUserInfo(res,obj={}){
  // console.log("success", res);
  let privateData = getApp().privateData;
  //将Token保存到内存
  privateData.Token = res.Data.Token;
  //将个人信息保存到内存
  privateData.loginInfo = res.Data.LoginInfo;
  //当用户连接上时，发送重新发送滞留消息
  privateData.requestRetention.forEach(wx.$request);
  //清空滞留消息
  privateData.requestRetention.length = 0;
  //保存Token信息持久化
  wx.setStorage({
    key: 'Token',
    data: res.Data.Token,
    success(response) {
      //保存到内存
      obj.success && obj.success(response);
    }
  })
}
//测试信息调取
function loginTest() {
  var Token =  wx.getStorageSync('Token');
  // console.log(Token);
  //获取code
  wx.login({
    success: function (loginRes) {
      // 将code传到后台，并换取后台自定义的用户登录态标识
      wx.$request({
        url: '/WeMinProLogin/Login',
        data: {
          code: loginRes.code
        },
        UV:true,
        success(res) {
          saveUserInfo(res);
        },
        fail(res){
          saveUserInfo(res,{
            success:function(){
              // 进入登陆页
              wx.reLaunch({
                url: "/pages/tabBar/login"
              })
            }
          })
        }
      })
    }
  });
}
export { loginTest as default}