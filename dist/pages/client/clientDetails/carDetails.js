// pages/client/clientDetails/carDetails.js.js
import {
    util
} from '../../../library/sdk.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //图片数据
        imgUrl: getApp().privateData.configUrl.imgUrl,
        formData: {},
        dataList: {},
        carRecord: [],
        carImgList: []
    },
    /**
     * 加载组件
     */
    myLlbox: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取自定义组件
        this.myLlbox = this.selectComponent('#myLlbox');
        var _this = this;
        //加载绑定车辆数据
        wx.$request({
            url: "/WeMinProPlatJson/GetDataSet",
            data: {
                docType: 'Ocrd',
                actionType: 'CarDetails',
                needTotal: false,
                docid: options.openId,
                p1: options.carId
            },
            success(res) {
                //数据修改
                res.Table[0].MaintainDate = res.Table[0].MaintainDate ? util.toDate(res.Table[0].MaintainDate) : '暂无信息';
                res.Table[0].InsuranceDate = res.Table[0].InsuranceDate ? util.toDate(res.Table[0].InsuranceDate) : '暂无信息';
                _this.setData({
                    dataList: res.Table[0],
                    carImgList: res.Table1 || []
                })
            },
            complete() {}
        })
        //加载爱车履历
        // this.myLlbox.init({
        wx.$request({
            url: "/WeMinProPlatJson/GetList",
            data: {
                docType: 'Ocrd',
                actionType: 'CarRecordList',
                needTotal: false,
            },
            success(res) {
                // 这里需要对数据进行处理
                let arr = res[0] ? [res[0]] : [];
                for (let i = 1; i < res.length; i++) {
                    if (arr[arr.length - 1].PeriodYear == res[i].PeriodYear) {
                        arr[arr.length - 1].L1ItemName += `,${res[i].L1ItemName}`;
                    } else {
                        arr.push(res[i])
                    }
                }
                _this.setData({
                    carRecord: arr
                })
            }
        });
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
        // this.myLlbox.request();
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