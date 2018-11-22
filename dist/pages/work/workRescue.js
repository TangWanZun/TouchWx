import { util } from '../../library/sdk.js'
// pages/work/workRescue.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList:[
    ],
    //全选是否被选中状态
    checkAll: false,
    //是否显示回复框
    dialogSelect:false,
    //分页功能
    pageOver: false
  },
  /**
   * 非需渲染属性
  */
  //记录当前被选中的check
  checkArray:[],
  /**
   * 查询框信息回调
  */
  bindinput(e){
    let value = e.detail.value;
    console.log(value);
    if(value.length>0){
      this.getData(true,e.detail.value);
    }
  },
  /**
   * 点击提交按钮
  */
  send(){
    if(this.checkArray.length===0){
      wx.showToast({
        title:'请至少选择一条信息',
        icon:'none'
      })
      return;
    }
    //打开回复框
    this.setData({
      dialogSelect:true
    })
  },
  /**
   * 点击取消按钮
  */
  cancel(){
    if (this.checkArray.length === 0) {
      wx.showToast({
        title: '请至少选择一条信息',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title:'',
      content:"确认取消所选信息",
      cancelText:"暂不取消",
      confirmText:"确认取消",
      success(res){
        if (res.confirm) {
          wx.showToast({
            title: '信息已取消',
          })
        }
      }
    })
  },
  /**
   * 获取多选框点击事件
  */
  checkChange(e){
    this.checkArray = e.detail.value;
    //当所有多选框被选中的时候,全选需要被选中
    if (e.detail.value.length === this.data.dataList.length){
      this.setData({
        checkAll:true,
      })
    } else if (this.data.checkAll) {
    //当所有多选框被没有选中的时候,全选不需要被选中
      this.setData({
        checkAll: false,
      })
    }
  },
  /**
   * 全选事件监听
  */
  checkAllChange(e){
    //当全选被选中的时候
    let bool = e.detail.value.length > 0
    var datalist = this.data.dataList;
    //全部选择框被选中
    //更新checkArray
    if(bool){
      for (let i = 0; i < datalist.length;i++){
        this.checkArray[i] = i;
      }
    }else{
      this.checkArray.length = 0;
    }
    for(let i = 0;i<datalist.length;i++){
      datalist[i].check = bool;
    }
    //同步状态
    this.setData({
      checkAll: bool,
      dataList: datalist
    })
  },
  /**
   * 获取信息回调
  */
  bindconfirm(e){
    console.log(e.detail.value);
    wx.showToast({
      title: '信息提交',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(true)
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 数据获取
  */
  page: {
    start: 0,
    limit: 5
  },
  getData(dataReset =false,query = ''){
    var _this = this;
    //数据重置
    if (dataReset) {
      this.setData({
        dataList:[],
        pageOver: false,
        //全选状态关闭
        checkAll:false
      })
      this.page.start = 0;
      this.checkArray = [];
    }
    //数据全部加载后阻止进入此函数
    if (this.data.pageOver) {
      return;
    }
    wx.$request({
      url: "/WeMinProPlatJson/GetList",
      data: {
        docType: 'workRescue',
        actionType: '',
        needTotal: false,
        start: this.page.start,
        limit: this.page.limit,
        query
      },
      success(res) {
        let dataDataList = _this.data.dataList;
        //当获取的数据数量小于想要获取的数量的时候判断已经读取完毕
        if (res.length < _this.page.limit) {
          //将状态改成完成
          _this.setData({
            pageOver: true
          });
        }
        /**
         * 更改全部数据
        */
        res.forEach(function (item) {
          item.CreateDate = util.dateParse(item.CreateDate);
          item.check = false;
        })
        //成功则将返回的信息添加一个新的本地带回消息
        dataDataList = dataDataList.concat(res);
        _this.setData({
          dataList: dataDataList
        })
        _this.page.start += _this.page.limit;
      },
      complete() {
        wx.stopPullDownRefresh();
      }
    })
  }
})