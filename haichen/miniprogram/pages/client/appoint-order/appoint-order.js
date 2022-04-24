// miniprogram/pages/client/appoint-order/appoint-order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    peoplenum:1,
     peopleprice:0,
     isShow:false,
     dateStr:'',
     appointments:[],
     name:"",
     phone:"",
     comments:"",
     children:{},
     unArr:[],
     halfArr:[],
     id:"",
     mem:"",
     day:0,
     ordertime:'',
     spinning: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let obj=JSON.parse(options.place)
    if(obj.place_times==undefined){
      obj.place_times=[]
    }
    if(obj.place_images==undefined){
      obj.place_images=[];
    }
    if(obj.intro==undefined){
      obj.intro=""
    }
    if(obj.score==undefined){
      obj.score=0;
    }
    if(obj.children!=undefined){
      obj.children=obj.children.map(item=>{
        item.title=item.value;
        return item;
      })
    }
    if(obj.member!=undefined){
      if(this.data.mem==='非会员'){
        this.setData({
          day:obj.member.novip
        })
      }else if(this.data.mem=='普通会员'){
        this.setData({
          day:obj.member.commonvip
        })
      }else{
        this.setData({
          day:obj.member.vip
        })
      }
    }

    //console.log(options)
    obj.place_price=parseFloat(obj.place_price)
    

    let otime=JSON.parse(options.time)
    let time = otime.time;
    let year = otime.year;
    let month = otime.month;
    let day = otime.day;

    let order_time = year + '-' + month + '-' + day + '  ' + time

    let arr=[]
    let date=new Date();
    date.setFullYear(year,(month-1),day);
    let hour=time.split(":");
    date.setHours(hour[0]);
    date.setMinutes(0)
    let week = show_day[date.getDay()]
    arr.push({
      year:year,
      month:month,
      day:day,
      time:time,
      week:week,
      current_time:date.getTime(),
    })
    this.setData({
      obj:obj,
      peopleprice:options.price,
      name:app.globalData.user.name,
      appointments:arr,
      phone:app.globalData.user.phone,
      id:options.exid,
      mem:options.mem,
      children:JSON.parse(options.children),
      ordertime: order_time
    })
   // this.getPlaces(options);
  },

  // getPlaces:function(options){

  //   wx.cloud.callFunction({
  //     name: 'searchs',
  //     data: {
  //       collection:'place-haicheng',
  //       search:{
  //         _id:options.exid
  //       }
  //     },
  //     success: res => {
        
  //       if(res.result.result.data.length!==0){
  //         let obj=res.result.result.data[0];
  //         if(obj.place_times==undefined){
  //           obj.place_times=[]
  //         }
  //         if(obj.place_images==undefined){
  //           obj.place_images=[];
  //         }
  //         if(obj.intro==undefined){
  //           obj.intro=""
  //         }
  //         if(obj.score==undefined){
  //           obj.score=0;
  //         }
  //         if(obj.children!=undefined){
  //           obj.children=obj.children.map(item=>{
  //             item.title=item.value;
  //             return item;
  //           })
  //         }
  //         if(obj.member!=undefined){
  //           if(this.data.mem==='非会员'){
  //             this.setData({
  //               day:obj.member.novip
  //             })
  //           }else if(this.data.mem=='普通会员'){
  //             this.setData({
  //               day:obj.member.commonvip
  //             })
  //           }else{
  //             this.setData({
  //               day:obj.member.vip
  //             })
  //           }
  //         }
  //         obj.place_price=parseFloat(obj.place_price)
          
  //         this.setData({
  //           obj:obj,
  //           peopleprice:obj.place_price,
  //           name:app.globalData.user.name,
           
  //           phone:app.globalData.user.phone,
  //           //children:obj.children.length!=0?obj.children[0]:{}
  //         })
  //         // this.getUnArr(options);
  //       }
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //     }
  //   })
  // },
//   onChildren(e) {
//     const { index } = e.currentTarget.dataset
//     let f=this.data.obj.children.filter((item)=>{
//       return item.value==e.detail.value
//     })
//     this.setData({
//       children:f.length!=0?f[0]:{}
//     })
//     this.getUnArr({exid:this.data.id})
//     console.log(`onConfirm${index}`, e.detail)
// },
  // getUnArr:function(options){
  //   let date=new Date();
  //   const db=wx.cloud.database({});
  //   const cont=db.collection("order");
  //   const _=db.command;
    
  //   wx.cloud.callFunction({
  //     name: 'searchs',
  //     data: {
  //       collection:'order',
  //       search:{
  //        "obj._id":options.exid,
  //        'children':this.data.children.value,
  //        "start_time":_.gte(date.getTime()-1000*60*60*24)
  //      },
  //     },
  //     success: res => {
  //       let arr=[];
  //       let halfArr=[]
        
  //       // let temp=res.data.filter(item=>{
  //       //   return item.peoplenum<=item.users.length;
  //       // })
  //       res.result.data.forEach(item=>{
  //         if(item.peoplenum<=item.users.length){
  //           arr=[...arr,...item.appointments]
  //         }else{
  //           if(item.start_time>date.getTime()){
  //             arr=[...arr,...item.appointments]
  //           }
  //           halfArr=[...halfArr,...item.appointments]
  //         }
          
  //       })
        
  //       this.setData({
  //         unArr:arr,
  //         halfArr:halfArr
  //       })
  //     },
  //     fail: err => {
  //       //console.error('[云函数] [login] 调用失败', err)
  //     }
  //   })
  // },
  // cellClick: function () {
  //   var isShow = true
  //   this.setData({
  //     isShow: isShow
  //   })
  // },

  // _yybindchange: function (e) {
  //   let arr=[]
  //   e.detail.date.forEach(item=>{
  //     let times = item.split(".");
  //     let [year,month,day,time,week]=times;
  //     let date=new Date();
  //     date.setFullYear(year,(month-1),day);
  //     let hour=time.split(":");
  //     date.setHours(hour[0]);
  //     date.setMinutes(0)
  //     arr.push({
  //       year:year,
  //       month:month,
  //       day:day,
  //       time:time,
  //       week:week,
  //       current_time:date.getTime(),
  //     })
  //   })
  //   let pri=this.data.obj.place_price*(arr.length==0?1:arr.length)/this.data.peoplenum;
  //   pri=pri.toFixed(2);
  //   this.setData({
  //     appointments:arr,
  //     dateStr:arr.length==0?"":arr[0].year+"年"+arr[0].month+"月"+arr[0].day+"日("+arr.length+")",
  //     peopleprice:pri,
  //     isShow:false
  //   })
  // },

  // _del:function(e){
  //   this.setData({
  //     isShow:e.detail.isShow
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onChange(e) {
    const { form, changedValues, allValues } = e.detail
    // let pri=this.data.obj.place_price*(this.data.appointments.length==0?1:this.data.appointments.length)/allValues.peoplenum;
    // pri=pri.toFixed(2)
    this.setData({
     // peoplenum:allValues.peoplenum,
     // peopleprice:pri,
      comments:allValues.comments,
      name:allValues.name,
      phone:allValues.phone
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  addAppoint:function(){
    let that=this;

    
    
    // wx.requestSubscribeMessage({
    //   tmplIds: ['5L1ylt78l2ggDq7bZpQmS6zL3_mOl9hyhCPHh86MDiQ'],
    //   success (res) { 


        //that.commonApp();
       
    //   }
    // })
    if(this.data.name===""||this.data.phone===""){
      wx.showToast({
        title: '请完整填写信息',
        icon: 'none',
        duration: 1000
      })
    }
    else{
      this.check()
    }

    
  },
  check(){

    this.setData({
      spinning: true
    })

    let search=this.data.appointments[0]
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'order-haicheng',
        search:{
          appointments:{
            year:search.year,
            month:search.month,
            day:search.day,
            time:search.time
          },
          children:{
            prop:this.data.children.prop
          },
          review:'success'
        },
      },
      success: res => {
       if(res.result.result.data.length==0){
          this.commonApp();
       }else{
        wx.showToast({
          title: '时间段已被预约，请重新回到首页选择',
          icon: 'none',
          duration: 1000,
        })
       }
      
       
      },
      fail: err => {
       
      },
      complete: obj =>{
        this.setData({
          spinning: false
        })
      }
    });
    //this.commonApp();
  },
  commonApp:function(){
    if(this.data.name.trim() ==""||this.data.phone.trim()==""){
      wx.showToast({
        title: '请先完整填写个人信息',
        icon: 'none',
        duration: 1000
      })
    }else{
      // const db = wx.cloud.database();
      // const cont = db.collection('order');
      let t=new Date();
      let t_s=t.getTime();
      //console.log(t_s-this.data.appointments[0].current_time.getTime())
      if(this.data.appointments[0].current_time-t_s>1000*60*60){
        
        t.setTime(t_s+1000*60*60)
        t=t.getTime();
      }else{
        t=this.data.appointments[0].current_time
      }
      
      wx.cloud.callFunction({
        name: 'commonApi',
        data: {
          source:'insert',
          database:'order-haicheng',
          data:{
            phone:this.data.phone,
            name:this.data.name,
            create_time:new Date(),
            obj:this.data.obj,
            peoplenum:this.data.peoplenum,
            appointments:this.data.appointments,
            comments:this.data.comments,
            //start_time:this.data.appointments[0].current_time,
            start_time:t,
            peopleprice:this.data.peopleprice,
            users:[app.globalData.user],
            children:this.data.children,
            review:'unpaid'
          },
        },
        success: res => {
          wx.navigateTo({
            url: '../../info/appoint-success/appoint-success?id='+res._id+'&place_pay_src='+(this.data.obj.place_pay_src!=undefined?this.data.obj.place_pay_src:'')+'&place_phone='+(this.data.obj.place_phone!=undefined?this.data.obj.place_phone:'')+'&price=' +(this.data.peopleprice != undefined ? this.data.peopleprice : '') +'&review=unpaid',
          })

          
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      });
      // cont.add({
      //   data:{
      //     phone:this.data.phone,
      //     name:this.data.name,
      //     create_time:new Date(),
      //     obj:this.data.obj,
      //     peoplenum:this.data.peoplenum,
      //     appointments:this.data.appointments,
      //     comments:this.data.comments,
      //     //start_time:this.data.appointments[0].current_time,
      //     start_time:t,
      //     peopleprice:this.data.peopleprice,
      //     users:[app.globalData.user],
      //     children:this.data.children
      //   },
      //   success:res=>{
          
      //     wx.navigateTo({
      //       url: '../../info/appoint-success/appoint-success?id='+res._id+'&place_pay_src='+(this.data.obj.place_pay_src!=undefined?this.data.obj.place_pay_src:'')+'&place_phone='+(this.data.obj.place_phone!=undefined?this.data.obj.place_phone:''),
      //     })
          
      //   }
      // })


      // wx.request({
      //   url: 'https://wxpusher.zjiecode.com/api/send/message',
      //   data:{
      //     appToken:'AT_IJUgSnoIV6aC58CTMOrz5XY05kdydfBK',
      //     content:'您有一个新的预订需要确认，请您尽快打开海晟运动小程序进行确认。【订单信息】客户名称：'+
      //     this.data.name + '，联系方式：' + this.data.phone + '，预订时间：'+ this.data.ordertime
      //     ,
      //     summary:'海晟运动有新订单了',
      //     topicId:1926
        
      //   }
      // })



    }
  }
})