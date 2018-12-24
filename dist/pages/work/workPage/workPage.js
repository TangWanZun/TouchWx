// pages/work/workPage/complainPage.js
function createPage(pro={}) {
        let data = {
                //用于控制到达位置
                tapItemShow: 'A01',
                //处理意见
                docTypeRange: [{
                        Code: 'A01',
                        Name: '待确定'
                },
                {
                        Code: 'A02',
                        Name: '有效'
                },
                {
                        Code: 'A03',
                        Name: '无效'
                },
                ],
                formData: {},
        }
        //如果传递了data,就将data合并
        if(pro.data){
                for (let x in pro.data) {
                        data[x] = pro.data[x]
                }
        }
        return {
                /**
                 * 页面的初始数据
                 */
                data,
                /**
                 * tap选择
                 */
                tapItemSelect(e) {
                        this.setData({
                                tapItemShow: e.currentTarget.dataset.key,
                        })
                },
                /**
                 * 页面滚动触发
                 */
                bindscroll(e) {
                        // console.log(e.detail.scrollTop);
                },

                //滚动区域高度
                viewScrollHeight: 0,
                //全部模块高度
                moduleHeightList: [],
                /**
                 * 生命周期函数--监听页面加载
                 */
                onLoad: function(options) {
                        var _this = this;
                        var query = wx.createSelectorQuery()
                        query.selectAll('.page-module-box').boundingClientRect()
                        query.exec(function(res) {
                                for (let x of res[0]) {
                                        _this.moduleHeightList.push(x.height);
                                }
                        })
                        var query2 = wx.createSelectorQuery()
                        query2.select('.page-body').boundingClientRect()
                        query2.exec(function(res) {
                                _this.viewScrollHeight = res[0].height;
                        })
                        //虚拟数据加载
                        this.loadData()
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

                },
                /**
                 * 虚拟数据加载
                 */
                loadData() {
                        //图片
                        let formData = {
                                List: [{
                                                Orig: "http://img2.imgtn.bdimg.com/it/u=882635319,3027004931&fm=200&gp=0.jpg",
                                                Thum: "http://img2.imgtn.bdimg.com/it/u=882635319,3027004931&fm=200&gp=0.jpg"
                                        },
                                        {
                                                Orig: "http://img5.imgtn.bdimg.com/it/u=3208608655,3218271704&fm=26&gp=0.jpg",
                                                Thum: "http://img5.imgtn.bdimg.com/it/u=3208608655,3218271704&fm=26&gp=0.jpg"
                                        }, {
                                                Orig: "http://img4.imgtn.bdimg.com/it/u=2420797096,726777144&fm=26&gp=0.jpg",
                                                Thum: "http://img4.imgtn.bdimg.com/it/u=2420797096,726777144&fm=26&gp=0.jpg"
                                        }, {
                                                Orig: "http://img0.imgtn.bdimg.com/it/u=2453105483,4215695987&fm=26&gp=0.jpg",
                                                Thum: "http://img0.imgtn.bdimg.com/it/u=2453105483,4215695987&fm=26&gp=0.jpg"
                                        }
                                ]
                        };
                        this.setData({
                                formData
                        })
                }
        }
}
export default createPage