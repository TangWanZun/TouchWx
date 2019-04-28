import {
    UX_TYPE,
    UX_NAME
} from "../../library/sdk/config.js"
import login from '../../library/sdk/login.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginInfo: {},
        formData: [],
        UX_TYPE: UX_TYPE,
        //是否存在核销权限
        hx_UX: UX_TYPE.NO_UX
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
     * 加载数据
     */
    getData() {
        let _this = this;
        wx.showLoading({
            title: '数据获取中',
            mask:true
        })
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
            },
            complete() {
                wx.stopPullDownRefresh();
                wx.hideLoading()
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getData();
        //这里会出现抢线程的问题，比如app的跳转早于这个页面
        let privateData = getApp().privateData;
        if (typeof privateData.loginInfo === 'undefined') {
            //运行
            login();
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        var _this = this;
        let appPrivateData = getApp().privateData;
        getApp().loadInfo(function() {
            _this.setData({
                loginInfo: appPrivateData.loginInfo,
                hx_UX: appPrivateData.UXList[UX_NAME.A01]
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

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
        this.getData()
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