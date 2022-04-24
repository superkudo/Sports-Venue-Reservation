// components/singelorder/singelorder.js
import { $wuxCountDown } from '../index'
const apps = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object,
      value:{}
    },
    user:{
      type: Object,
      value:{}
    },
    isShow:{
      type:Boolean,
      value:false
    },
    page:{
      type:String,
      value:""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    order:{},
    dao:{
      days:0,
              hours:0,
              min:0,
              sec:0
    },
    start_date:"",
    end_date:"",
    dateStr:"",
    currentDate:new Date().getTime(),
    visible:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDao:function(){
     
      
      let app=this.data.obj.appointments;
     
      let end=parseInt(app[app.length-1].time.split(":")[0])+1;
      
      this.setData({
        order:this.data.obj,
        start_date:app[0].time,
        end_date:end+":00",
        dateStr:app[0].year+"."+parseInt(app[0].month)+"."+app[0].day+" "
      })
    },
    timedate:function(){
      //console.log(this.data.obj.start_time,this.data.obj.appointments[0].current_time)
      //console.log(this.data.obj,this.data.order)
      let that=this;
      if(that.data.obj.start_time  instanceof  Object ){
        let obj=that.data.obj
        let {year,month,day,time,week}=that.data.obj.appointments[0];
        let date=new Date();
        date.setFullYear(year,(month-1),day);
        let hour=time.split(":");
        date.setHours(hour[0]);
        date.setMinutes(0);
        obj.start_time=date.getTime();
      }
      this.dao=new $wuxCountDown({
        date:new Date(that.data.obj.start_time),
        render(date) {
          const days = date.days==0?"":this.leadingZeros(date.days, 2)
          const hours = this.leadingZeros(date.hours, 2) 
          const min = this.leadingZeros(date.min, 2) 
          const sec = this.leadingZeros(date.sec, 2) 
          
          // that.setData({
          //     dao:  '<span>'+days + hours + min + sec+'</span>',
          // })
          //console.log(min,sec,that)
          that.setData({
            dao:{
              days:days,
              hours:hours,
              min:min,
              sec:sec
            }
          })
        },
      })
      this.dao.start();
    },
    appoint:function(event){
      if(wx.getStorageSync('userInfo')!==undefined&&wx.getStorageSync('userInfo')!==""){
        let obj=event.currentTarget.dataset.item;
        let str="id="+this.data.obj._id
        // Object.keys(obj).forEach(item=>{
        //   if(obj[item] instanceof Array){
        //     obj[item]=JSON.stringify(obj[item]);
        //   }
        //   str=str+item+"="+obj[item]+"&"
        // })
        let mem=apps.globalData.user.member[obj._id]==null?"非会员":apps.globalData.user.member[obj._id]
        let ser=str+'&mem='+mem
        this.triggerEvent('appoint', {url:ser,type:'nav'})
      }else{
        wx.showToast({
          title: '请登录',
          icon: 'none',
          duration: 500
        })
        this.triggerEvent('appoint', {url:'../mine/mine',type:'tab'})
      }
    },
    orderdetail:function(e){
      let item=e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/pages/client/order-page/order-page?id='+item._id,
      })
    },
    delAppoint:function(event){
     
      let item=event.currentTarget.dataset.item;
      item.openId=item.obj._openid;
      let that=this;
      const db=wx.cloud.database({});
      wx.showModal({
        title: '',
        content: '您确定要撤销预约吗？',
        success (res) {
          if (res.confirm) {
            if(item.users.length==1){
              
              db.collection("order").doc(item._id).remove({
                success:res=> {
                  item.name=item.users[0].name
                  item.show="none";
                  that.setData({
                    obj:item
                  })
                }
              })
            }else if(item.users.length>1){
              item.users=item.users.filter(op=>{
                return op.id!=that.data.user.id
              })
              item.name=that.data.user.name;
              item.show="none"
              that.setData({
                obj:item
              })
              db.collection("order").doc(item._id).update({
                data:{
                  users:item.users
                }
              })
              
            }
            wx.showToast({
              title: '成功撤销',
              icon: 'success',
              duration: 500
            })
            wx.cloud.callFunction({
              name: 'activeNotifi',
              data: {
                item:item,
                place:{},
                msg:"预约被撤销"
              },
              success: res => {
               
              },
              fail: err => {
                //console.error('[云函数] [login] 调用失败', err)
              }
            })
          } else if (res.cancel) {
                
          }
        }
      })
    },
    open(e){
      this.setData({
        visible:true
      })
      this.triggerEvent('open',{id:this.data.obj._id})
    },
    close() {
      this.setData({
          visible: false,
      })
    },
  },
  attached: function () {
    if(Object.keys(this.data.obj).length!=0){
      this.getDao()
      this.timedate()
    }
     
  },
  observers: {
    'obj'(obj) {
      //console.log(obj)
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      if(Object.keys(this.data.obj).length!=0){
        this.getDao()
      }
    }
  }
})
