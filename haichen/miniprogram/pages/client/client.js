//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    places:[],
    btnShow:false,
    str:{
      place_open:true,
    },
    filter:0,
    types:[
      {
        title:"篮球",
        value:"1"
      },{
        title:"羽毛球",
        value:"2"
      },
      {
        title:"游泳",
        value:"3"
      },{
        title:"足球",
        value:"4"
      },
      {
        title:"轰趴",
        value:"5"
      },{
        title:"舞蹈",
        value:"6"
      },
      {
        title:"户外",
        value:"7"
      },{
        title:"其他",
        value:"8"
      },
    ],
    strtype:"common",
    current: '8',
  },

  onLoad: function() {
    /*wx.setTabBarItem({
      index: 2,
      text: '登录',
    })*/
    wx.getSetting({
      success: res => {
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo=res.userInfo;
              wx.setStorageSync("userInfo", res.userInfo);
              //this.onGetOpenid();
              /*wx.setTabBarItem({
                index: 2,
                text: '个人中心',
              })*/
            }
          })
        }
      }
    })
    wx.stopPullDownRefresh({
      success: (res) => {
        console.log(res)
      },
    })
    //this.onGetOpenid();
    //this.getPlace({place_open:true});
    
  },
  onTab(e) {
    console.log('onChange', e)
    let str=this.data.str;
    str.type=e.detail.key;
    this.setData({
      str:str,
      current: e.detail.key,
    })
  },
  onPullDownRefresh: function () {
    let str=this.data.str;
    str.type="8";
    this.setData({
      str:str
    })
    this.onLoad()
  },
  onConfirm(e) {
    console.log('onConfirm', e)
    let ser=e.detail.value;
   
    // db.RegExp({
    //   regexp:ser,options:'i'
    // })
    const db=wx.cloud.database();
    this.getPlace({place_open:true,place_name:db.RegExp({
      regexp:ser,options:'i'
    })});
    
  },
  getPlace:function(str){
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'place',
        search:str,
      },
      success: res => {
        this.setData({
          places:res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  appoint:function(event){
    let {type,url}=event.detail;
    
    if(type=="nav"){
      wx.navigateTo({
        url: 'place-detail/place-detail?'+url,
      })
    }else{
      wx.switchTab({
        url: url,
      })
    }
  },
  // searchplace:function(event){
  //   let type=event.currentTarget.dataset.type;
    
  //   let str=this.data.str;
  //   str.type=type;
  //   this.setData({
  //     str:str
  //   })
    
    
  // },
  onShow: function () {
    this.getPlace({place_open:true});
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
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  getUser:function(){
    const db = wx.cloud.database({});
    const contus = db.collection('users');
    contus.where({
      _openid:app.globalData.openId
    }).get().then(res=>{
      let phone="";
      let id=""
      let name=""
      let role="common";
      let member={};
      if(res.data.length!==0){
        id=res.data[0]._id
        phone=res.data[0].phone
        name=res.data[0].name
        role=res.data[0].role
        member=res.data[0].member
      }else{
        contus.add({
          data:{
            phone:"",
            name:"",
            role:"common",
            member:{}
          },
          success:function(res) {
            id=res._id
          }
        })
      }
      app.globalData.user = {phone:phone,id:id,name,name,role:role,member:member}
      /*this.setData({
        btnShow:true
      })*/
      
    })
  },
  goManage:function(){
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
  onShareAppMessage: function () {

  },
  onChange(e){
    console.log(e)
    if(e.detail.key!=2){
      this.setData({
        filter:e.detail.key,
        strtype:"common"
      })
    }else {
      this.setData({
        filter:e.detail.key,
        strtype:"collect"
      })
    }
    
  }
})
