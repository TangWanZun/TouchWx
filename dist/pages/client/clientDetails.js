// pages/client/clientDetails.js
import {
        util
} from '../../library/sdk.js'
import { UX_TYPE} from "../../library/sdk/config.js"
Page({

        /**
         * 页面的初始数据
         */
        data: {
                //图片数据
                imgUrl: getApp().privateData.configUrl.imgUrl,
                formData: {},
                carList: [],
                labelList: [],
                //是否在线
                online:false,
                openId:'',
                //学历
                educationRange: [],
                //性别
                sexRange: [
                        {
                                Code:'男',
                                Name:'男'
                        },
                        {
                                Code: '女',
                                Name: '女'
                        }
                ],
                //是否来自与会员消费页面
                formPage:false,
                UX_TYPE: UX_TYPE,
                //是否存在核销权限
                hx_UX: UX_TYPE.NO_UX
        },
        /**
         * 预览头像
         */
        previewImage(){
                // wx.previewImage({
                //         urls: [this.data.imgUrl + this.data.formData.ProfilePhoto],
                // })
        },
        /**
         * from表达input组件回调
         */
        fromInput(e){
                this.setData({
                        [e.target.dataset.key]: e.detail.value
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                var _this = this;
                //加载是否在线
                this.setData({
                        online: options.online,
                        openId: options.openId,
                        //是否来自会员消费
                        formPage: options.formPage||false,
                        //加载核销权限
                        hx_UX: getApp().privateData.UXList.ConsumeECard
                })
                //GetNewNeedReplyList需要接受一个参数是openid
                wx.showLoading({
                        title: '正在加载数据',
                        mask: true,
                })
                //加载学历自定义表
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'Combobx',
                                actionType: 'Education',
                                needTotal: false,
                        },
                        success(res) {
                                _this.setData({
                                        'educationRange': res,
                                })
                        },
                        complete() { }
                })

                //加载相应数据
                wx.$request({
                        url: "/WeMinProPlatJson/GetDataSet",
                        data: {
                                docType: 'Ocrd',
                                actionType: 'OcrdDetails',
                                needTotal: false,
                                docid: options.openId
                        },
                        success(res) {
                                _this.setData({
                                        formData: res.Table[0],
                                        carList: res.Table1 || [],
                                        labelList: res.Table2 || [],
                                })
                                //更改名称
                                wx.setNavigationBarTitle({
                                        title: `${res.Table[0].CardName ? res.Table[0].CardName : res.Table[0].NickName}`,
                                })
                        },
                        complete() {
                                wx.hideLoading();
                                wx.stopPullDownRefresh();
                        }
                })

        },
        /**
         * 拨打电话
         */
        makePhoneCall(e) {
                wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.panel,
                })
        },
        /**
         * 用户信息保存
         */
        GUID:'',
        sendData: function () {
                let data = this.data.formData;
                //创建一个GUID 这个是用来进行签名保存的
                if(!this.GUID){
                        this.GUID = util.GUID();
                }
                data.UnionGuidTemp = this.GUID;
                //加载相应数据
                wx.$request({
                        url: "/WeMinProRegisterUser/Submit",
                        data,
                        success(res) {
                                wx.showToast({
                                        title: '保存修改成功'
                                })
                        }
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
                this.onLoad({
                        openId: this.data.openId,
                        online: this.data.online,
                })
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