// pages/user/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否使用账号密码登陆
    accountShow:false,
    //验证码系统
    codeObj:{
      codeTextOut: "获取验证码",
      COUNT_DOWN_TIME:30,
      isCountDown:false,
      codeText:"获取验证码",
      NEW_TIME:30,
      TIME_CONST:0
    }
  },
  /**
   * 登陆方式切换
  */
  loginEx:function(){
    this.setData({
      accountShow: !this.data.accountShow
    })
  },
  /**
   * 发送验证码
  */
  sendCode:function(){
    if (!this.data.codeObj.isCountDown){
      var _this = this;
      let TIME_CONST = setInterval(function(){
        let obj = _this.data.codeObj;
        if (obj.NEW_TIME<=0){
          //倒计时结束
          _this.setData({
            'codeObj.isCountDown': false,
            'codeObj.codeText': obj.codeTextOut,
            'codeObj.NEW_TIME': obj.COUNT_DOWN_TIME,
          });
          //清除计时器
          clearInterval(obj.TIME_CONST);
        }else{
          //倒计时进行中
          _this.setData({
            'codeObj.NEW_TIME': obj.NEW_TIME-1,
            'codeObj.codeText': `${obj.NEW_TIME-1}S`,
          });
        }
      },1000);
      //开启倒计时
      this.setData({
        'codeObj.isCountDown': true,
        'codeObj.TIME_CONST': TIME_CONST,
      });
    }
  },
  /**
   * 登陆
  */
  login:function(e){
    // console.log(e);
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})