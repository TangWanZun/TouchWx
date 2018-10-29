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
function consoleError(property,src){
  console.error(`wx.$request:${property}:${src}`);
}
function $request(para) {
  let app = getApp();
  console.log(app);
  let privateData = app.privateData;
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
  //若是为非越权请求并且当前没有获得用户身份,则此请求需要进入请求滞留池中，等待获取用户身份
  if (!para.UV && typeof privateData.userInfo === 'undefined'){
    privateData.requestRetention.push(para);
    return;
  }
  wx.request({
    url: '',
    data: mepara.data||{},
    success: function (response) {
      console.log(response);
      var ponse = response.data;
      if (ponse.success) {
        mepara.success(ponse.Data);
      } else {
        // $tui.toast(ponse.msg);
        mepara.fail(ponse);
      }
    },
    fail: function (response) {
      console.log(response);
      mepara.fail(response);
    },
    complete:function(response){
      console.log(response);
      mepara.complete(response);
    }
  })
}

export { $request as default}