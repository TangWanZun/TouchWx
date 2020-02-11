import { RESERVE_TYPE, RESERVE_ASS_TYPE} from "../../../library/sdk/config.js"

import createPage from './workPage.js'
import {
  toDate,
  toDateTime,
  toTime,
  GUID
} from '../../../library/sdk/util.js'
Page(createPage({
  data: {
    reserveRange: [],
    RESERVE_TYPE,
    RESERVE_ASS_TYPE
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(_this, options) {
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
          Code: '',
          Name: '未选择'
        }]
        for (let x of res) {
          _reserveRange.push({
            Code: x.Id,
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
        console.log(res);
        let data = res[0]
        //整理数据
        //预约日期
        data.ReserveDate = toDate(data.ReserveDate)
        //创建日期
        // data.CreateDate = toDateTime(data.CreateDate)
        //时间段
        data._reserveStartTime = toTime(data.ReserveStartTime);
        data._reserveEndTime = toTime(data.ReserveEndTime);
        // data.ReserveTime = `${toTime(data.ReserveStartTime)} - ${toTime(data.ReserveEndTime)}`
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
      let _this = this;
      let data = {
        Id: _formData.Id,
        DocStatus: _formData.DocStatus,
        Note: _formData.Note||"",
        OhemId: _formData.OhemId || 0,
        UnionGuidTemp: GUID(),
        UnionGuid: _formData.UnionGuid,
        ReserveDate: _formData.ReserveDate,
        ReserveStartTime:`2020-01-01 ${_formData._reserveStartTime}:00.000`,
        ReserveEndTime: `2020-01-01 ${_formData._reserveEndTime}:00.000`
      }
      // console.log(data)
      wx.$request({
        url: "/WeMinProReserve/Submit",
        data:data,
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