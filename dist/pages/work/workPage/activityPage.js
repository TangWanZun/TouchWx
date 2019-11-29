import createPage from './workPage.js'
import {
    toDateTime,
    GUID
} from '../../../library/sdk/util.js'

import {
    configUrl
} from '../../../library/sdk.js'
Page(createPage({
    data: {
        imgUrl: configUrl.imgUrl,
        dataList:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(_this, options) {
        wx.showLoading({
            title: '数据加载中',
            mask:true
        })
        wx.$request({
            url: "/WeMinProPlatJson/GetDataSet",
            data: {
                docType: 'WorkData',
                actionType: 'ActSignUpDetails',
                docid: options.id,
                needTotal: false,
            },
            success(res) {
                let data = res.Table[0]
                //整理数据
                //报名时间
                data.CreateDate = toDateTime(data.CreateDate)
                _this.setData({
                    formData: data,
                  dataList: res.Table1
                })

            },
            complete() {
                wx.hideLoading();
            }
        })
    },
    methods: {
        submit() {
            wx.showLoading({
                title: '数据提交中',
            })
            let _formData = this.data.formData;
            let _this = this;
            wx.$request({
                url: "/WeMinProActivitySignUp/Submit",
                data: {
                    Id: _formData.Id,
                    DocStatus: _formData.DocStatus,
                    Note: _formData.Note || '',
                    UnionGuidTemp: GUID(),
                    UnionGuid: _formData.UnionGuid
                },
                success(res) {
                    console.log(res);
                    wx.showToast({
                        title: '提交成功',
                    })
                    _this.setData({
                        sendDataDisabled: true
                    })
                },
                complete() {
                    wx.hideLoading();
                }
            })
        }
    }
}))