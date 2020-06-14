// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });


  app.router("getMessage",async (ctx) => {
      await axios({
        method : "get",
        url : `http://182.92.178.28:8118/users/${ctx._req.event.userId}/messages`
      }).then(res => {
        ctx.body = res.data.data;
      }).catch(err => {
        ctx.body =  {"status" : "error","inf":"请求消息时出现错误"};
      })
  })

  app.router("getMessageUnreadNum",async (ctx) => {
    await axios({
      method : "get",
      url : `http://182.92.178.28:8118/users/${ctx._req.event.userId}/messages/nums`
    }).then(res => {
      ctx.body = res.data.data;
    }).catch(err => {
      ctx.body =  {"status" : "error","inf":"请求消息时出现错误"};
    })
})

  





  return await app.serve();
}