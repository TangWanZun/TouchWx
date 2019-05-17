//保存用户信息
function saveUserInfo(res, obj = {}) {
    // console.log("success", res);
    let privateData = getApp().privateData;
    //将Token保存到内存
    privateData.Token = res.Token;
    //将个人信息保存到内存
    privateData.loginInfo = res.LoginInfo;
    //当用户连接上时，发送重新发送滞留消息
    privateData.requestRetention.forEach(wx.$request);
    //清空滞留消息
    privateData.requestRetention.length = 0;
    //取消登录状态
    loginObj.isLogin = false
    //保存Token信息持久化
    wx.setStorage({
        key: 'Token',
        data: res.Token,
        success(response) {
            //保存到内存
            obj.success && obj.success(response);
        }
    });
    //加载权限
    // wx.$request({
    //     url: "/WeMinProPlatJson/GetList",
    //     NRR: true,
    //     data: {
    //         docType: 'Main',
    //         actionType: 'Permission',
    //         needTotal: false,
    //     },
    //     success(res) {
    //         let list = [];
    //         //对配置信息进行处理
    //         for (let x of res) {
    //             list[x.ActionType] = x.Permission;
    //         }
    //         //将配置信息保存
    //         privateData.UXList = list
    //     },
    //     complete(res) {
    //         //当全部信息获取之后,调用加载滞留池中的方法
    //         getApp().privateData.loadRetention.forEach(getApp().loadInfo);
    //     }
    // })
    wx.$request({
        url: "/WeMinProPlatJson/GetList",
        NRR: true,
        data: {
            docType: 'Main',
            actionType: 'Permission',
            needTotal: false,
        },
        success(res) {
            let list = [];
            //对配置信息进行处理
            // for (let x of res) {
            //     list[x.ActionType] = x.Permission;
            // }
            //将配置信息保存
            privateData.UXList = [{
                "MenuId": "WeMinProClient",
                    "ActionList": {}
                },
                {
                    "MenuId": "WeMinProUser",
                    "ActionList": {}
                },
                {
                    "MenuId": "WeMinProWork",
                    "ActionList": {
                        "ConsumeRelease": true
                    }
                }
            ]
        },
        complete(res) {
            //当全部信息获取之后,调用加载滞留池中的方法
            getApp().privateData.loadRetention.forEach(getApp().loadInfo);
        }
    })
}
let loginObj = {
    //是否在获取登录状态中
    isLogin: false,
    //启动获取登录状态
    init() {
        //获取登录状态只能启动一次
        if (loginObj.isLogin) return
        //启动登录状态
        loginObj.isLogin = true
        // var Token =  wx.getStorageSync('Token');
        // console.log(Token);
        //获取code
        wx.login({
            success: function(loginRes) {
                // 将code传到后台，并换取后台自定义的用户登录态标识
                wx.$request({
                    url: '/WeMinProLogin/Login',
                    data: {
                        code: loginRes.code
                    },
                    UV: true,
                    success(res) {
                        saveUserInfo(res);
                    },
                    fail(res) {
                        console.log('系统错误', res)
                        //出现问题，暂停全部loading
                        wx.hideLoading()
                        saveUserInfo(res.data, {
                            success: function() {
                                // 进入登陆页
                                wx.reLaunch({
                                    url: "/pages/tabBar/login"
                                })
                            }
                        })
                        // wx.showModal({
                        //     title: '尚未登录',
                        //     content: '点击确定重新登录',
                        //     showCancel: false,
                        //     success(resin) {
                        //         if (resin.confirm) {
                        //             //记录当前登录状态
                        //             saveUserInfo(res.data, {
                        //                 success: function() {
                        //                     // 进入登陆页
                        //                     wx.reLaunch({
                        //                         url: "/pages/tabBar/login"
                        //                     })
                        //                 }
                        //             })
                        //         }
                        //     }
                        // })
                    }
                })
            }
        });
    }
}
//测试信息调取
function loginTest() {
    loginObj.init();
}
export {
    loginTest as
    default
}