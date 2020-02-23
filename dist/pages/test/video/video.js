// pages/test/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: [{
        title: "视频名称",
        poster: "https://vip.sap-unis.com/wxapp/img/video/1.jpg",
        src: "https://vip.sap-unis.com/wxapp/img/video/1.mp4"
      },
      {
        title: "鹏龙星辉，‘星’手相牵",
        poster: "https://vip.sap-unis.com/wxapp/img/video/2.jpg",
        src: "https://vip.sap-unis.com/wxapp/img/video/2.mp4"
      },
      {
        title: "这个是视频名称，测试出现省略号的时候的样子，所以名字需要长",
        poster: "https://vip.sap-unis.com/wxapp/img/video/3.jpg",
        src: "https://vip.sap-unis.com/wxapp/img/video/3.mp4"
      },
      {
        title: "这个是视频名称",
        poster: "https://vip.sap-unis.com/wxapp/img/video/4.jpg",
        src: "https://vip.sap-unis.com/wxapp/img/video/4.mp4"
      },
      {
        title: "这个是视频名称",
        poster: "https://vip.sap-unis.com/wxapp/img/video/5.jpg",
        src: "https://vip.sap-unis.com/wxapp/img/video/5.mp4"
      }
    ],
    /**
     * 当前展示的播放的视频下面的
     */
    showData: null,
    /**
     * 当前选择的页面
     */
    selectTabber: 1,
    /**
     * 滚动的高度
     */
    // scrollHeight: window.innerHeight / 2 - window.innerWidth * 0.3,
    /**
     * 用于监听滚动事件的a pp div
     */
    appDom: null,
    /**
     * 当前正在播放的视频页面
     */
    playVideoIndex: -1,
    /**
     * 当前正在播放的视频de Dom
     */
    playVideoDom: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 点击某个视频
   */
  showItem(e) {
    let index = e.currentTarget.dataset.index;
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      playVideoIndex: index
    })
  },

  /**
   * 点击评论的时候
   */
  showPl(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      playVideoIndex: index,
      showData: this.data.formData[index],
      selectTabber:2
    })
  },

  /**
   *点击打开组件的顶部
   */
  showTabber(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectTabber:index
    })
  },

  /**
   * 关闭简介内容等功能
   */
  popBoxClose() {
    this.setData({
      showData: null,
      selectTabber: 1,
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