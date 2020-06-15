// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router("homeRep",async (ctx) => {
    let query = ctx._req.event;
    await axios({
      method : "get",
      url : `http://182.92.178.28:8877/repos?listType=${query.listType}&pageNo=${query.pageNo}&pageSize=${query.pageSize}`
    }).then(res => {
      ctx.body = res.data;
    }).catch(err => {
      ctx.body = {"status": "fail","inf":err}
    })
  })
  return await app.serve();
}