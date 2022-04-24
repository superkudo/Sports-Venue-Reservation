// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  var c1 = new cloud.Cloud({
    // 资源方 AppID
    resourceAppid: 'wx440dbb2670a5de29',
    // 资源方环境 ID
    resourceEnv: 'appointment-qqm06',
  })

  // 跨账号调用，必须等待 init 完成
  // init 过程中，资源方小程序对应环境下的 cloudbase_auth 函数会被调用，并需返回协议字段（见下）来确认允许访问、并可自定义安全规则
  await c1.init()

  // 完成后正常使用资源方的已授权的云资源
  return c1.callFunction({
    name: 'lookupsearch',
    data: event,
  })
}