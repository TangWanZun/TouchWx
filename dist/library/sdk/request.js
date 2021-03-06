import login from './login.js';
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
 * Boolean loading:是否需要显示头部loading加载环 默认为true
 * 
 */

var Token = wx.getStorageSync('Token');

function consoleError(property, src) {
    console.error(`wx.$request:${property}:${src}`);
}

function $request(para) {
    //表示Complete是否可以被执行，
    //当出现了登录用户失效的情况下Complete是不能执行的，因为当前请求再业务上没有完成
    //这时候，系统就会自动获取登录用户，直到成功之后，Complete才可以执行
    let isComplete = true;
    let privateData = getApp().privateData;
    let mepara = {
        url: para.url || undefined,
        headerType: para.headerType||"application/x-www-form-urlencoded",
        UV: para.UV || false,
        //当失败的时候，是否不将信息加入队列
        NRR: para.NRR || false,
        //这里将其反过来是因为,如果传入值为false,则最终结构就变成了true
        loading: (!para.loading) || false,
        //是否显示错误信息
        isErrorShow:typeof para.isErrorShow != "boolean"?true:para.isErrorShow,
        data: para.data || {},
        success: para.success || function() {},
        fail: para.fail || function() {},
        //出现错误时 点击model的确定时进行的回调
        failCall: para.failCall || undefined,
        complete: para.complete || function() {},
    };
    //判断url是否存在，不存在则报错
    if (!mepara.url) {
        consoleError('url', 'url为必填项');
        return;
    }
    // console.log(privateData.loginInfo);
    //若是为非越权请求并且当前没有获得用户身份,则此请求需要进入请求滞留池中，等待获取用户身份
    if (!para.UV && typeof privateData.loginInfo === 'undefined') {
        privateData.requestRetention.push(para);
        return;
    }
    let defaultheader = {
        // 'content-type': 'application/json', // 默认值
        'Content-type': mepara.headerType,
        'Cookie': privateData.Token || Token
    };

    // let loadingShow = false;
    //判断当前用户数据不存在,则视为未登陆状态需要
    // if (typeof privateData.loginInfo === 'undefined') {
    //     //在当前页面显示login
    //     wx.showLoading({
    //         title: '加载中',
    //         mask: true,
    //     });
    //     loadingShow = true;
    // } else {
        //判断当前请求是否需要添加loading
        if (!mepara.loading) {
            wx.showNavigationBarLoading()
        }
    // }

    wx.request({
        url: `${privateData.configUrl.url}${mepara.url}`,
        data: mepara.data || {},
        header: defaultheader,
        // header: {
        //   'Content-type': 'application/x-www-form-urlencoded',
        //   'Cookie': 'RedisSessionId=3f78daa1bc2142c8bce7c369c79f7b1d'
        // },
        dataType: "json",
        method: mepara.method || 'POST',
        success: function(res) {
            // console.log('rse',res);
            if (res.statusCode == 200 || res.statusCode == 500) {
                let result = res.data;
                if (result.success) {
                    //当当前用户登录失效时
                    if (result.code == 120) {
                        //将当前信息加入队列
                        if (!mepara.NRR){
                            privateData.requestRetention.push(para);
                        }
                        //正常情况下
                        // wx.showToast({
                        //     title: '当前登录用户已失效，正尝试重新登录',
                        //     icon: 'loading',
                        // })
                        //当走到这里的时候，即便是退出了也会跳转到complete 
                        //但是因为这里数据登录失效的，不属于错误也不属于正确  所以complete是不能执行的
                        isComplete = false
                        //获取用户登录信息
                        login.init();
                        return;
                    }
                    mepara.success && mepara.success(result.data);
                } else {
                    //有时候success为false但是没有msg的回调,例如登录失败，这个时候需要在调用当前接口的位置下给予一个错误回调
                    if (result.msg) {
                        //当存在failCall时候,启动错误回调
                        if (mepara.failCall) {
                            wx.showModal({
                                title: "系统提示",
                                content: result.msg,
                                showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        mepara.failCall(result.data);
                                    }
                                }
                            })
                        } else {
                            // wx.hideLoading();
                            //正常情况下
                            mepara.isErrorShow&&wx.showToast({
                                title: result.msg,
                                icon: 'none',
                                duration: 2500
                            })
                        }
                    }
                    mepara.fail && mepara.fail(result);
                }
            }
        },
        fail: function(error) {
            console.log(error);
            mepara.fail(error);
        },
        complete: function(response) {
            //隐藏加载loding
            //判断当前请求是否需要删除loading
            if (!mepara.loading) {
                wx.hideNavigationBarLoading();
            }
            // if (loadingShow) {
            //     wx.hideLoading();
            //     loadingShow = false;
            // }
            if (isComplete){
                //当Complete可以执行的时候
                mepara.complete && mepara.complete(response.data.data);
            }
        }
    })
}

export {
    $request as
    default
}