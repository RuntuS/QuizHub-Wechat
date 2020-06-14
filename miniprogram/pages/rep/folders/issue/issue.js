// miniprogram/pages/rep/folders/issue/issue.js




Page({

  /**
   * 页面的初始数据
   */
  data: {
    assementId : "",
    loadAssessment: "true",
    issues: [],
      issue:{},
      issueCount : 0,
      choosenClass_A: "noChoosenAnswer",
      choosenClass_B: "noChoosenAnswer",
      choosenClass_C: "noChoosenAnswer",
      choosenClass_D: "noChoosenAnswer",
      beforeChooseClass: "noChoosenAnswer",
      chooseClass: "hasChoosenAnswer",
      nextButtonDisplay : true,
      backButtonDisplay : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id);
    wx.cloud.callFunction({
      name : "rep",
      data : {
        "$url" : "assessment",
        "id" : `${options.id}`,
      },
    }).then(res => {
      let issues = [...res.result.data.quizzess];
      let firstIssue = issues[that.data.issueCount];
      issues.forEach(value => {
        value.chooseAnswer = "";
      })
      that.setData({
        issue : firstIssue,
        assementId : options.id,
        issues : issues,
        loadAssessment : false
      })
    }).catch(err => {
      console.log("请求题目时出现问题:",err);
    })
    
  },


  chooseAnswer(options){
    let type = options.target.dataset.choosen;
    let lastChoosen = this.data.issues[this.data.issueCount].chooseAnswer;
    // 如果上次的选择和本次不一样，需要对样式进行更新
    if(lastChoosen !== type){
      this.data[`choosenClass_${lastChoosen}`] = this.data.beforeChooseClass; //更换对应样式
      this.data[`choosenClass_${type}`] = this.data.chooseClass;
      this.data.issues[this.data.issueCount].chooseAnswer = type;
    }else{
      // 如果一样，则取消
      this.data.issues[this.data.issueCount].chooseAnswer = "";
      this.data[`choosenClass_${type}`] = this.data.beforeChooseClass;
    }
    
    this.setData({
      issues : this.data.issues,
      choosenClass_A: this.data.choosenClass_A,
      choosenClass_B: this.data.choosenClass_B,
      choosenClass_C: this.data.choosenClass_C,
      choosenClass_D: this.data.choosenClass_D
    })
    
  },

  // 下个题目跳转
  nextIssue(){
    let beforeNext = this.data.issueCount; //跳转前题目编号
    let beforeIssue = this.data.issues[beforeNext]; //跳转前题目详细
    let nextCount = beforeNext+1; //下一个题目编号
    let nextIssue = this.data.issues[nextCount]; //下个题目的详细内容
    console.log(nextCount)
    console.log(nextIssue);

    // 上次所选题目样式重置
    if (beforeIssue.chooseAnswer !== "")
    {
      this.data[`choosenClass_${beforeIssue.chooseAnswer}`] = this.data.beforeChooseClass; //将之前的选择样式进行重置
    }
    // 下一个题目如果在之前选了有答案，那么应该更新对应的视图，这个是考虑到Back按钮来做的
    if(nextCount.chooseAnswer !== "")
    {
      this.data[`choosenClass_${nextIssue.chooseAnswer}`] = this.data.chooseClass;
    }
    // 如果到达最后一页，那么应该将next按钮进行隐藏
    if(nextCount === this.data.issues.length - 1)
    {
      this.setData({
        nextButtonDisplay : false
      })
    }
    // 数据/视图更新
    this.setData({
      issue : nextIssue,
      issueCount : nextCount,
      choosenClass_A: this.data.choosenClass_A,
      choosenClass_B: this.data.choosenClass_B,
      choosenClass_C: this.data.choosenClass_C,
      choosenClass_D: this.data.choosenClass_D,
      backButtonDisplay : true
    })
  },
// 跳转到上个题目
  backIssue(){
    let backBeforeCount = this.data.issueCount;
    let backBeforeIssue = this.data.issues[backBeforeCount];
    let backIssueCount = backBeforeCount - 1;
    let backIssue = this.data.issues[backIssueCount];
    if (backBeforeIssue.chooseAnswer !== "") {
      this.data[`choosenClass_${backBeforeIssue.chooseAnswer}`] = this.data.beforeChooseClass; //将之前的选择样式进行重置
    }

    if (backIssue.chooseAnswer !== "") {
      this.data[`choosenClass_${backIssue.chooseAnswer}`] = this.data.chooseClass;
    }

    if (backIssueCount === 0) {
      this.setData({
        backButtonDisplay: false
      })
    }
    this.setData({
      issue: backIssue,
      issueCount: backIssueCount,
      choosenClass_A: this.data.choosenClass_A,
      choosenClass_B: this.data.choosenClass_B,
      choosenClass_C: this.data.choosenClass_C,
      choosenClass_D: this.data.choosenClass_D,
      nextButtonDisplay : true
    })

  },

  upload(){
    this.setData({
      loadModal : true
    })
    let resultArr = this.detailTheAwswer();
    let String = JSON.stringify(resultArr);
    // 对要传递的对象进行字符串编码，否则字符串太长传递不过去。
    let encode = encodeURIComponent(String);
    setTimeout(() => {
      this.setData({
        loadModal : false
      })
      wx.navigateTo({
        url: `/pages/rep/folders/issueFinish/issueFinish?result=${encode}`,
      })
    },500)
  },

  detailTheAwswer(){
    let correctAnswer = 0;
    let arr = [];
    let returnResult = {};
    this.data.issues.forEach(value => {
      let middleObj = {};
      if(value.chooseAnswer === value.answer){
        correctAnswer+=1;
        value.result = true;
      }else{
        value.result = false;
      }
      middleObj.title = value.title;
      middleObj.answer = value.answer;
      middleObj.chooseAnswer = value.chooseAnswer;
      middleObj.result = value.result;
      middleObj.correctAnswer = value[`choice${middleObj.answer}`];
      if(middleObj.chooseAnswer === '')
      {
        middleObj.answerDetail = "没有选择答案";
      }
      else
      {
        middleObj.answerDetail = value[`choice${middleObj.chooseAnswer}`];
      }
      
      arr.push(middleObj);
    });
    returnResult.arr = [...arr];
    returnResult.correctAnswer = correctAnswer;
    returnResult.totalAssessment = this.data.issues.length;
    return returnResult;
  }
})