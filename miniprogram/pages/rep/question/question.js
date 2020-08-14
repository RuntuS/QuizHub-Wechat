// miniprogram/pages/rep/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assessmentArr : [],
    repName : "",
    loadModal: true
  },

  

  onLoad: function (options) {
  
    let that = this;
    wx.cloud.callFunction({
      name : "rep",
      data : {
        $url : "questionInf"
      }
    }).then(res => {
      console.log(res.result.data);
      let data = res.result.data;
      that.setData({
        assessmentArr : data,
        repName : options.repName,
        loadModal : false
      })
    })
  },

  // 跳转到做题界面
  trunToIssue(event){
    console.log(event.target.dataset);
    var id = event.target.dataset.id;
    wx.navigateTo({
      url: `/pages/rep/folders/issue/issue?id=${id}`,
    })
  },
  touchmove(detail){
    console.log(detail.touches[0].clientX);
    
  }


})