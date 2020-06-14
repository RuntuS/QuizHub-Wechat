// miniprogram/pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInf : {},
    requestResult : [
  
    ],
    isLoading : false,
    hasUnread : true,
    unReadNum : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
    var that = this;
    
    this.setData({
      userInf : app.globalData.userInfo,
      isLoading: true
    });

    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },

  // 跳转回来就会加载一次
  onShow: function(){
    this.unreadNum(this);
    var that = this;
    wx.cloud.callFunction({
      name : "home_request",
      data: {
        $url: "repInit"
      }
    }).then(res => {
      console.log(res);
      that.setData({
        requestResult : res.result.data.list,
        isLoading : false
      })
    })
  },


  turn_to_inf(){
    wx.navigateTo({
      url: '/pages/inf/inf',
    })
  },

  turnToRep(event){
    console.log("event",event.currentTarget.dataset.rep);
    
    let String = JSON.stringify(event.currentTarget.dataset.rep);
    let encode = encodeURIComponent(String);
    wx.navigateTo({
      url: `/pages/rep/rep?repInf=${encode}`,
    })
  },

  unreadNum(that){
    wx.cloud.callFunction({
      name : "information",
      data : {
        $url : "getMessageUnreadNum",
        userId : "QuizHub"
      }
    }).then(res => {
      let result = res.result;
      that.setData({
        unReadNum : result
      })
    })
  }
})