// miniprogram/pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.onGetOpenid();
    wx.getSetting({
      success: res => {
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo=res.userInfo;
              wx.setStorageSync("userInfo", res.userInfo);
              this.onGetOpenid();
             
            }
          })
        }
      }
    })
  
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
            name:app.globalData.userInfo.nickName,
            role:"common",
            member:{}
          },
          success:function(res) {
            id=res._id
          }
        })
      }
      app.globalData.user = {phone:phone,id:id,name,name,role:role,member:member}
      // wx.switchTab({
      //   url: '../client/client',
      // })
      this.setData({
        isShow:false
      })
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
  // onShareAppMessage: function () {

  // },
  toAdmin:function(){
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
      wx.redirectTo({
        url: 'admin/admin',
      })
    }
  },
  toClient:function(){
    wx.switchTab({
      url: '../client/client',
    })
  },
  toUser:function(){
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync("userInfo", res.userInfo);
        this.onGetOpenid();
        
      }
    })
  }
    
})
