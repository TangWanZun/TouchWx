import createPage from './workPage.js'
import { toDate, toDateTime, toTime, GUID} from '../../../library/sdk/util.js'
Page(createPage({
        data:{
                reserveRange:[]
        },
        /**
        * 生命周期函数--监听页面加载
        */
        onLoad: function (_this,options) {
                wx.showLoading({
                        title: '数据加载中',
                })
                //专属顾问
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'WorkData',
                                actionType: 'ReserveOhemList', 
                                needTotal: false,
                        },
                        success(res) {
                                //进行更改
                                let _reserveRange = [{
                                        Code:'',
                                        Name:'未选择'
                                }]
                                for(let x of res){
                                        _reserveRange.push({
                                                Code:x.Id,
                                                Name: `${x.CardName} - ${x.Position}`
                                        })
                                }
                                _this.setData({
                                        reserveRange: _reserveRange
                                })
                        },
                        complete() {
                                wx.hideLoading();
                        }
                })
                //预约详情
                wx.$request({
                        url: "/WeMinProPlatJson/GetList",
                        data: {
                                docType: 'WorkData',
                                actionType: 'ReserveDetails',
                                docid: options.id,
                                needTotal: false,
                        },
                        success(res) {
                                let data = res[0]
                                //整理数据
                                //预约日期
                                data.ReserveDate = toDate(data.ReserveDate)
                                //创建日期
                                data.CreateDate = toDateTime(data.CreateDate)
                                //时间段
                                data.ReserveTime = `${toTime(data.ReserveStartTime)} - ${toTime(data.ReserveEndTime)}`
                                _this.setData({
                                        formData: data
                                })
                        },
                        complete() {
                                wx.hideLoading();
                        }
                })
        },
        methods:{
                submit() {
                        wx.showLoading({
                                title: '数据提交中',
                        })
                        let _formData = this.data.formData;
                        wx.$request({
                                url: "/WeMinProReserve/Submit",
                                data: {
                                        Id: _formData.Id,
                                        DocStatus: _formData.DocStatus,
                                        Note: _formData.Note,
                                        OhemId: _formData.OhemId,
                                        UnionGuidTemp: GUID(),
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