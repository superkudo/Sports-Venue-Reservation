// miniprogram/pages/index/edit-long/edit-long.js
import { $wuxCalendar } from '../../../components/index'
import { $wuxDialog } from '../../../components/index'
import moment from 'moment';
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldappoint:[],
    
        checkBoxValue: [],
        checkBoxLabel: [],
        startDateLabel: [moment().format('YYYY-MM-DD')],
        endDateLabel: [moment().add(6,'M').format('YYYY-MM-DD')],
        startDateValue: [parseInt(moment().format('x'))],
        endDateValue: [parseInt(moment().add(6,'M').format('x'))],
        place:{},
        repeat:'无',
        repeatList:[{title:'无',value:'无'},{title:'每周',value:'每周'},{title:'每两周',value:'每两周'},{title:'每月',value:'每月'}],
        isShow:false,
        dateStr:'',
        appointments:[],
        user:{},
        peopleprice:0,
        children:{},

        memberOps: [{
          title: '非会员',
          value: '非会员',
        },{
          title: '普通会员',
          value: '普通会员',
        }, {
            title: 'VIP',
            value: 'VIP',
        }],
        places:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   // this.getOldAppointment(options)
    this.getPlace(options)
    this.getUser(options)
    this.setData({
      places:JSON.parse(options.places)
    })
  },

  getPlace(options){
    

    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'place-haicheng',
        search:{
          _id:options.placeid
        }
      },
      success: res => {
        res.result.result.data[0].children=res.result.result.data[0].children.map(item=>{
          item.title=item.value
          return item;
        })
        this.setData({
          place:res.result.result.data[0],
          children:res.result.result.data[0].children[0],
          peopleprice:res.result.result.data[0].place_price,
        })
      },
      fail: err => {
       
      }
    })
  },
  getUser(options){
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'users-haicheng',
        search:{
          //role:"common",
          _id:options.userid
        },
        
      },
      success: res => {
        if(res.result.result.data.length!=0){
          let user=res.result.result.data[0]
          user={...user,id:user._id,openId:user._openid}
          this.setData({
            user:user
          })
        }
        
      },
      fail: err => {
      
      }
    });

    // const userdb=db.collection('users');
    // userdb.where({
    //   _id:options.userid
    // }).get({
    //   success:res=>{
    //     if(res.data.length!=0){
    //       let user=res.data[0]
    //       user={...user,id:user._id,openId:user._openid}
    //       this.setData({
    //         user:user
    //       })
    //     }
    //   }
    // })
  },

  onmem(e){
    
    let {placeid,userid,index}=e.currentTarget.dataset;

    const db=wx.cloud.database();
    let that=this;
    
    let value=e.detail.value==='非会员'?null:e.detail.value

    wx.cloud.callFunction({
      name: 'commonApi',
      data: {
        source:'update',
        database:'users-haicheng',
        id:userid,
        data:{
          member:{
            [placeid]:value
          }
        }
      },
      success: res => {
        that.getUser({userid:userid})
        
      },
      fail: err => {
       
      }
    });
    // db.collection('users').doc(userid).update({
    //   data:{
    //     member:{
    //       [placeid]:value
    //     }
    //   },
    //   success:function(res){
    //     that.getUser({userid:userid})
    //   }
    // })
  },
  _yybindchange: function (e) {
    let arr=[]
    e.detail.date.forEach(item=>{
      let times = item.split(".");
      let [year,month,day,time,week]=times;
      let date=new Date();
      date.setFullYear(year,(month-1),day);
      let hour=time.split(":");
      date.setHours(hour[0]);
      date.setMinutes(0)
      arr.push({
        year:year,
        month:month,
        day:day,
        time:time,
        week:week,
        current_time:date.getTime(),
      })
    })
    
    let pri=this.data.place.place_price*(arr.length==0?1:arr.length);
    pri=pri.toFixed(2);
    this.setData({
      appointments:arr,
      dateStr:arr.map((item)=>{
        return item.time
      }),
      peopleprice:pri,
      isShow:false
    })
    
  },
  cellClick: function () {
    var isShow = true
    this.setData({
      isShow: isShow
    })
  },

  submitform(){
 
    if(this.data.appointments.length==0||this.data.checkBoxLabel.length==0){
      wx.showToast({
        title: '请将日期或者时间补充完整',
        icon: 'none',
        duration: 1000,
      })
    }else{

    
      const cont = db.collection('order-haicheng');
      let arr=[]
      let checkTime=[];
     
      let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');

      let repeatTimeValue=[]
      let repeatTimeArr=[]
      let checkBoxValue=[]
      if(this.data.repeat=='无'){
        checkBoxValue=this.data.checkBoxValue.map(v=>v)
        repeatTimeValue=this.data.checkBoxValue.map(v=>v)

      }else if(this.data.repeat=="每周"||this.data.repeat=="每两周"){

        let num=this.data.repeat=="每周"?7:14
        this.data.checkBoxValue.forEach((item)=>{
          for(let i=item;i<this.data.endDateValue[0];i=i+(num*60*60*24*1000)){
          
            if(i>this.data.startDateValue[0])
            repeatTimeValue.push(i)
          }
        })
        
        checkBoxValue=this.data.checkBoxValue.map(v=>v)
        
      }else if(this.data.repeat=="每月"){
        this.data.checkBoxLabel.forEach((item)=>{
          
          let x=moment(item,'YYYY-MM-DD').format('x')
          while(parseInt(x)<this.data.endDateValue[0]){
            if(parseInt(x)>this.data.startDateValue[0]){
              repeatTimeValue.push(parseInt(x))
            }
              let newX=moment(x,'x').add(1,"months")
            
              x=newX.format('x')
           
            
          }
        })
        checkBoxValue=this.data.checkBoxValue.map(v=>v)
        
      }
    
      let repeatTempParam={}
     
      repeatTimeValue.forEach((item)=>{
        let tempAppointments=this.data.appointments.map((v,i)=>{
          let date=new Date(item);          
          let hour=v.time.split(":");
          date.setHours(hour[0]);
          date.setMinutes(0)
          let day=date.getDate()
          let month=parseInt(date.getMonth())+1
          let year=date.getFullYear();
          let week = show_day[date.getDay()]
          repeatTimeArr.push(date.getTime())

          return {year,
            month,
            day,
            time:v.time,
            week,current_time:date.getTime()}
        })
        checkTime=[...checkTime,...tempAppointments]

      })
      if(this.data.repeat!='无'){
        repeatTempParam={
          repeatParam:{
            startDateValue:this.data.startDateValue[0],
            endDateValue:this.data.endDateValue[0],
            repeat:this.data.repeat,
            repeatTimeArr,
          }
          
        }
      }
     
      
      checkBoxValue.forEach((item)=>{

        let tempAppointments=this.data.appointments.map((v,i)=>{
          let date=new Date(item);          
          let hour=v.time.split(":");
          date.setHours(hour[0]);
          date.setMinutes(0)
          let day=date.getDate()
          let month=parseInt(date.getMonth())+1
          let year=date.getFullYear();
          let week = show_day[date.getDay()]
          
          return {year,
            month,
            day,
            time:v.time,
            week,current_time:date.getTime()}
        })
        
        let t=new Date();
        
        if(tempAppointments.length>0){
          t=tempAppointments[0].current_time         
        }
        let params={
          phone:this.data.user.phone,
          name:this.data.user.name,
          create_time:new Date(),
          obj:this.data.place,
          peoplenum:1,
          appointments:tempAppointments,
          comments:'',
          start_time:t,
          peopleprice:this.data.peopleprice,
          users:[this.data.user],
          children:this.data.children,
          repeat:this.data.repeat,
          review:true,
          ...repeatTempParam
        }
        arr.push(params)

      })
      
      let tempRequest=this.checkOrder(checkTime)
      Promise.all(tempRequest).then((res)=>{
       
        let normal_res=res[0]
        let repeat_res=res[1]
        let tempSet=new Set()
        normal_res.forEach((item)=>{
          item.appointments.forEach((v)=>{
            tempSet.add(v.current_time)
          })
        })
        repeat_res.forEach((item)=>{
          item.repeatParam.repeatTimeArr.forEach((v)=>{
            tempSet.add(v)
          })
        })
        let tips=checkTime.filter((item)=>{
            return tempSet.has(item.current_time)
        })
        
        arr=arr.filter((item=>{
          if(item.repeatParam!=undefined){    
            item.repeatParam.repeatTimeArr=item.repeatParam.repeatTimeArr.filter((v)=>{
              return v>new Date().getTime()
            })
          }else{
            item.appointments=item.appointments.filter((v)=>{
              return v.current_time>new Date().getTime()
            })
          }
          return item.appointments.length!=0
        }))

        if(tips.length!=0){
          this.confirm(tips,arr)
        }
        else{
          this.requestOrder(arr)
        }
      })
      
    }
    
  },

  editPlace(e){
 
    let {selectedIndex} = e.detail;
    if(selectedIndex==""){
      selectedIndex=0
    }
    let currentPlace=this.data.places[selectedIndex]
    currentPlace.children=currentPlace.children.map(item=>{
      item.title=item.value;
      return item;
    })
    this.setData({
      place:currentPlace,
      children:currentPlace.children[0],
      peopleprice:currentPlace.place_price,
    })
  },
  confirm(tips,arr) {
    let that=this;
    $wuxDialog().alert({
        resetOnClose: true,
        closable: true,
        title: '选择是否继续',
        content: tips.map((v,index)=>{
          if(index>0){
            let p=tips[index-1];
            if((v.year+'.'+v.month+'.'+v.day)==(p.year+'.'+p.month+'.'+p.day)){
              return v.time
            }
          }
          
          return '  '+v.year+'.'+v.month+'.'+v.day+' '+v.time
        })+','+tips.length+'个时间段已有人预定，请重新选择',
        onConfirm(e) {
            // let tipsSet=new Set(tips.map((v)=>{
            //   return v.current_time
            // }))
           
            // let newArr=arr.filter((item=>{
            //   if(item.repeatParam!=undefined){
            //     // item.repeatParam.unRepeatTimeArr=tips.map((v)=>{
            //     //   return v.current_time
            //     // })
            //     item.repeatParam.repeatTimeArr=item.repeatParam.repeatTimeArr.filter((v)=>{
            //       return !tipsSet.has(v)
            //     })
            //   }else{
            //     item.appointments=item.appointments.filter((v)=>{
            //       return !tipsSet.has(v.current_time)
            //     })
            //   }
              
            //   return item.appointments.length!=0
            // }))
           
            // that.requestOrder(newArr)
        },
        
    })
  },
  requestOrder(arr){

    let arrRequest=arr.map((item)=>{
      return this.insertOrder(item)
    })
    if(arr.length!=0)
    //Promise.all(arrRequest).then(response=>{
      wx.showToast({
        title: '您已为'+this.data.user.name+'成功预约',
        icon: 'none',
        duration: 1000,
      })
      //this.getOldAppointment({placeid:this.data.place._id,userid:this.data.user._id})
   // })
    
  },
  checkOrder(item){
    
    let promiseRq=new Promise((reslove,reject)=>{
      this.tempRequest('appointments.current_time',item,reslove)
    })
    let promiseRq2=new Promise((reslove,reject)=>{
      this.tempRequest('repeatParam.repeatTimeArr',item,reslove)
    })
    
    return [promiseRq,promiseRq2]
    
  },

  tempRequest(param,item,reslove){
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'order-haicheng',
        search:{
          obj:{
            _id:this.data.place._id
          },
         
        },
        page:"admin",
        par:{
          name:param,
          //second:"current_time",
          value:{
            startdate:item[0].current_time,
            enddate:item[item.length-1].current_time
          }
        }
        
      },
      success: res => {
        
        reslove(res.result.result.data)
        
      },
      fail: err => {
        reslove([])
       
      }
    });
  },
  async insertOrder(params){
   
    // const _=db.command;
    // //const cont = db.collection('order');
    // let res=await db.collection('order').add({
    //   data:params
    // })

    return wx.cloud.callFunction({
      name: 'commonApi',
      data: {
        source:'insert',
        database:'order-haicheng',
        data:params
      },
      success: res => {
        
       
      },
      fail: err => {
       
      }
    });
    
  },
  getOldAppointment(options){
    
    const _ = db.command
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'order-haicheng',
        search:{
          //role:"common",
          obj:{
            _id:options.placeid
          },
          'users':{id:options.userid}
        },
        
      },
      success: res => {
       
        this.setData({
          oldappoint:res.result.result.data
        })
        
      },
      fail: err => {
      
      }
    });

    
  

  },

  onConfirm(e) {
    let {type}=e.currentTarget.dataset
   
    if(type=="children"){
      let temp=this.data.place.children.filter((item)=>{
        return item.value==e.detail.selectedValue
      })
      if(temp.length!=0){
        this.setData({
          [type]:temp[0]
        })
      }
    }else{
      this.setData({
     
        [type]:e.detail.selectedValue
      })
    }
    
  },

  openCalendar1() {
    $wuxCalendar().open({
        value: this.data.value1,
        onChange: (values, displayValues) => {
            
            this.setData({
                value1: displayValues,
            })
        },
    })
  },
  openCalendar2() {
    // let obj={}
    //   if(this.data.repeat=='每周'){
    //     obj=this.getweek()
    //   }
      $wuxCalendar().open({
          value: this.data.checkBoxLabel,
          multiple: true,
          // ...obj,
          minDate:new Date().getTime()-24*60*60*1000,
          onChange: (values, displayValues) => {
              
              this.setData({
                checkBoxLabel: displayValues,
                checkBoxValue:values.map((item)=>{
                  if(isNaN(item)){
                    item=parseInt(moment(item,'YYYY-MM-DD').format('x'))
                  }
                
                  return item
                }),
              })
          },
      })
  },

  getweek(){
    let nowData = new Date();
    //获取今天的是周几
    let currentDay = nowData.getDay();
    //把currentDay == 0赋值给周日
    if(currentDay == 0){
        currentDay = 7
    }
    
    // 获取周一的时间戳
    let monDayTime = nowData.getTime() - (currentDay ) * 24 * 60 * 60 * 1000;
  
    // 获取周日的时间戳
    let sunDayTime = nowData.getTime() + (7 - currentDay) * 24 * 60 * 60 * 1000;

    return {
      minDate:monDayTime,
      maxDate:sunDayTime
    }
  },
  openCalendar3() {
      
      $wuxCalendar().open({
        value: this.data.startDateLabel,
        onChange: (values, displayValues) => {
           
            this.setData({
              startDateLabel: displayValues,
              startDateValue:values
            })
        },
    })
  },
  openCalendar4() {
      

      $wuxCalendar().open({
        value: this.data.endDateLabel,
        onChange: (values, displayValues) => {
         
            this.setData({
              endDateLabel: displayValues,
              endDateValue:values,
            })
        },
    })
  },
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

  }
})