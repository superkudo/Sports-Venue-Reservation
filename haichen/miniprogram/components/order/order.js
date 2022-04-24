// components/order/order.js
import { $wuxCountDown } from '../index'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    str:{
      type: Object,
      value: {}
    },
    user:{
      type: Object,
      value:{}
    },
    page:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    orders:[],
    count:[],
    showlength:0,
    orderStr:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    call(){
      this.setData({
        orders:[]
      })
     
      wx.cloud.callFunction({
        name: 'searchs',
        data: {
          collection:'order',
          search:this.data.str,
        },
        success: res => {
          let len=res.result.data.length;
          this.setData({
            orders:res.result.data.map(item=>{
              let newDate=new Date();
              if(this.data.page=="reserved"||this.data.page=="complete"){
                
                let {year,month,day,time,week}=item.appointments[0];
                let date=new Date();
                date.setFullYear(year,(month-1),day);
                let hour=time.split(":");
                date.setHours(hour[0]);
                date.setMinutes(0);
                item.start_time=date.getTime();
              }
              let jiuDate=new Date(item.start_time)
              if(this.data.page=="hot"){ 
                item.show=(item.peoplenum>item.users.length)&&(jiuDate.getTime()>newDate.getTime())?"block":"none";
                if(item.show=="block"){
                  len++;
                }else if(item.show=="none"){
                  len--;
                }
              }
              if(this.data.page=="reserved") item.show=(jiuDate.getTime()>newDate.getTime())?"block":"none";
              if(this.data.page=="complete") item.show=(jiuDate.getTime()<newDate.getTime())?"block":"none";
              if(this.data.page=="order") item.show="block";
              return item;
            }).sort((a,b)=>{
              return b.start_time-a.start_time
            })
          })
          this.setData({
            showlength:len
          })
          
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      });
    },
    open(e){
      this.triggerEvent('open',{id:e.detail.id})
    },
    async getOrders(){
      
      let that=this;
      const db = wx.cloud.database();
      this.watch=db.collection("order")
        .where(this.data.str).watch({
          onChange: function(snapshot) {
            let change={}
            if(snapshot.docChanges.length==1&&snapshot.docChanges!=undefined){
              change=snapshot.docChanges[0].doc
              change.is=false
            }
            let len=snapshot.docs.length;
            that.setData({
              orders:snapshot.docs.map(item=>{
                let newDate=new Date();
                if(that.data.page=="reserved"||that.data.page=="complete"){
                  item.hour=item.start_time;
                  let {year,month,day,time,week}=item.appointments[0];
                  let date=new Date();
                  date.setFullYear(year,(month-1),day);
                  let hour=time.split(":");
                  date.setHours(hour[0]);
                  date.setMinutes(0);
                  item.start_time=date.getTime();
                }
                let jiuDate=new Date(item.start_time)
                if(that.data.page=="hot"){ 
                  item.show=(item.peoplenum>item.users.length)&&(jiuDate.getTime()>newDate.getTime())?"block":"none";
                  if(item.show=="block"){
                    len++;
                    if(change.obj!=undefined){
                      if(item.obj._id==change.obj._id&&change._id!=item._id){
                        let map=new Map();
                        item.appointments.forEach(o1=>{
                          map.set(o1.year+"."+o1.month+"."+o1.day+"."+o1.time)
                        })
                        change.appointments.forEach(o2=>{
                          if(map.has(o2.year+"."+o2.month+"."+o2.day+"."+o2.time)&&change.users.length>=change.peoplenum){
                           
                              if(us.id==that.data.user.id&&change.is==false){                         
                                change.is=true;
                                db.collection("order").doc(item._id).update({
                                  data:{
                                    merge:true
                                  },
                                  success:res=>[
                                   
                                  ]
                                })
                              }
                           
                            
                          }
                        })
                      }
                    }
                  }else if(item.show=="none"){
                    len--;
                  }
                }
                if(that.data.page=="reserved") item.show=(jiuDate.getTime()>newDate.getTime())?"block":"none";
                if(that.data.page=="complete") item.show=(jiuDate.getTime()<newDate.getTime())?"block":"none";
                if(that.data.page=="order") item.show="block";
                return item;
              }).sort((a,b)=>{
                return b.start_time-a.start_time
              })
            })
            that.setData({
              showlength:len
            })
          },
          onError: function(err) {
            that.getOrders();
          }
        })
        
    },
    toClient:function(){
      wx.switchTab({
        url: '/pages/client/client',
      })
    },
    appoint:function(event){
      let {type,url}=event.detail;
      this.triggerEvent('appoint', {url:url,type:type})
    },
  },
  attached: function () {
    this.setData({
      orders:[]
    })
    if(this.data.page=="reserved"||this.data.page=="complete"||this.data.page=="order"){
      this.setData({
        str:{
                'users':{id:app.globalData.user.id}
              },
          orderStr:{
            'users':{id:app.globalData.user.id}
          }
      })
      this.getOrders()
    }else if(this.data.page=="evaluated"){
      wx.cloud.callFunction({
        name: 'lookupsearch',
        data: {
          openId:wx.getStorageSync('openId'),
          main:"order",
          major:{
            'users':{id:app.globalData.user.id}
          },
          lookup:{
            from:'comment',localField:'_id',foreignField:'order_id',as:'list'
          }
        },
        success: res => {
          this.setData({
            orders:res.result.list.filter(item=>{
              item.show="block"
              return item.list.length==0;
            }).sort((a,b)=>{
              return b.start_time-a.start_time
            })
          })
          
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    
    }else if(this.data.page=="hot"){
      let date=new Date().getTime();
      const db=wx.cloud.database({})
      const _ = db.command
      this.setData({
        str:{   
          'start_time':_.gte(date-1000*60*60)
        },
        orderStr:{
          'start_time':_.gte(date-1000*60*60)
        }
      })
     
      this.getOrders()
    }
    else{
      this.getOrders();
    }
    
  },
  
  observers: {
    'user'(user) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
   
    },
    'orders'(orders){
      //if(orders.length)
      if(orders.length!=0){
        let count=this.data.count;
        count.push(orders.length);
        //console.log(count,orders)
        
        if(count.length>1){
          if(count[count.length-1]!=count[count.length-2]){
           
            this.call()
          }
        }
      }
      
    },
    // 'str'(str){
    //   this.getOrders()
    // }

  }
})
