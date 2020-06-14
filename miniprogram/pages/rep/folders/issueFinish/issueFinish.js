// miniprogram/pages/rep/folders/issueFinish/issueFinish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 将编码后的路径进行解码
    let string = decodeURIComponent(options.result);
    let obj = JSON.parse(string);
    console.log(obj);
    this.detailResult(obj.arr);
    this.setData({
      result : obj.arr
    })
    
  },

  turn(){
    wx.switchTab({
      url: '/pages/home/home',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  detailResult(arr){
    arr.forEach(value => {
      if(value.result){
        value.style = "bg-gradual-blue"
      }else{
        value.style = "bg-gradual-red"
      }
    })
  }
})