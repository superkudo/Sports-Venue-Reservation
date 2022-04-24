// miniprogram/pages/index/handle-user/handle-user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:{},
    places:[],
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
    currentPlace:'',
    user:{},
    placesUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let {item,places}=options
    item=JSON.parse(item)
    places=JSON.parse(places)
    let users={}
    
    places.map((v)=>{
      
      users[v._id]=[item]
      v.title=v.place_name
      v.value=v.place_name
      return v
    })
   
    this.setData({places,users:users,currentPlace:places[0],user:item,placesUrl:JSON.stringify(places)})
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