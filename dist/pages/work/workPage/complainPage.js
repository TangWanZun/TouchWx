import createPage from './workPage.js'
import { toDateTime, GUID } from '../../../library/sdk/util.js'
import { configUrl } from '../../../library/sdk/config.js'
Page(createPage({
        data:{
                imgUrl:configUrl.imgUrl
        },
        /**
        * 生命周期函数--监听页面加载
        */
        onLoad: function (_this, options) {
                wx.showLoading({
                        title: '数据加载中',
                })

                wx.$request({
                        url: "/WeMinProPlatJson/GetDataSet",
                        data: {
                                docType: 'WorkData',
                                actionType: 'RescueDetails',
                                docid: options.id,
                                needTotal: false,
                        },
                        success(res) {
                                let data = res.Table[0]
                                //整理数据
                                //报案日期
                                data.CreateDate = toDateTime(data.CreateDate)
                                //是否人伤
                                if (data.IsHurt){
                                        data.IsHurt = '存在人伤'
                                }else{
                                        data.IsHurt = '暂无人伤'
                                }
                                //图片列表
                                let imgData = res.Table1
                                //图片合并
                                data.List = imgData;
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
                        // console.log(this.data.formData)
                        wx.showLoading({
                                title: '数据提交中',
                        })
                        let formData = this.data.formData;
                        let _this = this;
                        wx.$request({
                                url: "/WeMinProRescue/Submit",
                                data: {
                                        Id: formData.Id,
                                        DocStatus: formData.DocStatus||null,
                                        ResCarInfo: formData.ResCarInfo || '',
                                        ResCarPhone: formData.ResCarPhone || '',
                                        List: JSON.stringify(formData.List),
                                        Note: formData.Note || '',
                                        UnionGuidTemp: GUID(),
                                        UnionGuid: formData.UnionGuid
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