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
    unReadNum : 0,
    isAuthorized : app.globalData.isAuthorized,
    avatarUrl : "https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/default.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
    var that = this;
    
    this.setData({
      // userInf : app.globalData.userInfo,
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
  if(this.data.isAuthorized)
  {
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
  } 
  },


  turn_to_inf(){
    if(this.data.isAuthorized)
    {
      wx.navigateTo({
        url: '/pages/inf/inf',
      })
    }else{
      wx.showToast({
        title: '请先进行登录',
        image : "/images/error.png"
      })
    }
    
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
  },

  login(event){
    var that = this;
    wx.showModal({
      title: '登录授权',
      content: '是否允许使用您的微信账号登录',
      success (res) {
        if (res.confirm) {
          that.setData({
            isAuthorized : true,
            userInf : event.detail.userInfo,
            avatarUrl : event.detail.userInfo.avatarUrl
          })
          app.globalData.userInfo = event.detail.userInfo;
          app.globalData.isAuthorized = true;
          that.onShow();
        } else if (res.cancel) {
          
        }
      }
    }) 
  }
})