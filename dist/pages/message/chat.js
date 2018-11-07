import {CHAT_TYPE} from '../../library/sdk/config.js'
// pages/message/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputCon: {
      //输入框中是否存在内容
      isValue: false,
      //用于清空input内容
      value: ""
    },
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl,
    //语音按钮
    voiceBtn: {
      CONST_I: {
        HINT_OUT: "按住说话",
        HINT_IN: "左滑取消发送",
        HINT_DEL: "松开取消发送",
      },
      //语音功能是否被打开
      functionUnfoldShow: false,
      //按钮是否被按下
      btnStart: false,
      //手指是否位于删除位置
      isDelete: false,
      hint: "按住说话",
    },
    //音频播放
    audio: {
      isPlay: false,
      playMsgId: -1,
    },
    //获取聊天类型
    CHAT_TYPE: CHAT_TYPE,
    //用于滚动到页面底部的
    intoView: "",
    //登陆数据
    loginInfo:{},
    dataList: [

    ]
  },
  /**========================================
   * 全局变量非setData型
   * ========================================
  */
  openid:null,
  /**========================================
   *  页面样式控制函数
   * ========================================
  */
  /**
   * 语音功能开关 
  */
  voiceInShow: function () {
    var bool = this.data.voiceBtn.functionUnfoldShow
    //滚动到页面底部
    //因为滚动速度快于语音展开，所以延时调用
    setTimeout(() => {
      !bool ? this.toBottom() : "";
    }, 300);
    this.setData({
      'voiceBtn.functionUnfoldShow': !bool
    })
  },
  /**========================================
   * 发送事件
   * ========================================
  */
  /**
   * 文本信息发送
  */
  sendText() {
    if (this.inputValue.length > 0) {
      this.chatSend({
        msgType: this.data.CHAT_TYPE.CHAT_TEXT,
        data: this.inputValue
      });
    }
    //清除input内容 发送键复原
    this.setData({
      'inputCon.value': '',
      'inputCon.isValue': false,
    })
    this.inputValue = "";
  },
  /**
   * 语音发送
  */
  sendRecord(res) {
    this.chatSend({
      msgType: this.data.CHAT_TYPE.CHAT_VOICE,
      duration: Math.round(res.duration / 1000),
      thumbnail: res.tempFilePath
    });
  },
  /**
   * 地理位置发送
  */
  sendLocation(res) {
    this.chatSend({
      msgType: this.data.CHAT_TYPE.CHAT_ADDS,
      addressName: res.name,
      addressDetails: res.address,
      latitude: res.latitude,
      longitude: res.longitude,
    });
  },
  /**
   * 图片发送
  */
  sendImage(res) {
    console.log(res);
    let forDom = res.tempFilePaths;
    for (let i = 0; i < forDom.length; i++) {
      this.chatSend({
        msgType: this.data.CHAT_TYPE.CHAT_IAMGE,
        thumbnail: forDom[i],
        mediaOriginal: forDom[i],
      });
    }
  },
  /*
  * 发送信息(包括语音图片等)
  */
  chatSend(pro) {
    var msg = {
      MsgId: 1,
      AddressDetails: pro.addressDetails || null,															//地理位置详情
      AddressName: pro.addressName || null,							//地理位置名称
      CardName: null,																 //真实姓名
      Duration: pro.duration || null,																	  //语音持续时间
      FromType: this.data.CHAT_TYPE.CHAT_RIGHT,					//聊天人身份
      Latitude: pro.latitude || null,																	//地理位置的维度
      Longitude: pro.longitude || null,																//地理位置的精度
      MediaOriginal: pro.mediaOriginal || null,																//图片初始图
      MsgData: pro.data || null,		                          //聊天内容
      MsgDate: new Date(),												//时间					
      MsgType: pro.msgType,																	//类型
      NickName: "",														//微信名称
      OpenId: this.openid,											//openid
      ProfilePhoto: this.data.loginInfo.ProfilePhoto,																//头像
      Thumbnail: pro.thumbnail || null,																	//缩略图
      UserCode: this.data.loginInfo.UserCode,																	//客服code
      UserName: this.data.loginInfo.UserName,																	//客服name
      WxId: "gh_40c534b93a9f"
    }
    wx.$request({
      url:"/WeMinProChatMessage/SendMsg",
      data: msg
    })
    this.data.dataList.push(msg);
    this.setData({
      dataList: this.data.dataList
    });
    //滚动到页面底部
    this.toBottom();
  },
  /**========================================
   * 页面聊天事件所需被调用函数
   * ========================================
  */
  /**
   * 滚动到页面底部
  */
  toBottom() {
    this.setData({
      intoView: this.data.dataList.length - 1
    })
  },
  /*
  *文本输入框内容
  */
  inputValue: "",
  /**
   * 输入框输入内容
  */
  bindInput: function (e) {
    // 改变发送按钮颜色
    this.setData({
      'inputCon.isValue': e.detail.value.length > 0,
    })
    //拿去文件数据
    this.inputValue = e.detail.value;
  },
  /**
   * 音乐停止
   * 当音乐正常关闭,或者页面发生跳转音乐强行关闭许运行的函数
  */
  audioStop() {
    var audio = this.createAudio();
    audio.isPlay = false;
    //将播放ID设置为-1 取消闪动
    this.setData({
      'audio.playMsgId': -1
    })
  },
  //录音单例
  record: undefined,
  /**
   * 录音事件单例模式
  */
  createRecord() {
    if (this.record) {
      return this.record;
    } else {
      this.record = wx.getRecorderManager()
      //开始录音时
      this.record.onStart(() => {
        console.log('录音开始')
      })
      //录音停止时
      this.record.onStop((res) => {
        console.log('录音停止', res);
      })
      //录音出现错误
      this.record.onError((res) => {
        if (this.record.isError) {
          return;
        }
        console.log("录音错误", res);
        var _record = this.record;
        _record.isError = true;
        //处理未授权
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.record']) {
              //未授权
              wx.showModal({
                title: '使用录音需要授权',
                content: '是否前往授权',
                showCancel: true,
                cancelText: '取消',
                confirmText: '前往授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                },
                complete(res) {
                  _record.isError = false;
                }
              })
            }
          }
        })
      })
      this.record.options = {
        duration: 10000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
        frameSize: 50
      }
      return this.record;
    }
  },
  //音频单例
  audio: undefined,
  /**
   * 音频事件单例模式
  */
  createAudio() {
    if (this.audio) {
      //取消开始音乐播放监听
      this.audio.offPlay();
      return this.audio
    } else {
      this.audio = wx.createInnerAudioContext();
      this.audio.isPlay = false;
      //音频播放出现错误
      this.audio.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode);
        //停止闪动
        this.audioStop();
      })
      //音乐停止事件
      this.audio.onStop((res) => {
        console.log('播放停止');
        this.audioStop()
      })
      //音频自然播放至停止
      this.audio.onEnded((res) => {
        console.log('播放结束');
        this.audioStop()
      })
      //音频因为数据不足，需要停下来加载时会触发
      this.audio.onWaiting((res) => {
        console.log('数据不足');
      })
      return this.audio;
    }
  },
  /**========================================
   * 页面聊天事件
   * ========================================
  */
  /**
   * 查看大图
  */
  showBigImage(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src]
    })
  },
  /**
   * 播放音频
  */
  playAudio(e) {
    //获取需要播放的msgid
    var id = e.currentTarget.dataset.msgid;
    //获取播放路径
    var src = e.currentTarget.dataset.src;
    var audio = this.createAudio();
    //当前为播放音频状态时且点击的为同一ID时，音频暂停
    if (audio.isPlay && id === this.data.audio.playMsgId) {
      audio.stop();
    } else {
      audio.src = src;
      audio.play();
    }
    audio.onPlay(() => {
      console.log('播放开始');
      this.audio.isPlay = true;
      //音频图片闪动
      this.setData({
        'audio.playMsgId': id
      })
    })
  },
  /**
   * 打开地图查看位置
  */
  openLocationFun(e) {
    var data = e.currentTarget.dataset;
    wx.openLocation({
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.name,
      address: data.address
    })
  },
  /**
   * 打开相册
  */
  chooseImageFun() {
    var _this = this;
    wx.chooseImage({
      success(res) {
        _this.sendImage(res);
      }
    })
  },
  /**
   * 选择位置
  */
  chooseLocationFun() {
    var _this = this;
    wx.chooseLocation({
      success(res) {
        _this.sendLocation(res);
      },
      fail(res) {
        //判断此接口是否授权
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userLocation']) {
              //未授权
              wx.showModal({
                title: '位置信息需要授权',
                content: '是否前往授权',
                showCancel: true,
                cancelText: '取消',
                confirmText: '前往授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  /**
   * 点击运行时间
  */
  TOUCH_TIME:0,
  /**
   * 开始点击语音按钮
  */
  voiceTouchstart: function () {
    var _this = this;
    //按键超过350毫秒才运行下面代码
    this.TOUCH_TIME = setTimeout(function(){
      //改变状态为按钮被按下
      var record = _this.createRecord();
      record.start(record.options);
      //改变提示语句
      _this.setData({
        'voiceBtn.btnStart': true,
        'voiceBtn.hint': _this.data.voiceBtn.CONST_I.HINT_IN
      })
    },350);
  },
  /**
   * 点击移动时
  */
  voiceTouchmove: function (e) {
    let voiceConfig = this.data.voiceBtn;
    let pageX = e.touches[0].pageX;
    if (pageX <= 100 && !voiceConfig.isDelete) {
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
      if (pageX > 100 && voiceConfig.isDelete) {
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
  voiceTouchend: function () {
    //当前点击时间低于350毫秒时,取消按钮开始事件
    clearTimeout(this.TOUCH_TIME);
    //停止语音录制
    var record = this.createRecord();
    //判断语音是在被什么状态下结束
    if (this.data.voiceBtn.isDelete) {
      //取消语音
      console.log('取消语音');
      record.onStop((res) => { })
    } else {
      //发送语音
      console.log('发送语音');
      record.onStop((res) => {
        console.log(res);
        //判断如果语音时间小于500毫秒则显示录音时间太短
        if (res.duration<=500){
          wx.showToast({
            icon:"none",
            title:"按键时间太短"
          });
          return;
        }
        //调用语音发送
        this.sendRecord(res)
      })
    }
    record.stop();
    //改变状态为按钮被松开
    //改变提示语句
    this.setData({
      'voiceBtn.btnStart': false,
      'voiceBtn.hint': this.data.voiceBtn.CONST_I.HINT_OUT,
      //删除按钮取消高亮
      'voiceBtn.isDelete': false,
    })

  },
  /**========================================
   * app事件函数
   * ========================================
  */
  /**
   * 获取数据
  */
  page: {
    start: 0,
    limit: 25
  },
  getData(dataReset = false) {
    //数据重置
    if (dataReset) {
      this.setData({
        dataList: [],
      })
      this.page.start = 0;
    }
    let _this = this;
    wx.$request({
      url: "/WeMinProChatMessage/GetChatList",
      data: {
        start: this.page.start,
        limit: this.page.limit,
        OpenId: this.openid
      },
      success(res) {
        if (res.data.length < _this.page.limit) {
          //数据以全部拉取完成
          _this.setData({
            pageOver: true
          })
        }
        /**
         * 这里需要整理数据
        */
        let meData = res.data;
        let newDate = new Date();
        for (let i = 0; i < meData.length; i++) {
          let date = new Date(meData[i].CreateDate);
          if (newDate.toDateString() === date.toDateString()) {
            //表示为今天
            meData[i].CreateDate = `${date.getHours()}:${date.getMinutes()}`;
          } else {
            //不为今天
            meData[i].CreateDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
        /*数据更新*/
        _this.setData({
          dataList: res.data.concat(_this.data.dataList)
        })
        _this.page.start += _this.page.limit;
      },
      complete() {
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.openid = options.openId
    //加载模拟数据
    this.getData(true);
    //暂时不得已的解决方法
    getApp().onLoading = function(){
      //获取登陆信息
      _this.setData({
        loginInfo: getApp().privateData.loginInfo
      })
    }
    getApp().onLoading();
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
    this.audioStop()
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
    this.getData();
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

  },
  /**
   * 模拟数据
  */
  modelData() {
    return [
      {//默认客户图片
        MsgId: 1,
        AddressDetails: null,															//地理位置详情
        AddressName: null,																//地理位置名称
        CardName: "典韦",																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Client",																//聊天人身份
        Latitude: null,																	//地理位置的维度
        Longitude: null,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "text",																	//类型
        NickName: "兔子只吃胡萝卜",														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: null,																	//缩略图
        UserCode: null,																	//客服code
        UserName: null,																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {//默认客户图片
        MsgId: 1,
        AddressDetails: null,															//地理位置详情
        AddressName: null,																//地理位置名称
        CardName: "典韦",																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Client",																//聊天人身份
        Latitude: null,																	//地理位置的维度
        Longitude: null,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "1",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "text",																	//类型
        NickName: "兔子只吃胡萝卜",														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: null,																	//缩略图
        UserCode: null,																	//客服code
        UserName: null,																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {//默认客服图片
        MsgId: 2,
        AddressDetails: null,															//地理位置详情
        AddressName: null,																//地理位置名称
        CardName: null,																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Server",																//聊天人身份
        Latitude: null,																	//地理位置的维度
        Longitude: null,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "请问需要什么帮助",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "text",																	//类型
        NickName: null,														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: null,																	//缩略图
        UserCode: null,																	//客服code
        UserName: '系统管理员',																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {
        MsgId: 3,
        AddressDetails: null,															//地理位置详情
        AddressName: null,																//地理位置名称
        CardName: "典韦",																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Client",																//聊天人身份
        Latitude: null,																	//地理位置的维度
        Longitude: null,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "image",																	//类型
        NickName: "兔子只吃胡萝卜",														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: 'http://img15.3lian.com/2015/f2/160/d/65.jpg',																	//缩略图
        UserCode: null,																	//客服code
        UserName: null,																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {
        MsgId: 4,
        AddressDetails: null,															//地理位置详情
        AddressName: null,																//地理位置名称
        CardName: null,																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Server",																//聊天人身份
        Latitude: null,																	//地理位置的维度
        Longitude: null,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "请问需要什么帮助",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "image",																	//类型
        NickName: null,														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "https://img.52z.com/upload/news/image/20171213/20171213124121_25664.jpg",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: 'http://www.imagewa.com/PhotoPreview/229/229_18760.jpg',																	//缩略图
        UserCode: null,																	//客服code
        UserName: '系统管理员',																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      //地理位置
      {
        MsgId: 5,
        AddressDetails: '北京市东城区体育馆路街道天安门广场',	//地理位置详情
        AddressName: '天安门广场',																//地理位置名称
        CardName: "典韦",																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Client",																//聊天人身份
        Latitude: 39.9037118881, 															//地理位置的维度
        Longitude: 116.3978290558,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "location",																	//类型
        NickName: "兔子只吃胡萝卜",														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: 'http://img15.3lian.com/2015/f2/160/d/65.jpg',																	//缩略图
        UserCode: null,																	//客服code
        UserName: null,																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {
        MsgId: 6,
        AddressDetails: '山东省济南市槐荫区淄博路与聊城路交叉口西北角济南西城实验初级中学',	//地理位置详情
        AddressName: '西城实验初级中学',																//地理位置名称
        CardName: null,																 //真实姓名
        Duration: null,																	  //语音持续时间
        FromType: "Server",																//聊天人身份
        Latitude: 36.6848711670,																//地理位置的维度
        Longitude: 116.9150018692,																//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "请问需要什么帮助",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "location",																	//类型
        NickName: null,														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "https://img.52z.com/upload/news/image/20171213/20171213124121_25664.jpg",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: 'http://www.imagewa.com/PhotoPreview/229/229_18760.jpg',																	//缩略图
        UserCode: null,																	//客服code
        UserName: '系统管理员',																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {
        MsgId: 7,
        AddressDetails: null,	//地理位置详情
        AddressName: null,																//地理位置名称
        CardName: "典韦",																 //真实姓名
        Duration: 1,																	  //语音持续时间
        FromType: "Client",																//聊天人身份
        Latitude: 36, 																	//地理位置的维度
        Longitude: 116,															//地理位置的精度
        MediaOriginal: null,																//图片初始图
        MsgData: "https://www.sap-unis.com/wxapp/#/news/index?wxid=gh_40c534b93a9f",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "voice",																	//类型
        NickName: "兔子只吃胡萝卜",														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: 'http://www.runoob.com/try/demo_source/horse.ogg',																	//缩略图
        UserCode: null,																	//客服code
        UserName: null,																	//客服name
        WxId: "gh_40c534b93a9f"
      },
      {
        MsgId: 8,
        AddressDetails: null,	                    //地理位置详情
        AddressName: null,																//地理位置名称
        CardName: null,																 //真实姓名
        Duration: 20,																	  //语音持续时间
        FromType: "Server",																//聊天人身份
        Latitude: null,																	//地理位置的维度
        Longitude: null,																//地理位置的精度
        MediaOriginal: null, amr: 11,															//图片初始图
        MsgData: "请问需要什么帮助",		//聊天内容
        MsgDate: "2018-10-12 12:45:54.000",												//时间					
        MsgType: "voice",																	//类型
        NickName: null,														//微信名称
        OpenId: "oS4HgskVQqtMvZ9IbB2d-k4GhcRA",											//openid
        ProfilePhoto: "https://img.52z.com/upload/news/image/20171213/20171213124121_25664.jpg",																//头像
        Rown: 7,																		//此消息位次
        Thumbnail: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46', mp3: 11,														//缩略图
        UserCode: null,																	//客服code
        UserName: '系统管理员',																	//客服name
        WxId: "gh_40c534b93a9f"
      },
    ]
  }
})