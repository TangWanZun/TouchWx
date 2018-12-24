import * as sdk from "../../library/sdk.js"
import {
        util,
        configUrl,
        toDate,
        timeParse
} from '../../library/sdk.js'
Page({
        /**
         * 页面的初始数据
         */
        data: {
                imgUrl: configUrl.imgUrl,
                //是否加载完毕
                isOver:false,
                workTypeData: [{
                                title: "救援",
                                iconUrl: "/assets/workType/WORK_JY.svg",
                                url: "/pages/work/workRescue"
                        },
                        //       {
                        //         title: "投诉",
                        //         iconUrl: "/assets/workType/WORK_TS.svg",
                        //         url: "/pages/work/workComplain"
                        //       },
                        {
                                title: "预约",
                                iconUrl: "/assets/workType/WORK_YY.svg",
                                url: "/pages/work/workMake"
                        },
                        {
                                title: "活动",
                                iconUrl: "/assets/workType/WORK_HD.svg",
                                url: "/pages/work/workActivity"
                        },
                        {
                                title: "到期",
                                iconUrl: "/assets/workType/WORK_DQ.svg",
                                url: "/pages/work/workExpire"
                        }
                ],
                workType: {},
                //数据列表
                dataList: []
        },
        /**
         * 加载数据
         */
        getData() {
                let _this = this;
                _this.setData({
                        isOver: false
                })
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'workData',
                                actionType: 'List',
                                needTotal: false,
                        },
                        success(res) {
                                //这里需要处理数据
                                for (let i = 0; i < res.length; i++) {
                                        //这里是预约,预约的时间使用的是end 和 start的时间
                                        if (res[i].DocType == 'A03') {
                                                if (res[i].CreateDate) {
                                                        res[i].CreateDate = util.toDate(res[i].ReserveEndDate)
                                                }
                                        } else {
                                                // 其他的使用的是createDate的时间
                                                if (res[i].CreateDate) {
                                                        res[i].CreateDate = util.toDate(res[i].CreateDate) + ' ' + util.timeParse(res[i].CreateDate)
                                                }
                                        }
                                        if (res[i].ReserveStartDate) {
                                                res[i].ReserveStartDate = util.toTime(res[i].ReserveStartDate)
                                        }
                                        if (res[i].ReserveEndDate) {
                                                res[i].ReserveEndDate = util.toTime(res[i].ReserveEndDate)
                                        }
                                }
                                _this.setData({
                                        dataList: res,
                                        isOver:true
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
                this.setData({
                        workType: sdk.WORK_TYPE
                })
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
                this.getData();
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

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {

        }
})