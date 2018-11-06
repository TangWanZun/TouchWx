import {pinyinUtil} from "../../library/pinyin/pinyinUtil.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //使用数据
    dataList:[],
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl
  },
  /**
   * 获取数据
  */
  getData(){
    let _this = this;
    wx.$request({
      url: "/WeMinProChatMessage/GetContactList",
      data: {
        start: 0,
        limit: 25,
      },
      success(res) {
        console.log(res)
        _this.setData({
          dataList: res.data
        })
      }
    })
  },
  /**
   * 滚动数据加载
  */
  scrolltolower(){
    console.log(1);
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})