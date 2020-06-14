// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router("repInit",async (ctx , next) => {
    let result = {};
    ctx.data = {};
    await axios.get("http://182.92.178.28:8877/repos/QuizHub")
    .then(res => {
      result = res;
    }).catch(err => {
      result = {"status" : "error"};
    })
    ctx.body = result.data;
  })

  return await app.serve();
}