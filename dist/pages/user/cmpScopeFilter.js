// pages/user/cmpScopeFilter.js
import {
  CMP_CAR,
  CMP_REGION
} from "../../library/sdk/config.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取的数据
    formList: [],
    CMP_CAR: CMP_CAR,
    CMP_REGION: CMP_REGION,
    //筛选的属性
    selectItem: {
      //汽车类型
      BrandType: "",
      //公司区域
      RegionType: ""
    },
    //侧边栏是否出现
    sideEdgeShow: false,
    //展示的公司的数量
    showCount: 0,
    //全选是否被选中
    grounpSelect: false
  },

  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(true);
    //首先需要对获取的类型数据进行处理
    let CMP_CAR_OBJ = {};
    for (let x in CMP_CAR) {
      CMP_CAR_OBJ[x] = {
        name: CMP_CAR[x],
        code: x,
        _isSelect: true
      }
    }
    CMP_CAR_OBJ['A00'] = {
      name: '未定义',
      code: 'A00',
      _isSelect: true
    }
    let CMP_REGION_OBJ = {}
    for (let x in CMP_REGION) {
      CMP_REGION_OBJ[x] = {
        name: CMP_REGION[x],
        code: x,
        _isSelect: true
      }
    }
    CMP_REGION_OBJ['A00'] = {
      name: '未定义',
      code: 'A00',
      _isSelect: true
    }
    this.setData({
      'selectItem.BrandType': CMP_CAR_OBJ,
      'selectItem.RegionType': CMP_REGION_OBJ,
    })
  },
  /**
   * 点击 全选公司
   */
  allCheck(e) {
    let list = this.data.formList;
    if (this.data.grounpSelect) {
      //取消全选
      for (let item of list) {
        if (item._isShow) {
          item.IsAuth = 0;
        }
      }
    } else {
      //启动全选
      for (let item of list) {
        if (item._isShow) {
          item.IsAuth = 1;
        }
      }
    }
    this.setData({
      formList: list,
      grounpSelect: !this.data.grounpSelect
    })
  },
  /**
   * 多选项组改变
   */
  groupChange(e) {
    if (e.detail.value.length >= this.data.showCount) {
      this.setData({
        grounpSelect: true
      })
    } else {
      this.setData({
        grounpSelect: false
      })
    }
  },
  /**
   * 多选单项改变
   */
  changeCheck(e) {
    let index = e.currentTarget.dataset.index;
    let isauth = e.currentTarget.dataset.isauth;
    this.setData({
      [`formList[${index}].IsAuth`]: !isauth
    })
  },
  /**
   * 添加筛选
   */
  selectClick(e) {
    //筛选类型
    let setType = e.currentTarget.dataset.type;
    //筛选项的key值
    let index = e.currentTarget.dataset.index;
    // console.log(this.data.selectItem);
    this.setData({
      [`selectItem.${setType}.${index}._isSelect`]: !this.data.selectItem[setType][index]._isSelect
    })
    //这里需要重新对页面公司进行排序
    this.hintItem();
  },
  /**
   * 根据筛选类型对数据进行排序
   */
  hintItem() {
    let selectItem = this.data.selectItem;
    let cmpList = this.data.formList;
    //需要排除的选项
    let selectOutObj = {};
    //首先获取全部的的筛选项
    for (let x in selectItem) {
      selectOutObj[x] = {}
      for (let index in selectItem[x]) {
        let item = selectItem[x][index];
        if (!item._isSelect) {
          //表示当前筛选项是false类型的 存在这个类型的是需要排除出去的
          selectOutObj[x][index] = item;
        }
      }
    }
    //全部显示的公司数量
    let showCount = 0;
    //设置需要检验的属性
    let attr = ['BrandType', 'RegionType'];
    //遍历全部的公司信息
    for (let cmp of cmpList) {
      //首先将这个公司默认为展示
      cmp._isShow = true;
      showCount++;
      //将全部公司默认为选中
      cmp.IsAuth = true;
      for (let attrItem of attr) {
        //判断当前类型是否在排除选项中
        //我们这里用A00表示未选中的
        if (selectOutObj[attrItem][cmp[attrItem] || 'A00']) {
          //这个属性 的值在排除项中  所以说这公司是需要排除的
          cmp._isShow = false;
          showCount--;
          cmp.IsAuth = false;
          //退出循环
          break
        }
      }
    }
    //更新到视图上
    this.setData({
      formList: cmpList,
      showCount,
      grounpSelect: true
    })
    // console.log(cmpList)
  },
  /**
   * 打开侧边栏
   */
  showSideEdge() {
    this.setData({
      sideEdgeShow: true
    })
  },
  /**
   * 关闭侧边栏
   */
  closeSideEdge() {
    this.setData({
      sideEdgeShow: false
    })
  },
  /**
   * 侧边栏重置
   */
  sideEdgeReset() {
    let selectItem = this.data.selectItem;
    //首先获取全部的的筛选项
    for (let x in selectItem) {
      for (let index in selectItem[x]) {
        //全部选择
        selectItem[x][index]._isSelect = true;
      }
    }
    //重新筛选排序
    this.hintItem();
    this.setData({
      selectItem: selectItem
    })
  },
  //这个是用于提交的数据，是不需要放置到data中的
  // submitList:[],
  /**
   * 数据加载
   */
  getData(refresh = false) {
    if (refresh) {
      this.setData({
        formList: []
      })
      wx.showLoading({
        title: '数据加载中',
      })
    }
    //是否强制刷新refresh
    wx.$request({
      url: '/WeMinProPlatJson/GetList',
      data: {
        docType: 'Main',
        actionType: 'CmpScopeFilter',
        needTotal: false
      },
      success: (res) => {
        let submitList = [];
        let isAuthCount = 0;
        for (let item of res) {
          let pushItem = Object.assign(item, {
            //是否展示
            _isShow: true
          })
          if (item.IsAuth) isAuthCount++;
          submitList.push(pushItem)
        }
        this.setData({
          formList: submitList,
          showCount: submitList.length,
          grounpSelect: isAuthCount == submitList.length
        })
      },
      complete() {
        if (refresh) {
          wx.hideLoading();
        } else {
          wx.stopPullDownRefresh();
        }

      }
    })
  },

  /**
   * 外部重置
   */
  reset() {
    wx.showModal({
      title: '提示',
      content: "确定重置数据",
      success: res => {
        if (res.confirm) {
          //需要对上传数据进行处理
          wx.$request({
            url: '/WeMinProPlatJson/Submit',
            data: {
              docType: 'Main',
              actionType: 'ResetCsf',
            },
            success: (res) => {
              console.log(res)
              //重新获取数据
              this.getData(true);
              //重置筛选框
              this.sideEdgeReset();
            },
            complete() {
              wx.stopPullDownRefresh();
            }
          })
        }
      }
    })
  },
  /**
   * 保存
   */
  submit() {
    // console.log(this.data.formList);
    let formList = this.data.formList;
    // console.log(list)
    //需要对上传数据进行处理
    wx.$request({
      url: '/WeMinProPlatJson/Submit',
      data: {
        docType: 'Main',
        actionType: 'SubmitCsf',
        docJson: JSON.stringify({
          'List': formList
        })
      },
      success: (res) => {
        //重新获取数据
        this.getData(true);
        //重置筛选框
        this.sideEdgeReset();
      },
      complete() {
        wx.stopPullDownRefresh();
      }
    })
  },
  // ============================================================

  /**
   * 点击父公司的钩子
   */
  changeRootCheck(e) {
    //公司根
    let root = e.currentTarget.dataset.root;
    //当前类型
    let rootObj = this.data.formList[root];
    //改变当前的钩子的点击
    let check = rootObj.IsAuth = !(rootObj.IsAuth);
    let checkList = rootObj.list;
    //当前为点击选中了  
    //将子模块全选
    for (let i in checkList) {
      this.changeCarTypeCheck({
        currentTarget: {
          dataset: {
            root: root,
            cartype: i
          }
        }
      })
      checkList[i].IsAuth = 1;
    }

  },
  /**
   * 点击汽车类型的钩子
   */
  changeCarTypeCheck(e) {
    //公司根
    let root = e.currentTarget.dataset.root;
    //汽车类型
    let cartype = e.currentTarget.dataset.cartype;
    //当前类型
    let carTypeObj = this.data.formList[root].list[cartype];
    //改变当前的钩子的点击
    let check = carTypeObj.IsAuth = !(carTypeObj.IsAuth);
    let checkList = carTypeObj.list;
    for (let i in checkList) {
      checkList[i].IsAuth = check;
    }
    // 更新数据
    this.setData({
      [`formList.${root}.list.${cartype}`]: carTypeObj
    })
  },
  /**
   * 点击汽车类型右侧的打开
   */
  tapRightImage(e) {
    //公司根
    let root = e.currentTarget.dataset.root;
    //汽车类型
    let cartype = e.currentTarget.dataset.cartype;
    //当前类型
    let carTypeObj = this.data.formList[root].list[cartype];


    this.setData({
      [`formList.${root}.list.${cartype}._isShow`]: !carTypeObj._isShow
    })
  },
  /**
   * 用来监控每个车类型下下面的全部打勾的
   */
  cartypeBindChange(e) {
    //获取全部打勾的公司
    let valueList = e.detail.value;
    //公司根
    let root = e.currentTarget.dataset.root;
    //汽车类型
    let cartype = e.currentTarget.dataset.cartype;
    //获取当前汽车类型下的全部数据
    let list = this.data.formList[root].list[cartype].list;
    if (valueList.length == list.length) {
      //表示该汽车类型下的全部公司都已经打勾了
      //则该类型也是需要打勾的
      this.setData({
        [`formList.${root}.list.${cartype}.IsAuth`]: 1
      })
    } else {
      this.setData({
        [`formList.${root}.list.${cartype}.IsAuth`]: 0
      })
    }
  },
  /**
   * 点击cmp
   */
  cmpBindChange(e) {
    //公司根
    let root = e.currentTarget.dataset.root;
    //汽车类型
    let cartype = e.currentTarget.dataset.cartype;
    // 公司索引
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`formList.${root}.list.${cartype}.list[${index}].IsAuth`]: !this.data.formList[root].list[cartype].list[index].IsAuth
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
    //控制首页页面刷新
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象 
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面的方法 
      prePage.indexSetIndexList()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData();
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