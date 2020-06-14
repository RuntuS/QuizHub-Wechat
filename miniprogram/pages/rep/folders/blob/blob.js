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
    isDoc : false
    
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
    this.detailFile(transferObj.fileName);

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