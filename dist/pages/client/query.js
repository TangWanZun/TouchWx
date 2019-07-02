// pages/client/query.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        selectBodyShow: true,
        //是否需要显示暂无信息
        isSelect: false,
        //是否显示正在查找中
        isLoading: false,
        //图片数据
        imgUrl: getApp().privateData.configUrl.imgUrl
    },
    /**
     * 输入框查询
     */
    queryTime:0,
    queryInput: function(event) {
        //当输入框值出现变化的时候，我们就开始loading
        if(!this.data.isLoading){
            //开始查询
            this.setData({
                dataList: [],
                isLoading: true,
                isSelect: false,
            })
        }
        //当停顿超过1.5秒的时候才开始进行查询
        clearTimeout(this.queryTime);
        this.queryTime = setTimeout(()=>{
            this.query(event.detail.value);
        },1500)
    },
    /**
     * 开始查询
     */
    query(value) {
        let _this = this;
        if (value.length !== 0) {
            wx.$request({
                url: "/WeMinProRegisterUser/GetWeiXinRegisterUserList",
                data: {
                    searchv: value,
                    start: 0,
                    limit: 25,
                },
                success(res) {
                    _this.setData({
                        dataList: res,
                        isSelect: res.length === 0
                    })
                },
                complete() {
                    _this.setData({
                        isLoading: false,
                    })
                }
            })
        }else{
            this.setData({
                isLoading: false,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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