//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    appoint:[],
    phone:"",
    id:'',
    member:'no',
    show:false,
    name:''
  },

  onLoad: function() {
    // 获取用户信息
    
    let userInfo=wx.getStorageSync('userInfo')
    this.setData({
      show:userInfo==""?false:true
    })
    if(this.data.show){
      if(userInfo.hasUserInfo!=undefined){
        this.setData({
          hasUserInfo:userInfo.hasUserInfo,
          avatarUrl:userInfo.avatarUrl,
          userInfo:userInfo
        })
      }
      if(app.globalData.openId!==undefined&&app.globalData.openId!==""){
        let {phone,id,name,member,uid}=app.globalData.user;
        this.setData({
          phone:phone,
          id:id,
          member:member,
          name:name,
          uid:uid
        })
        //this.getAppoint();
      }else{
        this.onGetOpenid();
      }  
    }
  },

  getUserInfo:function(){
    wx.getUserProfile({
      desc:'获取用户信息',
      success: res => {
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync("userInfo",{ ...wx.getStorageSync('userInfo'),...res.userInfo});
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true
        })


        wx.showModal({
          title: '',
          content: '是否允许获取用户信息（包括头像、用户名等信息）？',
          success :infores=>{
            if(infores.confirm){
              // contus.doc(info[0]._id).update({
              //   data:{
              //     avatarUrl:this.data.avatarUrl,
              //     name:info[0].name!=""?info[0].name:this.data.userInfo.nickName,
              //   },
              //   success: res=>{
              //     console.log(res)
              //     app.globalData.user.avatarUrl=this.data.avatarUrl
              //     app.globalData.user.name=this.data.userInfo.nickName;
              //     this.setData({
              //       name:this.data.userInfo.nickName
              //     })
              //   }
              // })
              wx.cloud.callFunction({
                name: 'commonApi',
                data: {
                  source:'update',
                  database:'users-haicheng',
                  id:this.data.id,
                  data:{
                    avatarUrl:res.userInfo.avatarUrl,
                    gender:res.userInfo.gender,
                    hasUserInfo:true
                  }
                },
                success: res => {
                
                },
                fail: err => {
                
                }
              });
            }else if (infores.cancel) {
        
            }
          }
        })


      }
    })
    if(app.globalData.openId!==undefined&&app.globalData.openId!==""){
      let {phone,id,name,member,uid}=app.globalData.user;
      this.setData({
        phone:phone,
        id:id,
        member:member,
        name:name,
        uid:uid
      })
     // this.getAppoint();
    }else{
      this.onGetOpenid();
    }
   
    
  },
  updateAvatarUrl:function(){
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'order',
        search:{'users':{id:app.globalData.user.id}},
      },
      success: res => {
        let tempdata=res.result.data;
        let index=0;
        tempdata.forEach(item=>{
          if(item.users.length>=index){
            index=item.users.length;
          }
        })
        
        for(let i=0;i<index;i++){
          let a="users."+i;
          let b="users."+i+".avatarUrl";
          const db=wx.cloud.database({})
          db.collection('order').where({
            [a]:{id:app.globalData.user.id}
          })
          .update({
            data:{
              [b]:app.globalData.userInfo.avatarUrl
            },
            success:res=>{
              
            }
          })
        }
      },
      fail: err => {
    
      }
    });
  },
  addInfo:function(e){
    const db = wx.cloud.database({});
    const contus = db.collection('users');
    contus.where({
      _openid:app.globalData.openId
    }).get().then(res=>{
      if(res.data.length!==0){
        let info=res.data;
        if(info[0].avatarUrl==""||info[0].avatarUrl==undefined||info[0].name==""){
          wx.showModal({
            title: '',
            content: '是否允许获取用户信息（包括头像、用户名等信息）？',
            success :res=>{
              if(res.confirm){
                contus.doc(info[0]._id).update({
                  data:{
                    avatarUrl:this.data.avatarUrl,
                    name:info[0].name!=""?info[0].name:this.data.userInfo.nickName,
                  },
                  success: res=>{
                 
                    app.globalData.user.avatarUrl=this.data.avatarUrl
                    app.globalData.user.name=this.data.userInfo.nickName;
                    this.setData({
                      name:this.data.userInfo.nickName
                    })
                  }
                })
              }else if (res.cancel) {
          
              }
            }
          })
        }
      }
      
    })
  },
  toService:function(){
    wx.navigateTo({
      url: './client-service/client-service',
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        
        app.globalData.openId = res.result.userInfo.openId
        wx.setStorageSync("openId", res.result.userInfo.openId);
        this.getUser();
        //this.getAppoint();
        
      },
      fail: err => {
     
      }
    })
  },
  getUser:function(){
    
    // const db = wx.cloud.database({});
    // const contus = db.collection('users');
    // contus.where({
    //   _openid:app.globalData.openId
    // }).get().then(res=>{
    //   let phone="";
    //   let id=""
    //   let name=""
    //   if(res.data.length!==0){
    //     id=res.data[0]._id
    //     phone=res.data[0].phone
    //     name=res.data[0].name
    //   }else{
    //     contus.add({
    //       data:{
    //         phone:"",
    //         name:""
    //       },
    //       success:function(res) {
    //         id=res._id
    //       }
    //     })
    //   }
     
    //   app.globalData.user = {phone:phone,id:id,name:name}
  
    //   this.setData({
    //     phone:phone,
    //     id:id
    //   })
    // })
  },
  getAppoint(){
    wx.cloud.callFunction({
      name: 'lookupsearch',
      data: {
        openId:app.globalData.openId
      },
      success: res => {
        let data=res.result.list;
        data.forEach((item)=>{
          if(item.list.length!=0){
            if(item.place_id==item.list[0]._id){
              item.place_name=item.list[0].place_name;
              item.next_time=parseInt(item.time.split(":")[0])+1+":00"
              item.openId=item.list[0]._openid
            }
          }
        })
        this.setData({
                 appoint:data
               })
      },
      fail: err => {
      
      }
    })
  },
  onShow: function () {
    if(app.globalData.openId!==undefined&&app.globalData.openId!==""){
      
      let {phone,id,name,member,uid}=app.globalData.user;
      this.setData({
        phone:phone,
        id:id,
        member:member,
        name:name,
        uid:uid
      })
      //this.getAppoint();
    
    }
  },
  editInfo:function(){
    
      wx.navigateTo({
        url: 'edit-info/edit-info?id='+this.data.id+'&phone='+this.data.phone+'&level='+app.globalData.user.level+'&uid='+this.data.uid
      })
    
  },
  goBack:function(){
    wx.redirectTo({
      url: '../index/index'
    })
  },
  toCollect(e){
    wx.navigateTo({
      url: 'collect/collect',
    })
  },
  toReserved(e){
    wx.navigateTo({
      url: 'reserved/reserved'
    })
  },
  toComplete(e){
    wx.navigateTo({
      url: 'complete/complete'
    })
  },
  toEvaluated(e){
    wx.navigateTo({
      url: 'evaluated/evaluated'
    })
  },
  toClient(e){
  
    let type=e.currentTarget.dataset.type;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync("userInfo", res.userInfo);
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
          show:true,
          name:app.globalData.user.name
        })
        if(app.globalData.user.name==""||app.globalData.user.phone==""){
          wx.showToast({
            title: '手机号和姓名未完善，建议完善基本信息提升用户体验',
            icon: 'none',
            duration: 2000,
          })
        }
        wx.setTabBarItem({
          index: 2,
          text: '个人中心',
        })
        // if(type==="admin"){
        //   this.toAdmin();
        // }
        //this.onGetOpenid();
      }
    })
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
          url: '../info/info?msg=申请成为场地管理员需要联系致电18910559599',
        })
      },1000)
    }else{
      wx.navigateTo({
        url: '../index/admin/admin',
      })
    }
  },
  // onShareAppMessage: function () {

  // },
  toOrder:function(){
    wx.navigateTo({
      url: 'order/order',
    })
  },
  onPullDownRefresh: function () {
    this.onGetOpenid();
    wx.stopPullDownRefresh();
  },

})
