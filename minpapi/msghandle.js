const formatMsg = require('./fmtwxmsg');

function help(){
    //字符串形式返回帮助信息
    //还可以是以读取文件的形式来返回
    return '你好这是一个测试号，暂不支持视频类型'
}
/**
 * @param {object} wxmsg 解析XML消息的对象
 * @param {object} retmsg 要返回的数据对象
 **/
function userMsg (wxmsg,retmsg){
    //关键字自动回复
    if(wxmsg.MsgType == 'text'){
        switch(wxmsg.Content){
            case'帮助':
            case'help':
            case'?':
            case'？':
                retmsg.msg = help();
                retmsg.msgtype = 'text';
                return formatMsg(retmsg);
            case'about':
                retmsg.msg = '这里是开发者，请联系微信号sihan_996解决';
                retmsg.msgtype = 'text';
                return formatMsg(retmsg);
            case 'who':
                retmsg.msg = '姓名：司涵\n学号：2017011904';
                retmsg.msgtype = 'text';
                return formatMsg(retmsg);
            default:
                retmsg.msg = wxmsg.Content;
                retmsg.msgtype = wxmsg.MsgType;
                return formatMsg(retmsg);
        }
    }
    //处理其他类型的消息
    switch(wxmsg.MsgType){
        case'image':
        case'voice':
            retmsg.msg = wxmsg.MediaId;
            retmsg.msgtype = wxmsg.MsgType;
            return formatMsg(retmsg);
        default:
            //retmsg.msgtype 类型为空
            //格式化数据会返回default处的数据
            //提示用户该类型不被支持
            return formatMsg(retmsg);
    }
}

exports.userMsg = userMsg;
exports.help = help;

function eventMsg(wxmsg,retmsg){
    //把返回消息的类型设置为text
    retmsg.msgtype = 'text';
    switch(wxmsg.Event){
        case 'subscribe':
            retmsg.msg = 'hi,来啦~';
            return formatMsg(retmsg);
        case 'unsubscribe':
            console.log(wxmsg.FromUserName,'取消关注');
            break;
        case 'CLICK':
            retmsg.msg = wxmsg.EventKey;
            return formatMsg(retmsg);
        case 'VIEW':
            console.log('用户浏览',wxmsg.EventKey);
            break;
        default:
            return '';
    }
}
exports.msgDispatch = function (wxmsg,retmsg){
    if(wxmsg.MsgType == 'event'){
        return eventMsg(wxmsg,retmsg);
    }
    return userMsg(wxmsg,retmsg);
}