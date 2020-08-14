// miniprogram/pages/rep/discuss/discuss.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repName : "",
    avaUrl : "",
    commentsLists : [],
    isFocus : false,
    isReplyContent : false,
    replyId: 0,
    loadModal : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectDiscuss(options.repName,"QuizHub"); // QuizHub是暂时的
  } ,

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

  selectDiscuss(repName,owner){
    var that = this;
    wx.cloud.callFunction({
      name : "rep",
      data : {
        $url : "selectDiscuss",
        user : owner,
        repName: repName
      }
    })
    .then(res => {
      console.log(res.result.retCode)
      if(res.result.retCode === '200')
      {
        that.matchReply(res.result.data); //回复消息遍历
        let discussArray = that.reveseArr(res.result.data); //顺序调整
      
        that.setData({
          commentsLists : discussArray,
          repName : repName,
          avaUrl : app.globalData.userInfo.avatarUrl,
          loadModal : false 
        })
      }
      else{  //请求错误
        
      }
      

    }).catch(err => {
      console.log("获取评论时发生错误",err)
    })
  },

  // 数组反转
  reveseArr(array){
   
    let newArray = [];
    array.forEach(value => {
      newArray.unshift(value);
    })
    
    return newArray;
  },

  // 回复消息匹配
  matchReply(array){
    for(let i = 0 ; i < array.length ; i++){
      if(array[i].isReply === false){
        array[i].replyInf = "";
        continue;
      }else{
        console.log(array[i],array[i].replyId);
        array[i].replyUser = array[parseInt(array[i].replyId)].userId
        array[i].replyInf = array[parseInt(array[i].replyId)].text; //评论拷贝
      }
    }
  },
  showKeyboard(event){
    this.setData({
      isFocus : true,
      isReply : true,
      replyId : event.currentTarget.dataset.reply
     
    })
  },
  inputValue(event){
    let that = this;
    let inputContent = event.detail.value; //input
    console.log(inputContent)
    // 按照回复的形式进行处理
    if(this.data.isReply){
      wx.cloud.callFunction({
        name : "rep",
        data : {
          $url : "sendDiscuss",
          repName : that.data.repName,
          user : "QuizHub",
          text : inputContent,
          commentId : that.data.replyId
        }
      })
      .then(res => {
        if(data.result.retCode === '200'){
          // success
        }
        else {
          throw new Error("发送回复失败")
        }
      })
      .catch(err => {

      })
    }else{ //按照评论的形式进行处理
      wx.cloud.callFunction({
        name : "rep",
        data : {
          $url : "sendDiscuss",
          repName : that.data.repName,
          user : "QuizHub",
          text : inputContent
        }
      })
      .then(data => {
        if(data.result.retCode === '200')
        {
          // Success
        }
        else{
          throw new Error("发送评论失败")
        }
      })
      .catch(err => {
        console.log(err);
      })
    }

    this.selectDiscuss(options.repName,"QuizHub"); //刷新
  }
  
  
})