// pages/client/clientInfo.js
import {
  util
} from '../../../library/sdk.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前数据
    formData: {},
    //学历
    educationRange: [],
    //性别
    sexRange: [{
        Code: '男',
        Name: '男'
      },
      {
        Code: '女',
        Name: '女'
      }
    ],
    //身份证照片信息
    idCardImg: {
      orig: '',
      thum: ''
    },
    //驾驶证信息
    drLicImg: {
      orig: '',
      thum: ''
    },
    //身份证照片信息（用户上传）
    idCardImgUser: {
      orig: '',
      thum: ''
    },
    //驾驶证信息（用户上传）
    drLicImgUser: {
      orig: '',
      thum: ''
    },
  },
  /**
   * from表达input组件回调
   */
  fromInput(e) {
    this.setData({
      [e.target.dataset.key]: e.detail.value
    })
  },
  /**
   * 用户上传证件回调
   */
  leafletAddInput(e) {
    //这个不需要进行展示了，所以不使用setdata
    this.data[e.target.dataset.key] = e.detail

  },
  /**
   * 用户信息保存
   */
  GUID: '',
  sendData: function() {
    let data = this.data.formData;
    //创建一个GUID 这个是用来进行签名保存的
    if (!this.GUID) {
      this.GUID = util.GUID();
    }
    //添加GUID
    data.UnionGuidTemp = this.GUID;
    //车主身份证(后台维护)  原图
    data.IdCardOrigImg1 = this.data.idCardImg.orig;
    //车主身份证(后台维护)  缩略图
    data.IdCardThumImg1 = this.data.idCardImg.thum;
    //车主驾驶证(后台维护)  原图
    data.DrLicOrigImg1 = this.data.drLicImg.orig;
    //车主驾驶证(后台维护) 缩略图
    data.DrLicThumImg1 = this.data.drLicImg.thum;
    console.log(data);
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    //加载是否在线
    this.setData({
      // online: options.online,
      openId: options.openId,
      //是否来自会员消费
      // formPage: options.formPage || false,
      //加载核销权限
      // hx_UX: getApp().privateData.UXList[UX_NAME.A01]
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
      complete() {}
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
        let userData = res.Table[0];
        _this.setData({
          formData: userData,
          carList: res.Table1 || [],
          labelList: res.Table2 || [],
          clientList: res.Table3 || [],
          nameplateList: res.Table4 || [],
        })
        if (userData) {
          _this.setData({
            //身份证照片信息(后台维护)
            idCardImg: {
              orig: userData.IdCardOrigImg1 || '',
              thum: userData.IdCardThumImg1 || ''
            },
            //驾驶证信息(后台维护)
            drLicImg: {
              orig: userData.DrLicOrigImg1 || '',
              thum: userData.DrLicThumImg1 || ''
            },
            //身份证照片信息(用户上传)
            idCardImgUser: {
              orig: userData.IdCardOrigImg || '',
              thum: userData.IdCardThumImg || ''
            },
            //驾驶证信息(用户上传)
            drLicImgUser: {
              orig: userData.DrLicOrigImg || '',
              thum: userData.DrLicThumImg || ''
            },
            //出生日器
            "formData.BirthDate":util.toDate(userData.BirthDate)
          })
          //更改名称
          wx.setNavigationBarTitle({
            title: `${userData.CardName ? userData.CardName : userData.NickName}`,
          })
        }

      },
      complete() {
        wx.hideLoading();
        wx.stopPullDownRefresh();
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