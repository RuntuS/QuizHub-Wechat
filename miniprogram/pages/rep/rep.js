// miniprogram/pages/rep/rep.js




let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article : {
},
    userInfo : {},
    repName : "",  //请求用
    repNickName : "", //展示用 
    repIntro : "",
    // 以下变量均为样式设置，和业务逻辑无关
    isPublic : true,
    isStar : true,
    isFokred: true,
    starNum : 0,
    forkNum : 0,
    hasStar : {
      font : "点赞",
      styleClass : "line-blue"
    },
    noStar : {
      font : "点赞",
      styleClass : "line-grey"
    },
    hasFork : {
      font: "关注",
      styleClass: "line-blue"
    },
    noFork : {
      font: "关注",
      styleClass: "line-grey"
    },
    star_style : {},
    fork_style : {},
    shadowClassStar : "",
    shadowClassFork : "",
    loadModal : true, //动画加载
    // 需要两个变量进行联动控制，因为star和fork的请求不能确定先后顺序
    loadModal_1 : true,
    loadModal_2 : true
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let repObjString = decodeURIComponent(options.repInf);
    let repObj = JSON.parse(repObjString);
    this.setData({
      userInfo: app.globalData.userInfo,
      repName : repObj.repoName,
      repNickName :  repObj.repoNickName,
      starNum : repObj.starNum,
      forkNum : repObj.forkNum,
      repIntro : repObj.repoIntro
    })
    console.log(repObj);

    this.judgeBtnStar(this);
    this.judgeBtnFork(this);
    this.readMeInit(this);
    // let mockdata = `# actionPreview\n * 重构辅导员管理界面 `
    // // mock数据测试
    // let data = app.towxml(mockdata,"markdown",{
    //   theme : "light"
    // });
    // this.setData({
    //   article : data
    // })

  },
  

  readMeInit(that){
    wx.cloud.callFunction({
      name : "rep",
      data : {
        $url : "readMeContent",
        repName : that.data.repName,
        owner : "QuizHub"
      }
    }).then(res => {
      console.log(res);
      let source = res.result; //readMe的二进制数据
      
      let data = app.towxml(source,'markdown',{
        theme : "light"
      });
      that.setData({
        article : data
      })
    }).catch(err => {
      console.log(err);
    })
  },



 

  // star初始化
  judgeBtnStar(page){

    wx.cloud.callFunction({
      name : "StarFork",
      data : {
        $url : "Star",
        repName : page.data.repName
      }
    }).then(res =>{

      let StarStatus = res.result.data; //获取当前账号的状态 
      // star
      if(StarStatus){
        page.setData({
          star_style : page.data.hasStar,
          shadowClassStar: "active",
          isStar : true
        })
      }
      // no star
      else{
        page.setData({
          star_style : page.data.noStar,
          shadowClassStar: "normal",
          isStar : false
        })
      }
      page.setData({
        loadModal_1 : false,
        loadModal : false || page.data.loadModal_2
      })
    }).catch(err => {
      console.log("Star请求出现错误 : ",err);
    })
  },

  // fork初始化
  judgeBtnFork(page)
  {
    // console.log(page.data.repName);
    wx.cloud.callFunction({
      name : "StarFork",
      data : {
        $url : "fork",
        repName : page.data.repName
      }
    }).then(res => {
      console.log("forkStatus ",res);
      let forkStatus = res.result.data;

      // fork
      if(forkStatus){
        page.setData({
          fork_style: page.data.hasFork,
          shadowClassFork : "active",
          isFokred : true
        })
      }
      // no fork
      else{
        page.setData({
          fork_style: page.data.noFork,
          shadowClassFork: "normal",
          isFokred : false
        })
      }

      page.setData({
        loadModal_2 : false,
        loadModal : page.data.loadModal_1 || false
      })

    }).catch(err => {
      console.log("fork请求出现错误： ",res);
    })
    
    
  },

  // star点击
  starCommit(){
    var that = this;
    wx.showLoading({
      title: '处理中',
    })
    if(this.data.isStar){

// 起初star了，这里是取消star
      wx.cloud.callFunction({
        name : "StarFork",
        data: {
          $url : "cancelStar",
          repName : that.data.repName
        }
      }).then(res => {
        console.log(res);
        that.setData({
          isStar : false,
          starNum : that.data.starNum - 1,
          shadowClassFork: "normal",
          star_style : that.data.noStar
        });
        wx.hideLoading();

      }).catch(err => {
        console.log("取消点赞时发生了错误: ",err);
      })
// 这里是进行点赞
    }else{
      wx.cloud.callFunction({
        name : "StarFork",
        data : {
          $url : "Staring",
          repName : that.data.repName,
        }
      }).then(res => {
        that.setData({
          isStar : true,
          starNum : that.data.starNum + 1,
          star_style :that.data.hasStar,
          shadowClassStar: "active",
        })
        // 取消加载
        wx.hideLoading();

      }).catch(err => {
        console.log("点赞时发生了错误: ",err)
      })
    }

  },

  // fork点击
  forkCommit(){
    var that = this;
    wx.showLoading({
      title: '处理中',
    })
    if (this.data.isFokred) {
      // 取消fork
      wx.cloud.callFunction({
        name : "StarFork",
        data: {
          $url : "cancelFork",
          repName : that.data.repName
        }
      }).then(res => {
        console.log(res);
        that.setData({
          isFokred : false,
          forkNum : that.data.forkNum - 1,
          fork_style: that.data.noFork,
          shadowClassFork: "normal"
        });
        wx.hideLoading();

      }).catch(err => {
        console.log("取消点赞时发生了错误: ",err);
      })
    } else {

      // fork
      wx.cloud.callFunction({
        name : "StarFork",
        data : {
          $url : "forking",
          repName : that.data.repName,
        }
      }).then(res => {
        that.setData({
          isFokred : true,
          forkNum : that.data.forkNum + 1,
          fork_style: that.data.hasFork,
          shadowClassFork : "active",
        })
        // 取消加载
        wx.hideLoading();

      }).catch(err => {
        console.log("点赞时发生了错误: ",err)
      })
    }
    this.judgeBtnFork(this);
  },


  // 跳转函数
  turnToFolder(){
    wx.navigateTo({
      url: `/pages/rep/folders/folders?repName=${this.data.repName}`,
    })
  },
  turnToIssue(){
    var that = this;
    wx.navigateTo({
      url: `/pages/rep/question/question?repName=${that.data.repName}`,
    })
  },
  turnToDiscuss(){
    var that = this;
    wx.navigateTo({
      url: `/pages/rep/discuss/discuss?repName=${that.data.repName}`,
    })
  }
})