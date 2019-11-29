/**
 * 用与接受类内部事件
 * _onReconnectFail：当重连失败的时候
 */
export default function(url, {
  success
}) {
  //当前访问的ws的url
  this.url = url;
  //当前websocket对象
  let ws;
  //用于存放全部的接收器的地方
  let receiverList = {};
  // 心跳包名称
  let HEARTBEAT_NAME = "Heartbeat";
  //心跳时间间隔
  let HEARTBEAT_TIME = 60000;
  //心跳超时时间：超时之后就会重连
  let HEARTBEAT_ERROR_TIME = 5000;
  //心跳时间缓动时间数据
  let HEARTBEAT_TIME_CONST;
  //当前重连次数
  let RECONNECT_COUNT = 0;
  //最大重连次数
  let RECONNECT_MAX_COUNT = 5;

  //初始化当前连接
  init();

  /**
   * ======================================
   * 私有属性与方法
   * ======================================
   */


  /**
   * 发送一个控制台警告
   * @param funName   发出警告的方法名称
   * @param str   警告内容 
   */
  function consoleWarn(funName, str) {
    console.warn(`WsBroadcast-${funName}:${str}`);
  }

  /**
   * 发送一个控制台错误
   * @param funName   发出警告的方法名称
   * @param str   警告内容 
   */
  function consoleErroe(funName, str) {
    console.error(`WsBroadcast-${funName}:${str}`);
  }



  /**
   * 初始化
   */
  function init() {
    // 建立一个websocket连接
    ws = wx.connectSocket({
      url: url
    })
    //当ws成功连接的时候
    ws.onOpen((e) => {
      wsOnopen(e);
    })
    //当ws获取到消息的时候
    ws.onMessage((e) => {
      wsOnmessage(e)
    })

    //当ws出现错误的时候
    ws.onError((e) => {
      wsOnerror(e)
    })

    //当ws关闭的时候
    ws.onClose(function(e) {
      console.log("ws关闭",e)
    })
  }

  /**
   * 当获得了ws对象连接成功的时候
   * @param e 获取的event对象
   */
  function wsOnopen(e) {
    console.log("%cWebSocket连接成功", "color: #008632; font-size: 25px;font-weight: bold");
    console.table({
      "连接地址": url
    })
    //重置状态
    resetState()
    //启动心跳重连
    startHeartbeat();
    //回调链接成功
    success(e);
  }

  /**
   * 当获得了ws对象获得消息的时候
   * @param e 获取的event对象
   */
  function wsOnmessage(e) {
    // debugger
    // console.log('接受数据', e)
    let response = JSON.parse(e.data)
    // console.log(response,123123)
    let eventName = response.ServiceType;
    let data = response.Data
    let receiverArray = receiverList[eventName];
    if (receiverArray) {
      //存在当前接收者的时候,将全部信息分发给对应的接收者
      for (let item of receiverArray) {
        item(data);
      }
    } else {
      consoleWarn('wsOnmessage', `当前无名称为${eventName}的接收者`);
    }
  }


  /**
   * 当ws连接出现错误的时候
   * @param e 
   */
  function wsOnerror(e) {
    consoleErroe("wsOnerror", e);
    //启动断线重连
    reconnect();
  }


  /**
   * 发送信息
   * @param typeName 
   * @param data 
   */
  function send(data) {
    if (!ws) {
      consoleWarn("sendReceiver", "当前WebSocket还未启动或者已经关闭");
      return
    }
    ws.send({
      data: data
    })
  }

  /**
   * 创建一个发送对象
   * @param typeName 
   * @param data 
   */
  function createSendObj(typeName, data) {
    return JSON.stringify(Object.assign({
      ServiceType: typeName,
    }, data))
  }

  /**
   * 创建一个接受对象并对外调用
   * 通常这个对象是用来处理本类对外相应的方法，而不是ws的相应
   */
  function createResObj(typeName, data = {}) {
    wsOnmessage(this, {
      data: JSON.stringify({
        ServiceType: typeName,
        Data: data,
      })
    })
  }

  /**
   * 数据重置
   */
  function resetState() {
    //重置重连次数
    RECONNECT_COUNT = 0;
    //清空心跳包
    _removeReceiverType(HEARTBEAT_NAME);
  }


  /**
   * 用来启动心跳包
   * 首先我们发送一个心跳包
   * 我们要求在一定时间之内需要获取服务器返回的心跳回应
   * 这里如果超过了一定时间中还没有返回信息，我们就判断当前连接断开了 就会启动重连
   * 获得心跳回应之后，我们会在一定时间后再发一个心跳包'
   */
  function startHeartbeat() {
    //接受服务器心跳反馈
    let pongReceiver = () => {
      //返回之后，就清除错误倒计时
      clearTimeout(HEARTBEAT_TIME_CONST)
      setTimeout(() => {
        //继续进行心跳
        sendPing();
      }, HEARTBEAT_TIME)
    }
    _registerReceiver(HEARTBEAT_NAME, pongReceiver)
    //心跳发送
    let sendPing = () => {
      // console.log('发送心跳包');
      send(createSendObj(HEARTBEAT_NAME));
      HEARTBEAT_TIME_CONST = setTimeout(() => {
        //超过了一定时间了，我们就报错了应该
        consoleWarn('startHeartbeat', '当前连接断开，正在尝试重连');
        //删除当前的心跳监听
        _removeReceiver(HEARTBEAT_NAME, pongReceiver);
        //启动重连
        reconnect();
      }, HEARTBEAT_ERROR_TIME);
    }
    //开始心跳
    sendPing()
  }

  /**
   * 断线重连
   */
  function reconnect() {
    if (RECONNECT_COUNT >= RECONNECT_MAX_COUNT) {
      //当重连次数超过最大次数的时候，这个时候，就彻底断线了，需要用户手动刷新
      // RECONNECT_COUNT = 0;
      createResObj("_onReconnectFail");
      consoleErroe('reconnect', `当前websocket已经掉线`);
      return;
    }
    RECONNECT_COUNT++;
    consoleWarn('reconnect', `正在进行第次${RECONNECT_COUNT}重连`);
    //尝试重新启动
    init();
  }

  /**
   * 向服务器发送一个对象——内部使用
   * @param typeName 
   * @param data 
   */
  function _sendObj(typeName, data = {}) {
    send(createSendObj(typeName, data))
  }

  /**
   * 注册一个接收器——内部使用
   * @param typeName  接收服务器类型名称
   * @returns {Object} receiver 接收器对象
   * @returns {Object} promise 异步回调
   */
  function _registerReceiver(typeName, callback) {
    //接收器容器
    if (typeof receiverList[typeName] == "undefined") {
      receiverList[typeName] = [];
    }
    receiverList[typeName].push(callback);
  }

  /**
   * 删除某个接收器——内部使用
   * @param typeName 接收服务器类型名称
   * @param receiver 
   */
  function _removeReceiver(typeName, receiver) {
    let receiverArray = receiverList[typeName];
    if (typeof receiverArray == "undefined" || receiverArray.length == 0) {
      consoleWarn('removeReceiver', `${typeName}类型中的接收器为空`);
      return
    }
    let index = receiverArray.indexOf(receiver);
    if (index > -1) {
      receiverArray.splice(index, 1);
    }
  }

  /**
   * 删除一个接受者的全部类型
   * @param typeName 
   */
  function _removeReceiverType(typeName) {
    let receiverArray = receiverList[typeName];
    if (typeof receiverArray == "undefined" || receiverArray.length == 0) {
      consoleWarn('removeReceiver', `${typeName}类型中的接收器为空`);
      return
    }
    delete receiverList[typeName]
  }


  /**
   * =================================
   * 公共方法
   * =================================
   */

  /**
   * 向服务器发送一个对象
   * @param typeName 
   * @param data 
   */
  function sendObj(typeName, data) {
    if ([HEARTBEAT_NAME].indexOf(typeName) > -1) {
      consoleWarn("sendReceiver", `${typeName}为关键字，不能使用`);
      return
    }
    _sendObj(typeName, data);
  }

  /**
   * 注册一个接收器
   * @param typeName  接收服务器类型名称
   * @returns {Object} receiver 接收器对象
   * @returns {Object} promise 异步回调
   */
  function registerReceiver(typeName, callback) {
    if ([HEARTBEAT_NAME].indexOf(typeName) > -1) {
      consoleWarn("registerReceiver", `${typeName}为关键字，不能使用`);
      return
    }
    _registerReceiver(typeName, callback);
  }

  /**
   * 删除某个接收器
   * @param typeName 接收服务器类型名称
   * @param receiver 
   */
  function removeReceiver(typeName, receiver) {
    if ([HEARTBEAT_NAME].indexOf(typeName) > -1) {
      consoleWarn("removeReceiver", `${typeName}为关键字，不能使用`);
      return
    }
    _removeReceiver(typeName, receiver)
  }

  /**
   * 当断线重连失败的时候
   */
  function onReconnectFail(callback) {

  }

  /**
   * 断开当前websocket连接
   */
  function close() {
    //重置状态
    // resetState();
    if (ws) {
      ws.close();
      // wx.closeSocket()
    }
  }

  /**
   * 重新连接
   */
  function reset() {
    //首先断开连接
    close();
    //然后重新连接
    init();
  }

  /**
   * =================================
   * 返回数据
   * =================================
   */
  this.reset = reset;
  this.close = close;
  this.onReconnectFail = onReconnectFail;
  this.removeReceiver = removeReceiver;
  this.registerReceiver = registerReceiver;
  this.sendObj = sendObj;
}