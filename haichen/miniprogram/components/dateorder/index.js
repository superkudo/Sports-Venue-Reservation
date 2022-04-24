// components/dateorder/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    form:{
      type:Object,
      value:{}
    },
    openId:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getorder(){
      // const db=wx.cloud.database({})
      // const _=db.command;
  
      let startdate=new Date().getTime();
      let enddate=startdate+7*24*60*60*1000
      // db.collection('order').where({
      //   'obj._openid':this.data.openId,
      //       'obj.place_name':this.data.form.casvalue[0],
      //       'children':this.data.form.casvalue[1],
      //       'appointments.current_time':_.gt(startdate).and(_.lt(enddate))
      // }).get()
      wx.cloud.callFunction({
        name: 'searchs',
        data: {
          collection:'order',
          search:{
            'obj._openid':this.data.openId,
            'obj.place_name':this.data.form.casvalue[0],
            'children':this.data.form.casvalue[1],
          },
          page:'admin',
          par:{
            name:'appointments.current_time',
            value:{
              startdate:startdate,
              enddate:enddate
            }
          }
        },
        success: res => {
          console.log(res)
          // this.setData({
          //   appoint:res.result.data.reverse()
          // })
         
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      });
    },
  },
  observers: {
    'form'(form) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      if(form.casvalue.length==2){
        console.log(form)
        this.getorder()
      }
      
    },
  }
})
