// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {item,msg}=event;
  //console.log(event)
  if(item!=undefined){
    await cloud.openapi.subscribeMessage.send({
        touser: item.openId,
        page:'pages/mine/mine',
        lang:'zh_CN',
        data: {
          phrase9:{
            value:msg
          },
          name1:{
            value:item.name
          },
        },
        templateId:'5L1ylt78l2ggDq7bZpQmS6zL3_mOl9hyhCPHh86MDiQ',
        miniprogramState:'developer',
      })
  }
  
  // await cloud.openapi.customerServiceMessage.send({
  //   touser: wxContext.OPENID,
  //   msgtype: 'text',
  //   text: {
  //     content: '收到',
  //   },
  // })
  return {
    ...event,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
    MsgType: 'transfer_customer_service',
    FromUserName: event.ToUserName,
    ToUserName: event.FromUserName, 
    // ToUserName: event.ToUserName,
    // FromUserName: event.FromUserName,
    // CreateTime: event.CreateTime,
  }
}