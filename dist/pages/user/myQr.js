// pages/user/myQr.js
import {
        configUrl,
} from '../../library/sdk.js'
Page({

        /**
         * 页面的初始数据
         */
        data: {
                imgUrl: configUrl.imgUrl,
                loginInfo: {},
                qrImg:'',
                //是否为绑定顾问
                canAttribute:true
        },
        /**
         * 数据加载
         */
        getData(refresh=false){
                //是否强制刷新refresh
                wx.$request({
                        url: '/WeMinProUserMain/GetSelfOrShareQrCode',
                        data:{
                                refresh: refresh
                        },
                        success: (res) => {
                                this.setData({
                                        qrImg: `${this.data.imgUrl}${res.QRCodeImg}?t=${new Date()}`,
                                        canAttribute: res.CanAttribute,
                                })
                        },
                        complete() {
                                wx.stopPullDownRefresh();
                        }
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                this.getData();
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                this.setData({
                        loginInfo: getApp().privateData.loginInfo
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {

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
                this.getData(true);
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