// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

// 请求仓库信息
  app.router("repMoreInf",async (ctx) => {
    let result = {};
    await axios({
      method : "get",
      url : `https://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}`
    }).then(res => {
      result = res;
    }).catch(err => {
      result = {"status":"false","data":"failure request"}
    })

    ctx.body = result.data;
  })




  // 请求文件夹信息
  app.router("foldersInf",async (ctx ) => {
  
    let result = {};
    await axios.get(`http://182.92.178.28:8877/repos/QuizHub/${ctx._req.event.repName}`).then(res => {
      result = res.data;
      ctx.body = result.data.fileInfoList;
    }).catch(err => {
      result = {"status" : "error"};
      ctx.body = result;
    })
  });


  // 请求readme
  app.router("readMeContent", async (ctx) => {
    let result = {};
    await axios({
      method: "get",
      url : `http://182.92.178.28:9999/repos/${ctx._req.event.owner}/${ctx._req.event.repName}/files/blob/master/readme.md`,
      headers : {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      result = res.data.data.content;
      let content_base64 = Buffer.from(result,"base64");
      let content = content_base64.toString();
      console.log(content);
      
      ctx.body  = content;
    }).catch(err => {
      result = {"status" : "failure" , "inf" : "查看文件内容失败"};
      console.log(result);
    })

  })

  // 请求文件信息
  app.router("requestBlob",async (ctx) => {
    await axios({
      method : "get",
      url : `http://182.92.178.28:9999/repos/${ctx._req.event.owner}/${ctx._req.event.repName}/files/blob/master/${ctx._req.event.path}`,
    }).then(res => {
      ctx.body = res.data;
    }).catch(err => {
      result = {"status" : "failure" , "inf" : "查看目录失败"};
      ctx.body = result;
    })
  })

  // 多级目录请求
  app.router("requestTree",async (ctx) => {
    await axios({
      method : "get",
      url : `http://182.92.178.28:9999/repos/${ctx._req.event.owner}/${ctx._req.event.repName}/files/tree/master/${ctx._req.event.path}`,
    }).then(res => {
      ctx.body = res.data;
    }).catch(err => {
      result = {"status" : "failure" , "inf" : "查看目录失败"};
      ctx.body = result;
    })

  })

  // word解析请求

  app.router("analysisDoc",async (ctx) => {
    await axios({
      method : "post",
      url : `http://182.92.178.28:8877/anaylsis/`,
      params : {
        assessmentName : ctx._req.event.assessmentName,
        filePath : ctx._req.event.filePath,
        owner : ctx._req.event.owner,
        repoName : ctx._req.event.repName
      }
    }).then(res => {
      
      ctx.body = res.data;
    }).catch(err => {
      ctx.body = {"status": "fail", "err":err};
    })

    console.log(ctx._req.event)
  })

  // 请求问题总揽
  app.router("questionInf",async (ctx) => {

    let result = {};
    await axios.get("http://182.92.178.28:8877/repos/LeHr/ceshi/quizzes").then(res => {
      result = res;
  
    }).catch(err => {
      result = { "status " :  "error"};
    })
    ctx.body = result.data;
  })

  // 请求问题
  /*
  ctx {
    _req : {
      event : {
        id : ""
      }
    }
  }




  */
  app.router("assessment",async (ctx) => {
    let id  = ctx._req.event.id;
    let result = {};
    await axios.get(`http://182.92.178.28:8877/repos/{owner}/{repoName}/quizzes/${id}`).then(res => {
      result = res;
    }).catch(err => {
      result = { "status " :  "error"};
    })
    ctx.body = result.data;
  })

  // 评论区
  app.router("selectDiscuss",async(ctx) => {
    let user = ctx._req.event.user;
    let repName = ctx._req.event.repName;
    let result = {}
    await axios.get(`http://182.92.178.28:8877/repos/${user}/${repName}/comments`)
    .then(res => {
      result = res;
    })
    .catch(err => {
      result = res;
    })
    ctx.body = result.data;
  })

  // 进行评论
  app.router("sendDiscuss",async (ctx) => {
    let user = ctx._req.event.user;
    let repName = ctx._req.event.repName;
    let text = ctx._req.event.text;
    let result = {};
    await axios({
      method : "post",
      url : `http://182.92.178.28:8877/repos/${user}/${repName}/comments?text=${text}`
    })
    .then(res => {
      result = res;
    })
    .catch(err => {
      result = err;
    })
    // 这里不能直接写result，否则会造成JSON序列化问题
    ctx.body = result.data;
  })

  app.router("replyDiscuss",async (ctx) => {
    let user = ctx._req.event.user;
    let repName = ctx._req.event.repName;
    let text = ctx._req.event.text;
    let replyId = ctx._req.event.commentId;
    let result = {};
    await axios({
      method : "post",
      url : `http://182.92.178.28:8877/repos/${user}/${repName}/${replyId}/replies?text=${text}`
    })
    .then(res => {
      result = res;
    })
    .catch(err => {
      result = err;
    })
    // 这里不能直接写result，否则会造成JSON序列化问题
    ctx.body = result.data;
  })

  


  



  return await app.serve();
}