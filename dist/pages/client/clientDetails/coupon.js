// pages/client/clientDetails/coupon.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                formList: [],
                isShow:false
        },
        /**
         * 加载组件
         */
        myLlbox: {},
        /**
         * 
         */
        tapItem(){
                this.setData({
                        isShow: !this.data.isShow
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                //获取自定义组件
                this.myLlbox = this.selectComponent('#myLlbox');
                // this.getData();
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {

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
                // this.getData();
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {
                this.myLlbox.request();
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {

        },
        /**
         * 获取数据
         */
        getData() {
                var _this = this;
                _this.data.formList = [];
                this.myLlbox.init({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'client',
                                actionType: 'Echat',
                                needTotal: false,
                        },
                        success(res) {
                                _this.setData({
                                        formList: _this.data.formList.concat(res)
                                })
                                console.log(res);
                        },
                        complete(res) {
                                wx.stopPullDownRefresh();
                        }
                });
        }
})