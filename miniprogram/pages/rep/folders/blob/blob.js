

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
   // 这里补充一下，主要就是用调用xxx:8877/anaylsis那个接口，post方式，把文件的path属性传过去，
   //然后这里需要等待返回值，因为这个是有可能失败的，失败了直接把errMsg作为弹窗给用户看
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
    let blob = {};
    lob.filePath = `${wx.env.USER_DATA_PATH}/`+this.data.fileName;
    console.log(blob.filePath);
    blob.data = wx.base64ToArrayBuffer(this.data.content);
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