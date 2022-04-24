// miniprogram/pages/mine/edit-info/edit-info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    phone:'',
    name:wx.getStorageSync('userInfo').nickName,
    role:wx.getStorageSync('userInfo').role,
    levels:[
      {
        title:"达人",
        value:"达人"
      },{
        title:"精通",
        value:"精通"
      },{
        title:"熟练",
        value:"熟练"
      },{
        title:"入门",
        value:"入门"
      }],
      level:"" ,
      uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.setData({
      id:options.id,
      phone:options.phone,
      name:app.globalData.user.name===""?this.data.name:app.globalData.user.name,
      level:options.level,
      uid:options.uid
    })
  },
  onChange(e) {
    const { form, changedValues, allValues } = e.detail
    this.setData({
      phone:allValues.phone,
      name:allValues.name,
      uid:allValues.uid
    })
  },
  saveInfo:function(){
    let that = this;

    wx.cloud.callFunction({
      name: 'commonApi',
      data: {
        source:'update',
        database:'users-haicheng',
        id:this.data.id,
        data:{
          phone:this.data.phone,
          name:this.data.name,
          level:this.data.level,
          uid:this.data.uid
        }
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
        wx.switchTab({
          url: '../mine',
        })
        app.globalData.user={...app.globalData.user,phone:that.data.phone,name:that.data.name,level:that.data.level}
        console.log(app.globalData.user)
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });

    // const db = wx.cloud.database({});
    // const cont = db.collection('users');
    // let that=this
    // cont.doc(this.data.id).update({
    //   data:{
    //     phone:this.data.phone,
    //     name:this.data.name,
    //     level:this.data.level
    //   },
    //   success: function(res) {
    //     wx.showToast({
    //       title: '保存成功',
    //       icon: 'success',
    //       duration: 1000
    //     })
    //     wx.switchTab({
    //       url: '../mine',
    //     })
    //     app.globalData.user={...app.globalData.user,phone:that.data.phone,name:that.data.name,level:that.data.level}
    //     console.log(app.globalData.user)
    //   }
    // })
  },

  levelConfirm(e){
   
    this.setData({
      level:e.detail.value
    })
   
  },

  copy(e){
    console.log(e)
    let {url}=e.currentTarget.dataset
    wx.setClipboardData({  data: url,  } )
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

  // }
})