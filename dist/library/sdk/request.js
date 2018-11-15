//此接口为常用接口,将通过app wx的方式进行挂载
/**
 * para配置
 * String url:必填项,请求的地址
 * Function success(response):请求成功回调函数 response:回调内容
 * Function fail(response):请求失败回调函数 response:回调内容
 * Function complete(response):请求结束回调函数(成功或失败都会调用) response:回调内容
 * Object data:请求参数
 * Boolean UV:是否为越权请求 默认为false
 *      |- 越权请求为,可以在获取用户身份之前进行请求
 * 
*/
//获取cookie
var Token = wx.getStorageSync('Token');
function consoleError(property,src){
  console.error(`wx.$request:${property}:${src}`);
}
function $request(para) {
  let privateData = getApp().privateData;
  let mepara = {
    url: para.url || undefined,
    UV:para.UV||false,
    data: para.data||{},
    success: para.success || function () { },
    fail: para.fail || function () { },
    complete: para.complete||function(){},
  };
  //判断url是否存在，不存在则报错
  if (!mepara.url) {
    consoleError('url', 'url为必填项');
    return;
  }
  // console.log(privateData.loginInfo);
  //若是为非越权请求并且当前没有获得用户身份,则此请求需要进入请求滞留池中，等待获取用户身份
  if (!para.UV && typeof privateData.loginInfo === 'undefined'){
    privateData.requestRetention.push(para);
    return;
  }
  let defaultheader = {
    // 'content-type': 'application/json', // 默认值
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': privateData.Token || Token
  };
  //判断当前用户数据不存在,则视为未登陆状态需要
  if (typeof privateData.loginInfo === 'undefined'){
    //在当前页面显示login
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
  }else{
    wx.showNavigationBarLoading()
  }
  wx.request({
    url: `${privateData.configUrl.url}${mepara.url}`,
    data: mepara.data||{},
    header: defaultheader,
    dataType: "json",
    method: mepara.method||'POST',
    success: function (res) {
      if (res.statusCode == 200 || res.statusCode == 500) {
        let result = res.data;
        if (result.success) {
          mepara.success && mepara.success(result);
        } else {
          wx.showModal({
            title: "警告",
            content: result.msg,
            showCancel:false
          })
          mepara.fail && mepara.fail(result);
        }
      }
    },
    fail: function (response) {
      // console.log(response);
      // mepara.fail(response);
    },
    complete:function(response){
      //隐藏加载loding
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      mepara.complete&&mepara.complete(response.data);
    }
  })
}

export { $request as default}