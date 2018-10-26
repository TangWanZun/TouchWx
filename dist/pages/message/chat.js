// pages/message/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入框中是否存在内容
    inputCon:false,
    voiceBtn:{
      CONST_I:{
        HINT_OUT: "按住说话",
        HINT_IN: "左滑取消发送",
        HINT_DEL: "松开取消发送",
      },
      //语音功能是否被打开
      functionUnfoldShow:false,
      //按钮是否被按下
      btnStart: false,
      //手指是否位于删除位置
      isDelete:false,
      hint:"按住说话",
    }
  },
  /**
   * 输入框输入内容是
  */
  bindInput:function(e){
    // 改变发送按钮颜色
    this.setData({
      inputCon: e.detail.value.length > 0
    })
  },
  /**
   * 语音功能开关 
  */
  voiceInShow:function(){
    this.setData({
      'voiceBtn.functionUnfoldShow': !this.data.voiceBtn.functionUnfoldShow
    })
  },
  /**
   * 开始点击语音按钮
  */
  voiceTouchstart:function(){
    //改变状态为按钮被按下
    //改变提示语句
    this.setData({
      'voiceBtn.btnStart':true,
      'voiceBtn.hint': this.data.voiceBtn.CONST_I.HINT_IN
    })
  },
  /**
   * 点击移动时
  */
  voiceTouchmove:function(e){
    let voiceConfig = this.data.voiceBtn;
    let pageX = e.touches[0].pageX;
    if (pageX <= 100 && !voiceConfig.isDelete){
      //当pageX(x轴)小于100默认为移动到了删除位置
      //判断如果当不是删除高亮时，才运行下面代码
      //改变提示语句
      //删除位置高亮
      this.setData({
        'voiceBtn.hint': voiceConfig.CONST_I.HINT_DEL,
        'voiceBtn.isDelete': true,
      })
    } else 
    //否则依旧为发送位置
    //判断如果当前是高亮的时候才会运行下面代码
      if (pageX > 100&&voiceConfig.isDelete){
      //改变提示语句
      //解除高亮
      this.setData({
        'voiceBtn.hint': voiceConfig.CONST_I.HINT_IN,
        'voiceBtn.isDelete': false,
      })
    }
  },
  /**
   * 结束点击语音按钮
  */
  voiceTouchend:function(){
    //改变状态为按钮被松开
    //改变提示语句
    this.setData({
      'voiceBtn.btnStart': false,
      'voiceBtn.hint': this.data.voiceBtn.CONST_I.HINT_OUT,
      //删除按钮取消高亮
      'voiceBtn.isDelete': false,
    })
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