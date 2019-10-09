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
                retmsg.msg = help();
                retmsg.msgtype = 'text';
                return formatMsg(retmsg);
            case'about':
                retmsg.msg = '这里是开发者，请联系。。。解决';
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

exports.msgDispatch = function (wxmsg,retmsg){
    return userMsg(wxmsg,retmsg);
}