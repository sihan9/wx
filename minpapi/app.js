const titbit = require('titbit');
const fs = require('fs');
const funcs = require('./functions');
const marked = require('marked');
const mdb = require('./initdb');

const xmlparse = require('xml2js').parseString;
const wxmsg = require('./msghandle');

var app = new titbit({
  //debug: true, //开启调式模式，会输出错误信息
  //showLoadInfo: false,
  daemon: true,
});

var {router} = app; //相当于 var router = app.router;

var _dbpath = './mddata';

//填写自己的域名
mdb.domain = 'https://sh.niedan.top';
mdb.loadData(_dbpath);


router.get('/search', async c => {
  let kwd = '';
  if (c.query.q !== undefined) {
    kwd = c.query.q.trim();
  }

  try {
    c.res.body = {
      status: 0,
      list : mdb.search(kwd)
    };
  } catch (err) {
    console.log(err);
    c.res.status(404);
  }

});

router.get('/images/:name', async c => {
  let imgfile = `${_dbpath}/images/${decodeURIComponent(c.param.name)}`;
  try {
    let content_type = '';
    let extname = c.helper.extName(imgfile);

    switch (extname.toLowerCase()) {
      case '.png':
        content_type = 'image/png'; break;
      case '.jpg':
      case '.jpeg':
        content_type = 'image/jpeg'; break;
      case '.gif':
        content_type = 'image/gif'; break;
      default:;
    }
    c.res.setHeader('content-type', content_type);

    let data = await funcs.readFile(imgfile, 'binary');

    c.res.setHeader('content-length', data.length);

    c.res.encoding = 'binary';
    c.res.body = data;
  } catch (err) {
    c.res.status(404);
  }
});

router.get('/a',async c =>{
  //返回URL查询参数
  c.res.body = c.query;
})

app.router.post('/wx/msg', async c => {
  try {
      let data = await new Promise((rv,rj) => {
          xmlparse(c.body,{explicitArray:false},
              (err,result) => {
                  if(err){
                      rj(err);
                  }else{
                      rv(result.xml);
                  }
              });
      });
      let retmsg = {
          touser : data.FromUserName,
          fromuser : data.ToUserName,
          msgtype : '',//为空，在处理时动态设置类型
          msgtime : parseInt(Date.now()/1000),
          msg :data.Content
      };
      //交给消息派发函数进行处理
      //要把解析后的消息和要返回的数据对象传递过去
      c.res.body = wxmsg.msgDispatch(data,retmsg);
  } catch (err) {
      console.log(err);
  }
});
app.daemon(8009, 'localhost');
