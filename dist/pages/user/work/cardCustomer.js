// pages/user/cardCustomer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfor:{
      //会员编号
      CardCode: { value: 0, list:['636784838059785119','636784838059785200']},
      //会员名称
      CardName:"顾里",
      //车牌号
      CarNum:"鲁A12345",
      //VIN
      VIN:"LE4FTM8K88L020841",
      //业务类型
      DocType: { value: -1, list: [{ key: 'A01', value: '售后' }, { key: 'A02', value: '保险' }, { key: 'A03', value: '其他' }] },
      //储值金额
      StoredTotal:2000,
      
    },
    //已选择的电子券
    formData:[],
    //抵扣数额
    dedTotal:0,
    //消费总额
    consumeTotal:0,
    //储值抵扣
    dedStored:0,
    //实收现款
    cashTotal: 0
  },
  /**
 * 双向绑定事件回调
 */
  inputCall(e) {
    let selectDomKey = e.target.dataset.key;
    this.setData({
      [selectDomKey]: e.detail.value
    })
  },
  /**
   *  点击选择电子券 
   */
  selectEcard(){
    //这里是测试,点击选择电子券之后,将给与默认回调
    //这里的抵扣类型是先自定的
    //A01:数额
    //A02:数量
    this.ecardBackCall([
      { Total: 500, Name: '500元保养券', DocType: 'A01', Id: 1 },
      { Total:300,Name:'300元一次性抵扣券',DocType:'A02',Id:2}
    ])
  },
  /**
   * 选择电子券回调
   */
  ecardBackCall(data){
    //计算抵扣数额
    let meDedTotal = 0
    //这里进行对数据处理,然后回调给前面
    for(let i = 0;i<data.length;i++){
      let item = data[i];
      if (item.DocType=='A01'){
        //表示为数额的时候,给予属性NewTotal 默认值为0 表示当前使用
        item.NewTotal = 0;
        item.DocTypeName = '数额';
      } else if (item.DocType == 'A02'){
        //表示为数量的时候,给予属性NewTotal 默认值为当前券的金额
        item.NewTotal = item.Total
        item.DocTypeName = '数量';
      }
      //这里进行计算,计算全部电子券的抵扣数额,并且赋值到相应为抵扣位置上去
      meDedTotal += item.NewTotal;
    }
    //将数据进行赋值到页面
    this.setData({
      formData: data||[],
      dedTotal: meDedTotal
    })
  },
  /**
   *  电子券获得焦点的时候 
   */
  EcardTotalFocus(e){
    let index = e.currentTarget.dataset.index;
    //这里是为了输入方便,当为0的时候,点击就直接可以输入了,不用删掉0 了
    if (e.detail.value==0){
      this.setData({
        [`formData[${index}].NewTotal`]: ''
      })
    }
  },
  /**
   * 修改电子券
   */
  EcardTotal(e){
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    let item = this.data.formData[index];
    //选取出未修改的金额来,用于之后的计算抵扣数额
    let oldTotal = item.NewTotal;
    //这里是修改后的金额,用于之后的计算抵扣数额
    let newTotal = 0;
    //这里的input是number类型
    if (!value || value<0){
      //判断当没有value时,赋值为0 
      this.setData({
        [`formData[${index}].NewTotal`]: 0
      })
      newTotal = 0;
    }else if (value>item.Total){ 
      //若是当前输入的金额大于电子券金额,则默认为电子券金额
      this.setData({
        [`formData[${index}].NewTotal`]: item.Total
      })
      newTotal = item.Total;
    } else{
      //否则需要更新对应formData的NewTotal，这里不需要使用setData,因为不需要更新到视图上
      item.NewTotal = value;
      newTotal = value;
    }
    //这里需要进行计算抵扣数额
    //计算方法是用当前抵扣总额减去修改前金额,加上修改后金额
    //*1 是为了让字符串变成数字
    this.setData({
      dedTotal: this.data.dedTotal*1 - oldTotal*1 + newTotal*1
    })
  },
  /**
   * 储值与实收
   */
  totalBlur(e){
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value*1;
    //不存在则默认为0
    if(!key){
      value = 0;
    }
    if (key == 'dedStored'){
      //当为储值抵扣且输入金额大于可用储值的时候,默认为可用储值
      if (value > this.data.userInfor.StoredTotal*1){
        this.setData({
          dedStored: this.data.userInfor.StoredTotal
        })
        value = this.data.userInfor.StoredTotal;
      }
    }
    //更新数据但是不用使用setData
    this.data[key] = value;
    //并且计算消费总计
    this.setData({
      'consumeTotal': this.data.dedStored*1 + this.data.cashTotal*1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
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