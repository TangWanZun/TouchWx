// pages/client/clientDetails/specialECard.js
import {
  toDate
} from "../../../library/sdk/util.js"
import {
  UX_MAP
} from "../../../library/sdk/UX_CONST.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    ecardList: [],
    btnDisabled: true,
    selectCount: 0
  },
  openid: "",
  //卡券类型
  ecardtype: "",
  /**
   * 对当前餐券进行选择
   */
  selectCard(e) {
    let index = e.currentTarget.dataset.index;
    let select = this.data.ecardList[index]._select;
    let newSelectCount = select ? this.data.selectCount - 1 : this.data.selectCount + 1;
    this.setData({
      [`ecardList[${index}]._select`]: !select,
      selectCount: newSelectCount,
      btnDisabled: newSelectCount <= 0
    })
  },
  /**
   * 更新
   */
  submit() {
    wx.showLoading({
      title: '正在核销中',
    })
    let selectList = [];
    for (let x of this.data.ecardList) {
      if (x._select) {
        selectList.push(Object.assign({
          SelectCount: 1
        }, x));
      }
    }
    //判断是什么卡券核销
    let actionType = "";
    switch (this.ecardtype) {
      //餐券核销
      case UX_MAP.MealVoucher:
        {
          actionType = 'MealConsumeRelease';
          break;
        }
        //洗车券核销
      case UX_MAP.CarWash:
        {
          actionType = 'CarWashConsumeRelease';
          break;
        }
    }
    //加载相应数据
    wx.$request({
      url: "/WeMinProPlatJson/Submit",
      data: {
        docId: this.openid,
        docType: 'Consume',
        actionType: actionType,
        docJson: JSON.stringify({
          List: selectList
        })
      },
      success(res) {},
      complete() {
        wx.hideLoading();
        setTimeout(() => {
          wx.showModal({
            title: '提示',
            content: '当前卡券核销成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        }, 300)
      }
    })
    console.log(selectList);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.openid = options.openid;
    this.ecardtype = options.ecardtype;
    //获取当前用户的全部可用卡券
    let fun1 = function() {
      //判断是什么卡券核销
      let actionType = "";
      switch (options.ecardtype) {
        //餐券核销
        case UX_MAP.MealVoucher:
          {
            actionType = 'MealECard';
            break;
          }
          //洗车券核销
        case UX_MAP.CarWash:
          {
            actionType = 'CarWashECard';
            break;
          }
      }
      return new Promise((resolve, reject) => {
        wx.$request({
          url: "/WeMinProPlatJson/GetList",
          data: {
            docType: 'Consume',
            actionType: actionType,
            needTotal: false,
            docId: options.openid
          },
          success: res => {
            resolve(res)
          },
          fail: error => {
            reject(error);
          }
        })
      })
    }

    //获取当前用户的基本信息
    let fun2 = function() {
      return new Promise((resolve, reject) => {
        wx.$request({
          url: "/WeMinProPlatJson/GetDataSet",
          data: {
            docType: 'Main',
            actionType: 'ScanBaseInfo',
            needTotal: false,
            docId: options.openid
          },
          success: res => {
            resolve(res)
          },
          fail: error => {
            reject(error);
          }
        })
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    Promise.all([fun1(), fun2()])
      .then((res) => {
        // console.log(res);
        for (let x of res[0]) {
          x._date = `${toDate(x.StartDate)} - ${toDate(x.EndDate)}`;
          x._select = false;
        }
        if (res[1].Table.length == 0) {
          wx.showModal({
            title: '提醒',
            content: '当前用户码不存在',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        }
        this.setData({
          //可以核销的卡券列表
          ecardList: res[0],
          //当前用户信息
          userInfo: res[1].Table[0]
        })
      })
      .finally(() => {
        wx.hideLoading();
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