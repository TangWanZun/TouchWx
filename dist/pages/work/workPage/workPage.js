// pages/work/workPage/complainPage.js
function createPage(pro={}) {
        let obj = {};
        obj = {
                /**
                 * 页面的初始数据
                 */
                data: {
                        //用于控制到达位置
                        tapItemShow: 'A01',
                        //处理意见
                        docTypeRange: [{
                                Code: '',
                                Name: '待确定'
                        },
                        {
                                Code: 'A01',
                                Name: '有效'
                        },
                        {
                                Code: 'A02',
                                Name: '无效'
                        },
                        ],
                        formData: {},
                        //提交按钮是否被注销
                        sendDataDisabled: false
                },
                /**
                 * tap选择
                 */
                tapItemSelect(e) {
                        this.setData({
                                tapItemShow: e.currentTarget.dataset.key,
                        })
                },
                /**
                 * 选择回调
                 */
                inputSelect(e) {
                        let value = e.detail.value;
                        let key = e.target.dataset.key
                        this.setData({
                                [key]: value
                        })
                },
                /**
                 * 生命周期函数--监听页面加载
                 */
                onLoad: function (options) {
                        pro.onLoad && pro.onLoad(this, options)
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

                },
        }
        //如果传递了data,就将data合并
        if (pro.data) {
                for (let x in pro.data) {
                        obj.data[x] = pro.data[x]
                }
        }
        //如果传递了methods  则需要合并
        if (pro.methods){
                for (let x in pro.methods) {
                        obj[x] = pro.methods[x]
                }
        }
        return obj
}
export default createPage