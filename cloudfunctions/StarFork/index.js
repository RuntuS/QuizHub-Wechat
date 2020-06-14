// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });


  // 查询关注
  app.router("fork",async (ctx ) => {
    let result = {};
    await axios.get(`http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}/forks`).then(res => {
      result = res;
      console.log("res : " , res);
    }).catch(err => {
      result = {"status" : "error", data : 'failure request'};
    })
    ctx.body = result.data;
  });

  // 添加关注
  app.router("forking",async (ctx) => {
    let result = {};
    await axios({
      method : "post",
      url : `http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}/forks`
      }).then(res => {
        result = {"status" : "success",data : "request success"}
      }).catch(err => {
        result = {"status" : "error",data : 'failure request'};
      })
      ctx.body = result.data;
  });

  // 取消关注
  app.router("cancelFork",async (ctx) => {
    let result = {};
    await axios({
      method : "delete",
      url : `http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}/forks`
    }).then(res => {
      result = {"status" : "success", data : "request success"};
    }).catch(err => {
      result = {"status" : "error",data : 'failure request'};
    })
  
    ctx.body = result.data;
  });

  // star请求
  app.router("Star",async (ctx) => {
    let result = {};
    await axios({
      method : "get",
      url : `http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}/stars`
    }).then(res => {
      result = res;
    }).catch(err => {
      result = {"status" : "error",data : 'failure request'};
    })
    console.log(result);
    ctx.body = result.data;
  });

  //  添加点赞
  app.router("Staring",async (ctx) => {
    let result = {};
    await  axios({
      method : "post",
      url : `http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}/stars`
      }).then(res => {
        result = {"status" : "success",data : "request success"}
      }).catch(err => {
        result = {"status" : "error",data : 'failure request'};
      })
      ctx.body = result.data;
  });

  // 取消点赞
  app.router("cancelStar",async (ctx) => {
    let result = {};
    await axios({
      method : "delete",
      url : `http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}/stars`
    }).then(res => {
      result = {"status" : "success", data : "request success"};
    }).catch(err => {
      result = {"status" : "error",data : 'failure request'};
    })
    ctx.body = result.data;
  })


 


  return await app.serve();
}