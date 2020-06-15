

// miniprogram/pages/rep/folders/blob/blob.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repName : "",
    fileName : "",
    imageUrl : "",
    fileIntro : "",
    path : "",
    isDoc : false,
    content : "",
    size : "",
    fileUrl : "",
    size : "",
    fileType : ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let decode = decodeURIComponent(options.transfer);
    let transferObj = JSON.parse(decode);
    console.log(transferObj)
    this.setData({
      repName : transferObj.repName,
      fileName : transferObj.fileName,
      path : transferObj.path,
      fileIntro : transferObj.message
    })
    this.requestBlobInf(this);
    this.detailFile(transferObj.fileName);

  },

  // 解析题目的按钮
  analysisDoc(){
    wx.showLoading({
      title: '解析中',
    })
  var that = this;
  let encode = encodeURI(that.data.path);
   wx.cloud.callFunction({
     name : "rep",
     data : {
       $url : "analysisDoc",
       assessmentName : Math.ceil(Math.random()*100) + '.doc',
       owner : "QuizHub",
       filePath : that.data.path,
       repName : that.data.repName
     }
   }).then(res => {
    wx.hideLoading();
     console.log("解析结果: ",res);
     let result = res.result;
     if(result.status === 'fail'){
       wx.showToast({
         title: '解析失败',
         image : "/images/error.png",
         duration : 1000
       })
     }
     else{
      wx.showToast({
        title: '解析成功',
        icon : "success",
        duration : 1000
      })
     }
    
   }).catch(err => {
    wx.hideLoading();
     console.log("解析发生错误： ", err);
     wx.showToast({
      title: '解析失败',
      image : "/images/error.png",
      duration : 1000
    })
   })
  },

  requestBlobInf(that){
    let encodePath = encodeURI(this.data.path);
    console.log(encodePath)
    wx.cloud.callFunction({
      name : "rep",
      data : {
        $url : "requestBlob",
        owner : "QuizHub",
        repName : this.data.repName,
        path : encodePath
      }
    }).then(res => {
      let result = res.result.data;
      console.log(result);
      that.setData({
        content : result.content,
        size : result.size
      })
    }).catch(err => {
      console.log("出现的错误: ", err);
    })
  },


  // 下载的按钮
  downloadFile(){
    wx.showLoading({
      title: '下载中',
    })
    let blob = new Object();
    blob.filePath = `${wx.env.USER_DATA_PATH}/`+this.data.fileName;
    console.log(blob.filePath);
    blob.data = wx.base64ToArrayBuffer(this.data.content);
    blob.success = (res) => {
      wx.hideLoading();
      wx.showToast({
        title: `成功`,
        icon : "success",
        duration : 2000
      })
      console.log(res)
      // wx.saveFile({
      //   tempFilePath: blob.filePath,
      //   success(res){
      //     console.log(res.savedFilePath);
      //   },fail(err){
      //     console.log("失败了: ",err);
      //     console.log(blob);
      //   }
      // })
    };
    blob.fail = (err) => {console.log("出现错误: ",err)}
    wx.getFileSystemManager().writeFile(blob)
  },

  downloadFileTem(){ 
  
    //保存到用户目录去
    var blob = new Object();
    blob.filePath = `${wx.env.USER_DATA_PATH}/`+this.data.fileName;
    console.log(blob.filePath);
 
    blob.data = wx.base64ToArrayBuffer(this.data.content);
    //blob.encoding = 'base64';
    wx.getFileSystemManager().writeFile(blob);
    this.data.fileUrl = blob.filePath;
    
   },

   onlinePreview()
   {

    wx.showLoading({
      title: '打开中',
    })
    this.downloadFileTem();
    
    wx.openDocument({
      filePath: this.data.fileUrl,
      success(res){
        wx.hideLoading();
        wx.showToast({
          title: '成功',
          icon : "success",
          duration : 1000
        })
        console.log("成功");
      
      },fail(err){
        wx.hideLoading();
        wx.showToast({
          title: '文件类型不支持',
          image : "/images/error.png",
          duration : 1000
        })
        console.log("失败: ",err);
      }
    })
   },


  detailFile(fileName){
    
    let imagePath ;
    let count = 0;
    for(let i = fileName.length - 1 ; i >= 0 ; i--)
    {
      if(fileName.charAt(i) === '.')
      {
        count = i;
        break;
      }
    }
    let fileType = fileName.substring(count+1);
    console.log(fileType);
    let isDoc = false;
    if(fileType === 'docx' || fileType === 'doc')
    {
      fileType = 'word'
      isDoc = true;
    }else if(fileType === 'pdf'){
      fileType = 'pdf-image'
    }else if(fileType === 'mp3'){
      fileType = 'mp3-image'
    }else if(fileType === 'xlsx')
    {
      fileType = 'excel'
    }else if(fileType === 'ppt' || fileType === 'pptx')
    {
      fileType = 'huandengpian'
    }else if(fileType === 'jpg' || fileType === 'jpeg')
    {
      fileType = 'jpg'
    }else if (fileType === 'md')
    {
      fileType = 'md';
    }
    else{
      fileType = 'unknown'
    }
    this.setData({
      imageUrl : `/images/${fileType}.png`,
      isDoc : isDoc
    })


  }
})