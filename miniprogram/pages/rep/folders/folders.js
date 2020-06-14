// miniprogram/pages/rep/folders/folders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repName : "",
    requestFolders : [],
    FoldersArray:[],
    firstfold : {},
    endFold : {},
    folderUrl: "/images/inside-folder.png",
    wenjianUrl: "/images/inside-wenjian.png",
    repName : "",
    loadingOver : false,
    loadModal: true,
    path : "",
    foldersNum : ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let path = "";
    // 根目录文件请求
    if(options.path === undefined){
      path = ""; //表示跟路径
      await this.requestRep(this,options.repName);    
    }
    // 多级目录请求
    else{
      console.log(options.path);
      console.log("进入了多级!");
      path = options.path;
      await this.requestRep(this,options.repName,path);    
    }
    this.setData({
      path : path
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      FoldersArray: this.data.FoldersArray,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  turnToIssueOrFolders(event){
    console.log("触发了");
    let that = this;
    // this.setData({
    //   loadModal : true
    // })
  
    let eventObj = event.target.dataset.folderinf;
    
    if(eventObj.isDir)
    {
      // 文件夹处理
      this.folders(this,eventObj);
    }else{
      // 普通文件打开
     
      this.blobs(this,eventObj);
    }
     
  },

  // 文件夹跳转
  folders(that,eventObj){
    let path = eventObj.path;
    console.log('跳转之前的path : ', path);
    wx.navigateTo({
      url: `/pages/rep/folders/folders?repName=${that.data.repName}&path=${path}`,
    })
  },
  // 普通文件打开
  blobs(that,eventObj){
    console.log(eventObj);
    let fileName = eventObj.filename;
    let path = eventObj.path;
    let repName = this.data.repName;
    let message = eventObj.message;
    console.log(fileName);
    let tranferObj = {
      fileName : fileName,
      path : path,
      repName : repName,
      message : message
    }

    let ObjString =  JSON.stringify(tranferObj);
    let encode = encodeURIComponent(ObjString);
    wx.navigateTo({
      url: `/pages/rep/folders/blob/blob?transfer=${encode}`,
    })

  },



  requestRep(thisPointer,repName,path){
    
    if(arguments.length === 2)
    {
      wx.cloud.callFunction({
        name : "rep",
        data: {
          $url : "foldersInf",
          repName : repName
        }
      }).then(res => {
    
        let result = res.result;
        thisPointer.setData({
          repName : repName,
          foldersNum : result.length
        })
        if(result.length === 0)
        {
          return;
        }
        else
        {
          thisPointer.foldersSort(thisPointer,result);
          thisPointer.detailPhoto();
        }
      })
    }
    //多级目录请求
    else if(arguments.length === 3)
    {
      let newPath = encodeURI(path);
      console.log("编码前path:",path,"编码后path:",newPath);
      
      wx.cloud.callFunction({
        name : "rep",
        data : {
          $url : "requestTree",
          owner : "QuizHub",
          repName : repName,
          path : newPath
        }
      }).then(res => {
        let result = res.result.data;
        console.log(result);
        thisPointer.setData({
          repName : repName,
          foldersNum : result.length
        })
        if(result.length === 0)
        {
          return;
        }
        else{
          thisPointer.foldersSort(thisPointer,result);
          thisPointer.detailPhoto();
        } 
      }).catch(err => {
        console.log("请求多级目录时出现了错误: ",err);
      })
    } 
  },

  // 排序，文件夹在前，文件在后
  foldersSort(thisPointer,result){
    
    let newSort = [];
    result.forEach(value => {
      if(value.isDir)
      {
        newSort.unshift(value);
      }else{
        newSort.push(value);
      }
    });
    
    thisPointer.setData({
      requestFolders : newSort
    })
  },

  detailPhoto(){
    this.data.requestFolders.forEach((value,index) => {
      if(value.isDir)
      {
        value.imageUrl = "/images/inside-folder.png";
      }else if(!value.isDir){
        value.imageUrl = "/images/inside-wenjian.png";
      }else{
       throw new Error("文件类型不符合标准，请检查请求数据");
      }
    })
   
    if(this.data.foldersNum === 1)
    {
      this.setData({
        endFold: this.data.requestFolders.pop(),
        requestFolders : this.data.requestFolders,
        loadingOver : true, //组件显像
        loadModal : false//加载动画消失
      })
    }else{
      this.setData({
        endFold: this.data.requestFolders.pop(),
        firstfold: this.data.requestFolders.shift(),
        requestFolders : this.data.requestFolders,
        loadingOver : true, //组件显像
        loadModal : false//加载动画消失
      })
    }
    
    console.log(this.data.requestFolders);
  }
})