// miniprogram/pages/inf/inf.js
const app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatorUrl : "",
    dataList : [],
    loadModal : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name : "information",
      data:{
        $url : "getMessage",
        userId : "QuizHub"
      }
    }).then(res => {
      console.log(res);
      let middle_arr = res.result;
      that.setData({
        dataList : middle_arr,
        avatorUrl :  app.globalData.userInfo.avatarUrl,
        loadModal : false
      })
    }).catch(err => {
      console.log("获取消息时发生了错误: ",err)
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