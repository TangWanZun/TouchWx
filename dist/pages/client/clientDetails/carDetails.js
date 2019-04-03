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
        carImgList: [],
        //行驶证信息（后台维护）
        xsCardImg: {
            orig: '',
            thum: ''
        },
        //行驶证信息（客户维护）
        xsCardImgUser: {
            orig: '',
            thum: ''
        },
       
    },
    /**
     * 加载组件
     */
    myLlbox: {},
    /**
     *页面加载数据
     */
    optionsCookie: {},
    /**
     * 用户上传证件回调
     */
    //是否为刚刚生成页面
    isLoadNew:true,
    leafletAddInput(e) {
        if (this.isLoadNew){
            this.isLoadNew = false;
            return;
        }
        //这个不需要进行展示了，所以不使用setdata
        this.data[e.target.dataset.key] = e.detail;
        //这里调用上传数据
        //加载绑定车辆数据
        wx.$request({
            url: "/WeMinProPlatJson/Submit",
            data: {
                docType: 'Ocrd',
                actionType: 'SubmitOCar',
                docId: this.optionsCookie.carId,
                docJson:JSON.stringify({
                    'VehicleLicOrigImg1': e.detail.orig,
                    'VehicleLicThumImg1': e.detail.thum
                })
            },
            success(res) {
                wx.showToast({
                    title: '修改成功',
                })
            }
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //缓存页面加载数据
        this.optionsCookie = options;
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
                let resItem = res.Table[0]||{};
                //数据修改
                resItem.MaintainDate = resItem.MaintainDate ? util.toDate(resItem.MaintainDate) : '暂无信息';
                resItem.InsuranceDate = resItem.InsuranceDate ? util.toDate(resItem.InsuranceDate) : '暂无信息';
                _this.setData({
                    dataList: resItem,
                    carImgList: res.Table1 || [],
                    //获取行驶证图片（客户上传）
                    xsCardImgUser:{
                        orig: resItem.VehicleLicOrigImg||'',
                        thum: resItem.VehicleLicThumImg || ''
                    },
                    //获取行驶证图片（后台维护）
                    xsCardImg: {
                        orig: resItem.VehicleLicOrigImg1 || '',
                        thum: resItem.VehicleLicThumImg1 || ''
                    }
                })
            },
            complete() {
                wx.stopPullDownRefresh();
            }
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
        this.isLoadNew = true;
        this.onLoad(this.optionsCookie);
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