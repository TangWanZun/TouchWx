Page({

        /**
         * 页面的初始数据
         */
        data: {
                loginInfo: {},
                formData: []
        },
        /**
         * 打开手机扫码
         */
        scanCode() {
                let _this = this;
                wx.scanCode({
                        scanType: ['qrCode'],
                        success(res) {
                                // 扫码返回成功跳转会员消费页面
                                wx.navigateTo({
                                        url: '/pages/user/work/cardCustomer?openId=' + res.result
                                });
                        },
                        fail() {

                        }
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {},

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                var _this = this;
                getApp().loadInfo(function() {
                        _this.setData({
                                loginInfo: getApp().privateData.loginInfo
                        })
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                let _this = this;
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'Main',
                                actionType: 'ReportList',
                                needTotal: false,
                        },
                        success(res) {
                                _this.setData({
                                        formData: res
                                })
                        }
                })
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function() {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {

        }
})