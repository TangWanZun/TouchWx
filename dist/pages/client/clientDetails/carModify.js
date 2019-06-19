// pages/client/clientDetails/carModify.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //用于控制到达位置
        tapItemShow: 'A01',
        //表示数据
        formData: {}
    },
    /**
     * 非页面变量
     */
    carId: 0,
    /**
     * tap选择
     */
    tapItemSelect(e) {
        this.setData({
            tapItemShow: e.currentTarget.dataset.key,
        })
    },
    /**
     * 进入车型选择
     */
    carStyle() {
        wx.navigateTo({
            url: '/pages/client/carStyleSelect',
        })
    },
    /**
     * 车型设置回调
     */
    onSetCarStyle(item) {
        console.log(item);
        this.setData({
            "formData.CarBrandCode": item.CarBrandCode,
            "formData.CarBrandName": item.CarBrandName,
            "formData.CarSerCode": item.CarSerCode,
            "formData.CarSerName": item.CarSerName,
            "formData.CarStyleCode": item.Code,
            "formData.CarStyleName": item.Name
        })
    },
    /**
     * 点击修改页面信息
     */
    inputSelect(e) {
        let key = e.currentTarget.dataset.key;
        let value = e.detail.value
        this.setData({
            [key]: value
        })
    },
    /**
     * 提交信息
     */
    submit() {
        console.log(this.data.formData);
        wx.showLoading({
            title: '数据提交中',
            mask: true
        })
        wx.$request({
            url: "/WeMinProPlatJson/Submit",
            data: {
                docType: 'Ocrd',
                actionType: 'SubmitOCar',
                docId: this.carId,
                docJson: JSON.stringify(this.data.formData),
            },
            success(res) {
                console.log(res);
                wx.showToast({
                    title: '信息修改成功',
                })
            },
            complete(){
                wx.hideLoading()
            }
        })
    },
    /**
     * 加载数据
     */
    getData() {
        let _this = this;
        wx.showLoading({
            title: '数据加载中',
            mask: true
        })
        wx.$request({
            url: "/WeMinProPlatJson/GetDataSet",
            data: {
                docType: 'Ocrd',
                actionType: 'OCarDetails',
                docId: this.carId,
            },
            success(res) {
                console.log(res.Table[0])
                _this.setData({
                    formData: res.Table[0]
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
        this.carId = options.id;
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