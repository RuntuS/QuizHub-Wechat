// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const axios = require("axios");
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})


exports.main = async (event, context) => {
    let result = {};
    // console.log(axios);
    // await axios({
    //   method: "POST",
    //   url: "http://39.99.133.64:9527/auth/login",
    //   params: {
    //     username: "HeyJavaBean",
    //     password: "Lerie"
    //   }
    //   }).then(res => {
    //   result = res.data;
    //   }).catch(err => {
    //   result = res.data;
    // });

    // if(result.success === true){
      return {
        status : true
        // token : result.data.access_token
      }
    // }else{
    //   return {
    //     status : false
    //   }
    // }
}

