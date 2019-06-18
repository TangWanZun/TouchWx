// pages/client/carStyleSelect.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        formList: []
    },
    /**
     * 加载组件
     */
    myLlbox: {},
    /**
     * 搜索框
     */
    queryInput(e){
        let value = e.detail.value;
        this.getData(value);
    },
    /**
     * 点击对应车型的时候
     */
    onTapItem(e){
        let item = this.data.formList[e.currentTarget.dataset.index];
        //控制首页页面刷新
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象 
            var prePage = pages[pages.length - 2];
            //关键在这里,这里面是触发上个界面的方法 
            prePage.onSetCarStyle(item);
            wx.navigateBack();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取自定义组件
        this.myLlbox = this.selectComponent('#myLlbox');
        this.getData();
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
        this.getData();
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
     * 数据获取
     */
    getData(query="") {
        //首先清空数据
        this.setData({
            formList: []
        })
        //获取储值历史
        this.myLlbox.init({
            url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'Combobx',
                actionType: 'CarStyle',
                needTotal: false,
                Query: query
            },
            success: res => {
                this.setData({
                    formList: this.data.formList.concat(res)
                })
            },
            complete(res) {
                wx.stopPullDownRefresh();
            }
        });
    },
})