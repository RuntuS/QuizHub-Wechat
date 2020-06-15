// miniprogram/pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account : "",
    password : "",
    height: "",
    isLoading : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        console.log(clientHeight)
        that.setData({
          height: clientHeight
        });
      }
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

  login(event){
    console.log(this.data.account)
    wx.showLoading({
      title: '正在登录',
    })

    if(true|| this.data.account === "QuizHub" && this.data.password === "123456")
    {
      this.setData({
        isLoading : true
      })
      var that = this;
      console.log(event);
      app.globalData.userInfo = event.detail.userInfo;
      let res = {
        result : {
          status : true
        }
      }
      // 调用登录函数
      wx.cloud.callFunction({
        name: "login",
        success(res){
          console.log(res);
          wx.hideLoading();//结束加载
          that.setData({
            isLoading: false
          });
          that.turn(res);
        }
    })
    }else{

      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '密码错误',
          image : "/images/error.png",
          duration : 1000
        })
      },500)
    }

    
  },

  turn(res){
    if(res.result.status === true)
    {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },1000);
     
      console.log("ok");
    }else{
      wx.showToast({
        title: '密码错误',
        icon: '/pages/error.png',
        duration: 500
      })
    }
  },
  account(event){

    this.setData({
      account : event.detail.value
    })
  },
  password(event){
    this.setData({
      password : event.detail.value
    })
  }
})