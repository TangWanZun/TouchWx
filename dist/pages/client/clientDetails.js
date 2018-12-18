// pages/client/clientDetails.js
import { util } from '../../library/sdk.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //图片数据
    imgUrl: getApp().privateData.configUrl.imgUrl,
    formData:{},
    carList:[],
    labelList:[],
    clientData:{
      //用户openId
      openId:null,
      //用户wxID
      wxId:null,
      //头像
      headImage:"",
      //爱好
      likeList: ["高尔夫","文学","自驾游","游泳","爬山"],
      //积分
      integral:35600,
      //储值
      stored:5600,
      //电子券
      coupon:20,
      //联系方式
      contact:[
        { num: '18953895214', conType: 'panel' },
        { num: '99705651', conType: 'QQ' },
        { num: 'sunshangxiang1', conType:'WX'}
      ],
      //服务顾问
      counselor:[
        { img: "http://5b0988e595225.cdn.sohucs.com/images/20171007/92f1ce0072f64e979a3545892f9b05fd.jpeg", name: "王小田", career: "销售顾问", index: "NO.00213" },
        { img: "http://up.qqjia.com/z/26/tu32813_1.jpg", name: "张良", career: "维修顾问", index: "NO.00412" },
        { img:"http://image.bitauto.com/dealer/news/2301039/7cb523f3-7be0-4752-b461-59737f7b2162.jpg", name:"李玉" , career:"售后顾问" , index:"NO.00213"},
      ],
      //绑定汽车
      car:[
        {brand: "bc", model: "奔驰S210 运动型", num: "京A12345" },
        {brand:"bjxd",model:"北京现代H321 商务",num:"京B12345"}
      ],
      //用户画像
      portrayal:[
        { title: "职场类别", value: 0, list: ["金融白领", "漂亮主妇", "自由职业", "技术牛人", "影视大咖", "职场达人", "园丁老师高级主管", "公务员", "时尚大咖"]},
        { title: "消费观念", value: 0, list: ["陈旧", "开放型", "易接受新鲜事物"]},
        { title: "购买力", value: 0, list: ["稳定型", "上升购买群体"] }, 
        { title: "客户类别", value: 0, list: ["活跃客户", "忠诚客户", "流失客户", "投诉客户", "摇摆客户"]},
      ],
    },
    //学历
    education: [],
    sexArr:['男','女'],
    //可修改的用户信息
    userInfor: {
      //生日
      BirthDate: '1997-12-13',
      // 性别
      sex: { value: 0, list: ['男', '女'] },
      //学历
      education:'',
      //身份证件
      IDCard:'',
      //职业
      Profession:'',
      //住址
      AddressDetails:'',
      //婚姻状况
      marriage:{ value:0 ,list:['已婚','未婚']},
      //子女描述
      childDes:'',
      //子女数量
      childCount:'',
      //常去商圈
      CBD:''
    },
  },
  /**
   * 用户画像选择回调
  */
  selectCall(e){
    let selectDomKey = e.target.dataset.key;
    let value = e.detail.value;
    this.setData({
      ["clientData.portrayal["+selectDomKey+"].value"]:value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  _this = this;
    //GetNewNeedReplyList需要接受一个参数是openid
    wx.showLoading({
      title: '正在加载数据',
      mask:true,
    })
    wx.$request({
      url: "/WeMinProPlatJson/GetDataSet",
      data: {
        docType: 'client',
        actionType: 'Info',
        needTotal: false,
        docid: options.openId
      },
      success(res) {
        console.log(res);
        let formData =  res.Table[0];
        //修改学历
        if (_this.data.education.length>0) {
          //学历信息已经添加
          for (let x of _this.data.education) {
            if (x.Code == formData.EducationCode) {
              formData.EducationCode = x.Name;
              break;
            }
          }
        }
        //这里需要对部分值进行处理
        var userInforData = {
          //生日
          BirthDate: util.toDate(formData.BirthDate),
          // 性别
          Sex: formData.Sex,
          //学历
          EducationCode: formData.EducationCode,
          //身份证件
          IDCard: formData.IDCard,
          //职业
          Profession: formData.Profession,
          //住址
          AddressDetails: formData.AddressDetails,
          //婚姻状况
          marriage: { value: 0, list: ['已婚', '未婚'] },
          //子女描述
          ChildrenDesc: formData.ChildrenDesc,
          //子女数量
          ChildrenCount: formData.ChildrenCount,
          //常去商圈
          OftenGoto: formData.OftenGoto
        }
        _this.setData({
          formData: res.Table[0],
          userInfor: userInforData,
          carList:res.Table1||[],
          labelList:res.Table2||[],
          //对用户信息进行修改
        })
        //更改名称
        wx.setNavigationBarTitle({
          title: `${res.Table[0].CardName}`,
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
    //加载学历自定义表
    wx.$request({
      url: "/WeMinProPlatJson/GetList",
      data: {
        docType: 'combox',
        actionType: 'Education',
        needTotal: false,
      },
      success(res) {
        // console.log(res);
        //修改学历
        if (_this.data.userInfor.EducationCode){
          for (let x of res){
            if(x.Code == _this.data.userInfor.EducationCode){
              _this.setData({
                'userInfor.EducationCode': x.Name
              })
              break;
            }
          }
        }
        _this.setData({
          'education.list':res,
        })
      },
      complete() {
      }
    })
  },
  /**
   * 拨打电话
  */
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.panel,
    })
  },
  /**
   * 双向绑定事件回调
   */
  inputCall(e) {
    this.setData({
      [e.target.dataset.key]: e.target.dataset.arr[e.detail.value]
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