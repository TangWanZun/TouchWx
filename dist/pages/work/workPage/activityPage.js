import createPage from './workPage.js'
import { toDateTime, GUID} from '../../../library/sdk/util.js'

import {
        configUrl
} from '../../../library/sdk.js'
Page(createPage({
        data: {
                imgUrl: configUrl.imgUrl,
        },
        /**
        * 生命周期函数--监听页面加载
        */
        onLoad: function (_this, options) {
                wx.showLoading({
                        title: '数据加载中',
                })
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'workData',
                                actionType: 'ActivityPage',
                                docid: options.id,
                                needTotal: false,
                        },
                        success(res) {
                                let data = res[0]
                                //整理数据
                                //报名时间
                                data.CreateDate = toDateTime(data.CreateDate)
                                _this.setData({
                                        formData: data
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
                        wx.$request({
                                url: "/WeMinProActivitySignUp/Submit",
                                data: {
                                        Id: _formData.Id,
                                        DocStatus: _formData.DocStatus,
                                        Note: _formData.Note || '',
                                        UnionGuidTemp:GUID(),
                                        UnionGuid: _formData.UnionGuid
                                },
                                success(res) {
                                        console.log(res);
                                },
                                complete() {
                                        wx.hideLoading();
                                }
                        })
                }
        }
}))