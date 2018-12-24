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
        //保存Token信息持久化
        wx.setStorage({
                key: 'Token',
                data: res.Token,
                success(response) {
                        //保存到内存
                        obj.success && obj.success(response);
                }
        });
        //当全部信息获取之后,调用加载滞留池中的方法
        getApp().privateData.loadRetention.forEach(getApp().loadInfo);
}
//测试信息调取
function loginTest() {
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
                                        wx.showModal({
                                                title: '登录以过期',
                                                content: '点击确定重新登录',
                                                showCancel: false,
                                                success(resin) {
                                                        if (resin.confirm) {
                                                                //记录当前登录状态
                                                                saveUserInfo(res, {
                                                                        success: function() {
                                                                                // 进入登陆页
                                                                                wx.reLaunch({
                                                                                        url: "/pages/tabBar/login"
                                                                                })
                                                                        }
                                                                })
                                                        }
                                                }
                                        })
                                }
                        })
                }
        });
}
export {
        loginTest as
        default
}