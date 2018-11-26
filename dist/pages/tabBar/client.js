// import {pinyinUtil} from "../../library/pinyin/pinyinUtil.js"
import { util } from '../../library/sdk.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //使用数据
    dataList:[],
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl,
    //分页数据所有页面是否已经全部加载完成
    pageOver:false
  },
  /**
   * 获取数据
  */
  page: {
    start: 0,
    limit: 25
  },
  getData(dataReset=false){
    //数据重置
    if (dataReset){
      this.setData({
        dataList: [],
        pageOver: false
      })
      this.page.start = 0;
    }
    //数据全部加载后阻止
    if (this.data.pageOver){
      return;
    }
    let _this = this;
    wx.$request({
      url: "/WeMinProChatMessage/GetContactList",
      data: {
        start: this.page.start,
        limit: this.page.limit,
      },
      success(res) {
        if (res.length < _this.page.limit){
          //数据以全部拉取完成
          _this.setData({
            pageOver:true
          })
        }        
        _this.setData({
          dataList: _this.data.dataList.concat(res)
        })
        _this.page.start += _this.page.limit;
      },
      complete() {
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 轮询获取当前在线人数
  */
  //当前页面是否可见
  pageShow:true,
  //当前轮询是否在使用
  onLineShow:false,
  getOnline(){
    var _this = this;
    this.onLineShow = true;
    let  count =0;
    (function fun(){
      if (!_this.pageShow){
        _this.onLineShow = false;
        return;
      }
      wx.$request({
        url: "/WeMinProChatMessage/GetOnline",
        data: {
          Count: count
        },
        success(res) {
          //当存在Data,表示这个数据是最新的
          if (res) {
            //获取在线人数
            count = res.length;
            //刷新标题,提示最近的客户人数
            wx.setNavigationBarTitle({
              title: `客户(${count})`
            })
            //遍历返回数据,查看有没有需要更新显示状态的
            let resData = res;
            let dataList = _this.data.dataList;
            for (let i = 0; i < resData.length;i++){
              //找到相应的用户位置
              var index = util.find(dataList, "OpenId", resData[i].OpenId);
              if(index>=0){
                //存在当前用户的时候,判断当前用户状态是否为离线,
                if (!dataList[index].Online){
                  //如果为离线则调整为在线状态
                  dataList[index].Online = true;
                  //更新列表
                  _this.setData({
                    dataList
                  })
                }
              }
            }
          }
          //轮询
          fun()
        },
        fail(){
          _this.onLineShow = false;
        }
      })
    })()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //用于文字排序
    // var rl = this.data.responseList;
    // var dl = {};
    // rl.forEach(function(item){
    //   //取出名字的第一个字的首字母
    //   var frist = pinyinUtil.getFirstLetter(item.name.substring(0, 1));
    //   //判断dl数组中是否存在此字母的数组
    //   if(dl[frist]){
    //     //存在直接添加
    //     dl[frist].push(item);
    //   }else{
    //     //不存在  添加一个,并进行排序
    //     dl[frist] = [item];
    //   }
    // });
    // //对dl进行排序
    // var newkey = Object.keys(dl).sort();
    // 　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    // var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    // for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    //   newObj[newkey[i]] = dl[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    // }
    // //进行赋值
    // this.setData({
    //   dataList: newObj
    // })
    //获取全部用户
    this.getData();
  },
  /**
   *  图片出现错误 
  */
  binderror(e){
    console.log(e);
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
    this.pageShow = true;
    if (!this.onLineShow){
      //更新在线人数
      this.getOnline();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.pageShow = false;
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
    //获取全部用户
    this.getData(true);
    // wx.stopPullDownRefresh();
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
    
  }
})