// pages/client/clientDetails/coupon.js
import { toDateTime } from '../../../library/sdk/util.js'
Page({

        /**
         * 页面的初始数据
         */
        data: {
                formList: [],
                formData:{},
                isShow: false,
                //客户openId
                openId: ''
        },
        /**
         * 顶部选择转化
         */
        topTypeSelect(e) {
                this.setData({
                        selectTopType: e.currentTarget.dataset.key
                })
                //重新加载数据
                this.getData();
        },
        /**
         * 加载组件
         */
        myLlbox: {},
        /**
         *      点击每个券,用来打开或者收起说明
         */
        tapItem(e) {
                let index = e.currentTarget.dataset.index;
                this.setData({
                        [`formList[${index}]._isShow`]: !this.data.formList[index]._isShow
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.setData({
                        openId: options.openId
                })
                //获取自定义组件
                this.myLlbox = this.selectComponent('#myLlbox');
                this.getData();
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
                this.getData();
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {
                this.myLlbox.request();
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {
        },
        /**
         * 获取数据
         */
        getData() {
                //首先清空数据
                this.setData({
                        formList: []
                })
                var _this = this;
                //获取可用积分与累计积分
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'Ocrd',
                                actionType: 'BalanceSum',
                                needTotal: false,
                                docId: this.data.openId
                        },
                        success(res) {
                                _this.setData({
                                        formData: res[0] || []
                                })
                        },
                        complete(res) {
                                wx.stopPullDownRefresh();
                        }
                });
                //获取储值历史
                this.myLlbox.init({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'Ocrd',
                                actionType: 'BalanceList',
                                needTotal: false,
                                docId: this.data.openId
                        },
                        success(res) {
                                //对数据进行处理
                                for (let x of res) {
                                        x._isShow = false;
                                        x._date = toDateTime(x.Date)
                                }
                                _this.setData({
                                        formList: _this.data.formList.concat(res)
                                })
                        },
                        complete(res) {
                                wx.stopPullDownRefresh();
                        }
                });
        }
})