import {pinyinUtil} from "../../library/pinyin/pinyinUtil.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //使用数据
    dataList:[],
    // 获得的传输数据
    responseList:[
      {
        img: "http://k2.jsqq.net/uploads/allimg/1711/17_171110094803_1.jpg",
        name: "Altr"
      },
      {
        img: "https://tse4.mm.bing.net/th?id=OIP._1RwYha0J95DCBGZcApHwAAAAA&pid=Api",
        name: "阿斗"
      },
      {
        img: "http://pic.qqtn.com/up/2017-9/15055386151767362.jpg",
        name: "魏延"
      },
      {
        img: "http://pic.qqtn.com/up/2017-11/15115072217014845.jpg",
        name: "陈宫"
      },
      {
        img: "http://imgz.ermiao.com/2010/09/6992022-fr.jpg",
        name: "典韦"
      },
      {
        img: "https://tse1.mm.bing.net/th?id=OIP.BRoCEgh15frmcQfT0Z0j2AAAAA&pid=Api",
        name: "张飞"
      },
      {
        img: "http://img2.woyaogexing.com/2017/08/07/17a2f2a6de5de111!400x400_big.jpg",
        name: "吕蒙"
      },
      {
        img: "http://imgtu.5011.net/uploads/content/20170428/6956571493368294.jpg",
        name: "孙尚香"
      },
      {
        img: "https://tse4.mm.bing.net/th?id=OIP.ylVp5b20v4LTsB7ZJWtI2wAAAA&pid=Api",
        name: "曹操"
      },
      {
        img: "http://imgtu.5011.net/uploads/content/20170627/7001211498570801.jpg",
        name: "曹丕"
      },
      {
        img: "http://img.jf258.com/uploads/2013-07-07/194913270.jpg",
        name: "夏侯惇"
      }, 
      {
        img: "http://imgtu.5011.net/uploads/content/20170420/1469701492668162.jpg",
        name: "小乔"
      },
      // {
      //   name: "蒋干",
      //   img: "https://p1.4499.cn/touxiang/UploadPic/2015-6/17/2015061716013860658.jpg",
      // },
      {
        name: "张春华",
        img: "http://imgtu.5011.net/uploads/content/20170515/1938101494835991.jpg",
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var rl = this.data.responseList;
    var dl = {};
    rl.forEach(function(item){
      //取出名字的第一个字的首字母
      var frist = pinyinUtil.getFirstLetter(item.name.substring(0, 1));
      //判断dl数组中是否存在此字母的数组
      if(dl[frist]){
        //存在直接添加
        dl[frist].push(item);
      }else{
        //不存在  添加一个,并进行排序
        dl[frist] = [item];
      }
    });
    //对dl进行排序
    var newkey = Object.keys(dl).sort();
    　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = dl[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    //进行赋值
    this.setData({
      dataList: newObj
    })
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