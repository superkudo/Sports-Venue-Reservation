// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'appointment-qqm06'
})
const db = cloud.database()
const _=db.command;
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  // 先取出集合记录总数
  // let {collection,search,page,par,neq}=event;
  // const countResult = await db.collection(collection).count()
  // const total = countResult.total
  // // 计算需分几次取
  // const batchTimes = Math.ceil(total / 100)
  // // 承载所有读操作的 promise 的数组
  // const tasks = []
  // if(page!=undefined){
  //   if(page=='admin'){
      
  //     search[par.name]=_.gte(par.value.startdate).and(_.lte(par.value.enddate))
      
     
  //   }
  // }
  // if(neq!=undefined){
  //   Object.keys(neq).forEach((item)=>{
  //     search[item]=_.neq(neq[item])
  //   })
  // }
  // for (let i = 0; i < batchTimes; i++) {
  //   const promise = db.collection(collection).where(search).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  //   tasks.push(promise)
  // }
  // // 等待所有
  // return (await Promise.all(tasks)).reduce((acc, cur) => {
  //   return {
  //     data: acc.data.concat(cur.data),
  //     errMsg: acc.errMsg,
  //   }
  // })
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
    name: 'searchs',
    data: event,
  })
}