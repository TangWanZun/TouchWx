// pages/user/login.js
// import login from '../user/login.js';
import login from '../../library/sdk/login.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //是否使用账号密码登陆
        accountShow: true,
        //验证码系统
        codeObj: {
            codeTextOut: "验证码",
            COUNT_DOWN_TIME: 30,
            isCountDown: false,
            codeText: "验证码",
            NEW_TIME: 30,
            // TIME_CONST:0
        },
        /**
         * 第一页签登录是否禁用
         */
        disabledOne: true,
        /**
         * 第二页签登录是否禁用
         */
        disabledTow: true,
    },
    /**
     * 上传信息
     */
    formData: {
        phone: "",
        code: "",
        user: "",
        pass: ""
    },
    /**
     * 第一页签登录开启验证
     */
    bindblurOne() {
        var data = this.formData;
        if (data.phone.length == 11 && data.code.length == 6) {
            this.setData({
                disabledOne: false,
            })
        } else {
            this.setData({
                disabledOne: true,
            })
        }
    },
    /**
     * 第二页签登录开启验证
     */
    bindblurTow() {
        var data = this.formData;
        if (data.user.length > 1 && data.pass.length >= 4) {
            this.setData({
                disabledTow: false,
            })
        } else {
            this.setData({
                disabledTow: true,
            })
        }
    },
    //手机input
    bindinputPhone(res) {
        this.formData.phone = res.detail.value;
        this.bindblurOne();
    },
    //验证码input
    bindinputCode(res) {
        this.formData.code = res.detail.value;
        this.bindblurOne();
    },
    //用户名
    bindinputUser(res) {
        this.formData.user = res.detail.value;
        this.bindblurTow();
    },
    //密码
    bindinputPass(res) {
        this.formData.pass = res.detail.value;
        this.bindblurTow();
    },
    /**
     * 登陆方式切换
     */
    loginEx: function () {
        this.setData({
            accountShow: !this.data.accountShow
        })
    },
    /**
     * 发送验证码
     */
    sendCode: function () {
        if (!this.data.codeObj.isCountDown) {
            var _this = this;
            wx.showLoading({
                title: '正在发送验证码',
                mask: true
            })
            wx.$request({
                url: "/WeMinProLogin/SendVerifCode",
                data: {
                    phone: this.formData.phone
                },
                // UV: true,
                success(res) {
                    wx.showToast({
                        icon: "none",
                        title: '验证码发送成功'
                    })
                    //开启倒计时
                    var TIME_CONST = setInterval(function () {
                        let obj = _this.data.codeObj;
                        if (obj.NEW_TIME <= 0) {
                            //倒计时结束
                            _this.setData({
                                'codeObj.isCountDown': false,
                                'codeObj.codeText': obj.codeTextOut,
                                'codeObj.NEW_TIME': obj.COUNT_DOWN_TIME,
                            });
                            clearInterval(TIME_CONST);
                        } else {
                            //倒计时进行中
                            _this.setData({
                                'codeObj.NEW_TIME': obj.NEW_TIME - 1,
                                'codeObj.codeText': `${obj.NEW_TIME - 1}S`,
                            });
                        }
                    }, 1000);
                    _this.setData({
                        'codeObj.isCountDown': true,
                        // 'codeObj.TIME_CONST': TIME_CONST,
                    });
                },
                fail(res) {
                    console.log("fail", res)
                    wx.showModal({
                        title: "系统提示",
                        content: res.msg,
                        showCancel: false,
                        // success(res) {
                        //     if (res.confirm) {
                        //         mepara.failCall(result.data);
                        //     }
                        // }
                    })
                },
                complete() {
                    wx.hideLoading();
                }
            })

        }
    },

    /**
     * 登陆
     * 全部信息上传
     */
    login: function (res) {
        // console.log(JSON.stringify(res))
        if (!res.detail.encryptedData) {
            wx.showModal({
                title: '系统提示',
                showCancel: false,
                content: '本小程序为内部员工使用，为了保障正常使用小程序，请允许微信授权',
            })
            return;
        }
        let logtype = res.currentTarget.dataset.logtype;
        // console.log({
        //     UserCode: logtype === "code" ? this.formData.user : "",
        //     Psw: logtype === "code" ? this.formData.pass : "",
        //     Phone: logtype === "phone" ? this.formData.phone : "",
        //     VerifCode: logtype === "phone" ? this.formData.code : "",
        //     Iv: res.detail.iv,
        //     EncryptedData: res.detail.encryptedData
        // })
        wx.showLoading({
            title: '正在登录',
            mask: true
        })
        wx.$request({
            url: '/WeMinProLogin/ReLogin',
            data: {
                UserCode: logtype === "code" ? this.formData.user : "",
                Psw: logtype === "code" ? this.formData.pass : "",
                Phone: logtype === "phone" ? this.formData.phone : "",
                VerifCode: logtype === "phone" ? this.formData.code : "",
                Iv: res.detail.iv,
                EncryptedData: res.detail.encryptedData,
            },
            isErrorShow:false,
            // UV: true,
            success(res) {
                // console.log("success", res);
                //表示当前用户没有注册
                if (!res.IsRegister) {
                    wx.showModal({
                        title: "系统提示",
                        content: "当前用户未注册",
                        showCancel: false,
                        // success(res) {
                        //     if (res.confirm) {
                        //         mepara.failCall(result.data);
                        //     }
                        // }
                    })
                    return
                }
                //将个人信息保存到内存
                getApp().privateData.loginInfo = res;
                //登陆成功
                // redirectTo switchTab
                //重新获取权限数据
                login.getUX({
                    complete() {
                        wx.redirectTo({
                            url: "/custom-tab-bar/index",
                        })
                    }
                })
            },
            fail(res) {
                console.log("fail", res)
                wx.showModal({
                    title: "系统提示",
                    content: res.msg,
                    showCancel: false,
                    // success(res) {
                    //     if (res.confirm) {
                    //         mepara.failCall(result.data);
                    //     }
                    // }
                })
            },
            complete() {
                wx.hideLoading();
            }
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