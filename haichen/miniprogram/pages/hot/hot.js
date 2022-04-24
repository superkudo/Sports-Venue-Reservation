// miniprogram/pages/hot/hot.js
import { $wuxDialog, $wuxToast } from '../../components/index'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    str:{
      place_open:true,
      ishot:"hot"
    },
    orderStr:{
      
    },
    nvabarData: {      
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示      
      showBack:1,      
      showHome:1,      
      title: '海晟网球', //导航栏 中间的标题   
   },   
   height: app.globalData.height * 2 + 20, 
    user:{},
    // images:[{
    //   src:"cloud://appointment-qqm06.6170-appointment-qqm06-1301904565/Carousel/0.jpg"
    // },{
    //   src:"cloud://appointment-qqm06.6170-appointment-qqm06-1301904565/Carousel/1.jpg"
    // },
    // {
    //   src:"cloud://appointment-qqm06.6170-appointment-qqm06-1301904565/Carousel/2.jpg"
    // }],
    swiperCurrent:0,
    role:'用户',
    currday:[2020,5,4],
    times:{
      "08:00":0,
      "09:00":1,
      "10:00":2,
      "11:00":3,
      "12:00":4,
      "13:00":5,
      "14:00":6,
      "15:00":7,
      "16:00":8,
      "17:00":9, 
      "18:00":10,
      "19:00":11,
      "20:00":12
    },
    listData:[],
    place:{},
    appoint:[],
    places:[],
    mem:'',
    visible1: false,
      popup:{},
      day:0,
      priceMap:new Map(),
      spinning: false,
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setTabBarItem({
    //   index: 1,
    //   text: '登录',
    // })
   
    // const db = wx.cloud.database()
    // const _ = db.command;
    // let str={
    //   peoplenum:_.eq(1)
    // }
    // this.setData({
    //   str:str,
    // })
    wx.getSetting({
      success(res) {
        //console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              //wx.startRecord()
            }
          })
        }
      }
    })
   
    // wx.getSetting({
    //   success: res => {
       
        //if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserProfile({
          //   desc:'获取用户信息',
          //   success: res => {
              //console.log(res)
              // wx.cloud.callFunction({
              //   name: 'login',
              //   data: {
              //     weRunData: wx.cloud.CloudID(res.cloudID), // 这个 CloudID 值到云函数端会被替换
              //   },
              //   success:res=>{
              //     this.setData({
              //       userInfo:res.result.weRunData.data
              //     })
              //   }
              // })
              //app.globalData.userInfo=res.userInfo;
              //wx.setStorageSync("userInfo", res.userInfo);
              //this.onGetOpenid();
          //     wx.setTabBarItem({
          //       index: 1,
          //       text: '个人中心',
          //     })
          //   }
          // })
        //}
    //   }
    // })
    let date=new Date();
    this.setData({
      currday:[date.getFullYear(),date.getMonth(),date.getDate()],
    })
    this.onGetOpenid();
    //this.getPlace()
  },
  call(){
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'order-haicheng',
        search:{},
      },
      success: res => {
        let newAppoint=res.result.result.data.map((item)=>{
          if(item.repeat!='无'&&item.repeatParam!=undefined&&item.repeatParam.repeatTimeArr!=undefined){
            item.appointments=item.repeatParam.repeatTimeArr.map(v=>{
              let date =new Date(v);
              let day=date.getDate()
              let month=parseInt(date.getMonth()+1)
              let year=date.getFullYear();
              let week = show_day[date.getDay()]
              let time=date.getHours()+":00"
               return {year,
                month,
                day,
                time,
                week,current_time:v}
            })
          }
          return item
        })
        let getTime=parseInt(new Date().getTime())
        newAppoint=newAppoint.filter((item)=>{
          if(item.review=='refuse'){
            return false
          }else{
            return true
          }
        })
        this.setData({
          appoint:newAppoint.reverse()
        },()=>{
          
          //console.log(app)

          if(app.globalData.user)
          {
            this.setListData(app.globalData.user.role)
          }

          
        })
       
      },
      fail: err => {
       
      }
    });
  },
  setListData(role){
    if(role==''||role==undefined){
      role="common"
    }
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let {listData,appoint,currday,place,times,priceMap}=this.data
    listData=[]
    
    Object.keys(times).forEach((item)=>{
      let tempObj={
        time:item
      }
      if(place.children!=undefined)
      place.children.forEach((p,i)=>{
      
        let time = item;
        let year = currday[0];
        let month = currday[1];
        let day = currday[2];

        let date=new Date();
        date.setFullYear(year,(month-1),day);
        let hour=time.split(":");
        date.setHours(hour[0]);
        date.setMinutes(0)

        let getTime= new Date().getTime();
        if(this.data.day > 1)
        {
          getTime=getTime+(this.data.day*24*60*60*1000)
        }
        else
        {
          getTime=getTime+24*60*60*1000
        }
        

        //console.log(priceMap)

        //console.log(this.data.mem)
      
        

        let nowTime = new Date().getTime()
        tempObj[p.prop]={
          label:"-",
          time:{
            day:day,
            month:month,
            year:year,
            time:item,
            week:show_day[date.getDay()],
            current_time:date.getTime()
          },
          price:priceMap.has(show_day[date.getDay()]+'.'+item)?priceMap.get(show_day[date.getDay()]+'.'+item): this.data.mem == 'VIP' ? place.vip_price : this.data.mem == '普通会员' ? place.member_price :  place.place_price,
          disabled:date.getTime()<getTime&& date.getTime()>nowTime? true :false
        }
      })
      listData.push(tempObj)
    })
    
    this.setData({
      listData:listData
    })

    // console.log(6666)
    // console.log(appoint)
    
    appoint=appoint.filter((item)=>{
        let tempArr=item.appointments.filter((a,i)=>{
          return a.year==currday[0]&&a.month==currday[1]&&a.day==currday[2]
        })
        return tempArr.length!=0
    })
    
    // console.log(242536)
    // console.log(appoint)
  
    appoint.forEach((item)=>{
      item.appointments.forEach((v)=>{
        let lindex=(times[v.time])
        
        if(item.children.prop!=undefined){
         
          if(v.year==currday[0]&&v.month==currday[1]&&v.day==currday[2]){
            let label=item.name.substring(0,1)+'**'
            
              if(item.review!='success'){
                label='审核中'
              }
            
            listData[lindex][item.children.prop]={
              ...listData[lindex][item.children.prop],
              order:item,time:v,label:label, disabled: true
            }
            
          }
          
          // if(role=='common'){
          //   console.log(item.users[0]._openid,this.data.user._openid)
          //   if(item.users[0]._openid!=this.user._openid)
          //   listData[lindex][item.children.prop].label=''
          // }
        }
      })
    })
    this.setData({
      listData:listData
    })
  },
  getPlace(){
    let mem='非会员'
    let day=0
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'place-haicheng',
        search:{}
      },
      success: res => {
        
        let map=new Map()
        let places=res.result.result.data
        //console.log(places)
        places[0].children=places[0].children.map(item=>{
          item.title=item.value.length>3?item.value.substring(0,3)+'...':item.value
          return item;
        })
        if(this.data.user.member[places[0]._id]!=undefined){
          
            mem=this.data.user.member[places[0]._id]
            
        }
        //console.log(this.data.user.member)
        if(mem=='非会员'){
          day=places[0].member.novip
        }else if(mem=='普通会员'){
          day=places[0].member.commonvip
        }else{
          day=places[0].member.vip
        }


        //console.log(day);
        places[0].place_times.forEach((v)=>{
          if(v.show){
            v.weekday.forEach(w=>{
              v.daytime.forEach(d=>{
                map.set(w+'.'+d,v.price)
              })
            })
          }
        })

        let sonpalce = [];

        places[0].children.map((c)=>{
          if(c.show)
          {
            sonpalce.push(c)
          }
        })

        places[0].children = sonpalce
        
        this.setData({
          places:places,
          place:places[0],
          mem:mem,
          day:day,
          priceMap:map
        },()=>{
          //console.log(this.data.priceMap)
          this.call();
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onGetOpenid: function() {
    // this.setData({
    //   spinning: true
    // })


    // 调用云函数
    return wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log(res)
        app.globalData.openId = res.result.userInfo.openId
        wx.setStorageSync("openId", res.result.userInfo.openId);
        // if(wx.getStorageSync('userInfo'))
       
        // if(wx.getStorageSync('userInfo')!=''){
        //   app.globalData.user=wx.getStorageSync('userInfo')
          
        //   this.setData({
        //     user:wx.getStorageSync('userInfo'),
        //     role:wx.getStorageSync('role')!=''?wx.getStorageSync('role'):'用户'
        //   })
        // }else{
          this.getUser();
        // }
        
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  placeappoint:function(event){
    let {type,url}=event.detail;
    //console.log(url)
    if(type=="nav"){
      wx.navigateTo({
        url: '../client/place-detail/place-detail?'+url,
      })
    }else{
      wx.switchTab({
        url: url,
      })
    }
  },
  // wx.cloud.callFunction({
  //   name: 'commonApi',
  //   data: {
  //     source:'insert',
  //     database:'order-haicheng',
  //     data:params
  //   },
  //   success: res => {
      
  //     console.log(res.result.result.data)
      
  //   },
  //   fail: err => {
  //     console.error('[云函数] [login] 调用失败', err)
  //   }
  // });
  async getUser(){
    this.setData({
      spinning: true
    })

    wx.cloud.callFunction({
      name:'searchs',
      data: {
        collection:'users-haicheng',
        search:{
          _openid:app.globalData.openId
        }
      },
      success:res=>{
        //console.log(res);
        this.setData({
          spinning: false
        })
        let user={
          phone:"",
          id:"",
          name:"",
          role:"common",
          member:{},
          avaterUrl:"",
          openId:app.globalData.openId,
          level:"",
          hasUserInfo:false
        }
        if(res.result.result.data.length!=0){
          user=res.result.result.data[0]
          app.globalData.user={...user,id:user._id,openId:app.globalData.openId}
          wx.setStorageSync("userInfo", app.globalData.user);
          //app.globalData.user = {phone:phone,id:id,name:name,role:role,member:member,avatarUrl:avatarUrl,openId:openId}
          this.getPlace()
        }else{
          wx.cloud.callFunction({
            name: 'commonApi',
            data: {
              source:'insert',
              database:'users-haicheng',
              data:{
                phone:"",
                name:"",
                role:"common",
                member:{},
                avatarUrl:"",
                level:'',
                _openid:app.globalData.openId,
                hasUserInfo:false
              }
            },
            success: res => {
              
              user.id=res.result.result.res._id
              // app.globalData.user = {phone:phone,id:id,name:name,role:role,member:member,avatarUrl:avatarUrl,openId:openId}
              app.globalData.user={...user}
              wx.setStorageSync("userInfo", app.globalData.user);
              this.getPlace()
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          });
        }

        if(app.globalData.user.role=='common'||app.globalData.user==null||app.globalData.user.role==null){
          wx.setStorageSync('role', '用户')
        }
        
        // if(wx.getStorageSync('role')=='管理'){
         
        //     wx.navigateTo({
        //         url: '../index/admin/admin',
        //       })
          
        // }
        this.setData({
          user:app.globalData.user,
          role:wx.getStorageSync('role')!=''?wx.getStorageSync('role'):'用户'
        })
      }
    })
   
  },
  appoint:function(event){
    let {type,url}=event.detail;
    if(url!==undefined){
      if(type=="nav"){
        wx.navigateTo({
          url: '../client/order-detail/order-detail?'+url,
        })
      }else{
        wx.switchTab({
          url: url,
        })
      }
    }
  },
  open(e){
    let {item}=e.currentTarget.dataset
    //console.log(item)
    if(this.data.user.role=="admin"|| item.order.users[0]._openid==this.data.user._openid ){
      this.setData({
        visible1: true,
        popup:item
      })
    }
    // }else{
    //  if(item.order.users[0]._openid==this.data.user._openid)
    //   wx.navigateTo({
    //     url: '../info/appoint-success/appoint-success?id='+item._id+'&place_pay_src='+(this.data.place.place_pay_src!=undefined?this.data.place.place_pay_src:'')+'&place_phone='+(this.data.place.place_phone!=undefined?this.data.place.place_phone:'')+"&review="+item.order.review,
    //   })
    // }
    
  },
  review(e){
    //console.log(e)
    this.setData({
      spinning: true
    })
    let {order}=e.currentTarget.dataset;
    wx.cloud.callFunction({
      name: 'commonApi',
      data: {
        source:'update',
        database:'order-haicheng',
        id:order._id,
        data:{
          review:'success'
        }
      },
      success: res => {
        this.call()
        this.onClose('visible1')
        wx.showToast({
          title: '审核通过',
          icon: 'none',
          duration: 1000,
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
      complete: obj =>{
        this.setData({
          spinning: false
        })
      }
    });
  },
  refuse(e){
    //console.log(e)
    this.setData({
      spinning: true
    })

    let {order}=e.currentTarget.dataset;
    wx.cloud.callFunction({
      name: 'commonApi',
      data: {
        source:'update',
        database:'order-haicheng',
        id:order._id,
        data:{
          review:'refuse'
        }
      },
      success: res => {
        this.call()
        this.onClose('visible1')
        wx.showToast({
          title: '订单作废',
          icon: 'none',
          duration: 1000,
        })
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
      complete: obj =>{
        this.setData({
          spinning: false
        })
      }
    });
  },
  appointorder(e){
    //console.log(e)
    let {children,item}=e.currentTarget.dataset
    // wx.request({
    //   url: 'http://wxpusher.zjiecode.com/api/send/message',
    //   data:{
    //     appToken:'AT_Cnhhhja8M13UhAO3qNMewz72Jy0al2kD',
    //     content:'sxd',
    //     summary:'消息摘要',
    //     uid:'UID_QYrcA6RKzzQHVwGax1WSpzx8J4j1',
      
    //   }
    // })
    //if(this.data.user.role=="common")
    //console.log(this.data)
    //console.log(item)

    wx.navigateTo({
      url: '../client/appoint-order/appoint-order?exid='+this.data.place._id+"&place="+JSON.stringify(this.data.place)+"&time="+JSON.stringify(item.time)+'&children='+JSON.stringify(children)+"&price="+item.price,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log('onready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log('onshow')
    //this.call()
    this.onGetOpenid();
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
    this.onGetOpenid();
    wx.stopPullDownRefresh();
  },

  mydata(e) { //可获取日历点击事件
    let data = e.detail.data
   
    this.setData({
      currday:data
    },()=>{
      if(app.globalData.user)
      {
        this.setListData(app.globalData.user.role)
      }

      
    })
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
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  bannerDetail:function(e){
    let {bannerId} = e.currentTarget.dataset;
    if(bannerId==0){
      this.toAdmin()
    }else if(bannerId==1){
      wx.switchTab({
        url: '../client/client',
      })
    }else if(bannerId==2){
      wx.navigateTo({
        url: '../mine/client-service/client-service',
      })
    }
  },
  toAdmin(){
    if(app.globalData.user.role===undefined||app.globalData.user.role==="common"){
      wx.showToast({
        title: '未申请成为场地管理员',
        icon: 'none',
        duration: 1000,
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../info/info?msg=申请成为场地管理员需要联系微信号15234197121',
        })
      },1000)
    }else{
      wx.navigateTo({
        url: '../index/admin/admin',
      })
    }
  },

  onClose(key) {
   
    this.setData({
        [key]: false,
    })
  },
  onClose1() {
    this.onClose('visible1')
  },
  
  onClosed1() {
      
  },
})