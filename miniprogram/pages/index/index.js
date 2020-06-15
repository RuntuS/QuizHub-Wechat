// miniprogram/pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blocks : [{
      name : "IT行业",
      classConfig : "bg-cyan padding radius text-center light"
    },{
      name : "金融",
      classConfig : "bg-blue padding radius text-center light"
    },{
      name : "线下",
      classConfig : "bg-yellow padding radius text-center light"
    },{ 
      name : "其他" , 
      classConfig : "bg-orange padding radius text-center light"
    }],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/4.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/2.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/3.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/4.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/2.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/3.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://photo-1258955954.cos.ap-chengdu.myqcloud.com/Wechat/2.jpg'
    }],
    cardCur: 0,
    contentArray : [],
    location : "",
    userInfoAva : "",
    userInf : {},
    loadModal : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    this.towerSwiper('swiperList');
    this.requestRepInf(this);
    wx.getLocation({
      altitude: 'true',
      success(res){
        wx.showLoading({
          title: '正在获取你的位置',
        })
        console.log(res);
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=YYZBZ-D2P33-VPD3O-YYY3W-7UGGJ-RFBKQ`,
          success(res){
            wx.hideLoading({
              success: (res) => {
                
              },
            })
            console.log(res);
            that.setData({
              location : res.data.result.formatted_addresses.recommend,
              userInfoAva : app.globalData.userInfo.avatarUrl,
              userInf : app.globalData.userInfo
            })
          }
         })
        }
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },


  toDetailedPage(event){
    console.log(event.target);
  },


  turnToRep(event){
    console.log("event",event.currentTarget.dataset.rep);
    
    let String = JSON.stringify(event.currentTarget.dataset.rep);
    let encode = encodeURIComponent(String);
    wx.navigateTo({
      url: `/pages/rep/rep?repInf=${encode}`,
    })
  },


  requestRepInf(that){
    wx.cloud.callFunction({
      name : "index",
      data : {
        $url : "homeRep",
        listType : "fork",
        pageNo : 1,
        pageSize : 8
      }
    }).then(res => {
      console.log(res);
      that.setData({
        contentArray : res.result.data.list,
        loadModal : false
      })
    }).catch(err => {
      console.log("获取仓库信息失败： ",err);
    })
  }


})