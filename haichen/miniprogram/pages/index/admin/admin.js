//index.js
const app = getApp()
let virtualHeight = wx.getSystemInfoSync().windowHeight
// let itemCount = 1000
// let items = [...new Array(itemCount)].map((v, i) => i)
Page({
  data: {
    places:[],
    openId:'',
    current:"0",
    
    datevalue:'',
    treedata:[],
    casvisible:false,
    //casvalue:[],
    placetitle:'',
    appform:{
      currday:[2020,5,4],
      casvalue:[],
    },
    usersArr:[],
    virtualHeight:600,
    disableScroll: false,
    mTop:46
  },

  onLoad: function() {
    if(wx.getStorageSync('openId')!==undefined&&wx.getStorageSync('openId')!==""){
      this.setData({
        openId:wx.getStorageSync('openId')
      })
      this.getPlace();
      this.call()
      //this.getorder()
    }else{
      this.onGetOpenid();
    }
    let date=new Date();
    
    this.setData({
      'appform.currday':[date.getFullYear(),date.getMonth(),date.getDate()],
      datevalue:date.toISOString().substr(0,10)
    })

  },
  onReady: function () {
    let query = wx.createSelectorQuery();
    query.select('.search').boundingClientRect(rect => {
  	  
      let height = rect.height;
      //给页面赋值
     
      this.setData({
        mTop:height
      })
    }).exec();
  },

  mydata(e) { //可获取日历点击事件
    let data = e.detail.data
  },
  placeClose(){
    this.setData({ casvisible: false })
  },
  placeChange(e){
    this.setData({ 'appform.casvalue':e.detail.value,placetitle: e.detail.options.map((n) => n.label).join('/') })
  },
  openplace(){
    this.setData({casvisible:true})
  },
  goSearch(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onoff(e) {
    this.setData({
        current: e.detail.key,
    })
    wx.setNavigationBarTitle({
      title: e.detail.keys[e.detail.key].title
    })
  },
  onConfirm(e) {
    this.setData({
      datevalue:e.detail.label,
      'appform.currday':e.detail.selectedValue,
      
    })
  },

//   updated(items) {
//     const startTime = Date.now()
//     this.virtualList = this.virtualList || this.selectComponent('#wux-virtual-list')
//     console.log(this.selectComponent('#wux-virtual-list'))
//     this.virtualList.render(items, () => {
//         const diffTime = Date.now() - startTime
//         console.log(`onSuccess - render time: ${diffTime}ms`)
//     })
//     console.log(this.virtualList)
// },
  getPlace:function(){
    

    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'place-haicheng',
        search:{}
      },
      success: res => {
        res.result.result.data[0].children=res.result.result.data[0].children.map(item=>{
          item.title=item.value.length>3?item.value.substring(0,3)+'...':item.value
          return item;
        })
        this.setData({
          places:res.result.result.data,
          
        })
      },
      fail: err => {
      
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
        this.setData({
          openId:app.globalData.openId
        })
        this.getPlace();
      },
      fail: err => {
       
      }
    })
  },

  call(){
    
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'users-haicheng',
        search:{
          //role:"common",
         
        },
        neq:{
          name:'',
          phone:''
        }
      },
      success: res => {
        this.setData({
          usersArr:res.result.result.data
        },()=>{
          this.updated(res.result.result.data)
        })
        
      },
      fail: err => {
       
      }
    });
  },
  async searchUser(placeid){
    const db=wx.cloud.database();
    const _=db.command;
    let res=await db.collection("users").where({
      member:{
        [placeid]:_.neq(null)
      }
    }).get()
    return {key:placeid,value:res.data};
  },
  appoint:function(event){
      // var exid=event.currentTarget.dataset.exid;
      // wx.navigateTo({
      //   url: '../get-place/get-place?id='+exid
      // })
      let obj=this.data.places[0]
      let str=""
      Object.keys(obj).forEach(item=>{
        if(obj[item] instanceof Array||obj[item] instanceof Object){
          obj[item]=JSON.stringify(obj[item]);
        }
        str=str+item+"="+obj[item]+"&"
      })
      wx.navigateTo({
        url: '../edit-place/edit-place?'+str,
      })
    
  },
  // toeditplace:function(event){
  //   let obj=event.currentTarget.dataset.item;
  //   let str=""
  //   Object.keys(obj).forEach(item=>{
  //     if(obj[item] instanceof Array||obj[item] instanceof Object){
  //       obj[item]=JSON.stringify(obj[item]);
  //     }
  //     str=str+item+"="+obj[item]+"&"
  //   })
  //   wx.navigateTo({
  //     url: '../edit-place/edit-place?'+str,
  //   })
  // },
  isCheck:function(event){
    var item=event.currentTarget.dataset.unit;
    var index=event.currentTarget.dataset.index;
    let prePlaces=this.data.places;
    prePlaces[index].place_open=!prePlaces[index].place_open;
    const db = wx.cloud.database({});
    const cont = db.collection('place');
    cont.doc(item._id).update({
      data:{
        place_open:prePlaces[index].place_open
      },
      success: function(res) {
        this.setData({
          places:prePlaces
        })
      }
    })
  },
  addModel:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['5L1ylt78l2ggDq7bZpQmS6zL3_mOl9hyhCPHh86MDiQ'],
      success (res) { 
        wx.navigateTo({
          url: '../add-place/add-place'
        })
      }
    })
    
  },
  onShow: function () {
    // this.getPlace();
  },
  goBack:function(){
    wx.redirectTo({
      url: '../index'
    })
  },
  onShareAppMessage: function () {

  },
  updated(items) {
    const startTime = Date.now()
    this.virtualList = this.virtualList || this.selectComponent('#wux-virtual-list')
    this.virtualList.render(items, () => {
        const diffTime = Date.now() - startTime
        
    })
  },
  // loadData() {
  //   if (itemCount >= 10000) return
  //   if (this.data.disableScroll) return
  //   this.setData({ disableScroll: true })
  //   wx.showLoading()
  //   setTimeout(() => {
  //       itemCount += 1000
  //       items = [...new Array(itemCount)].map((v, i) => i)
  //       this.updated(items)
  //       this.setData({ disableScroll: false })
  //       wx.hideLoading()
  //       wx.stopPullDownRefresh()
  //   }, 3000)
  //   console.log('loadData')
  // },
  onChange(e) {
      const { startIndex, endIndex } = e.detail
      if (this.data.startIndex !== startIndex || this.data.endIndex !== endIndex) {
          this.setData(e.detail)
        
      }
  },
  onPageScroll(e) {
      // 当页面滚动时调用组件 scrollHandler 方法
      this.virtualList.scrollHandler({ detail: e })
      // console.log('onPageScroll', e)
  },
  onReachBottom() {
      // this.loadData()
     
  },
  onPullDownRefresh() {
      // itemCount = 0
      // this.loadData()
      
  },
  userdetail(data){
    
    let {item}=data.currentTarget.dataset;
    wx.navigateTo({
      url: '../handle-user/handle-user?item='+JSON.stringify(item)+"&places="+JSON.stringify(this.data.places),
    })
    
  },
  watch: {
    'appform':function(appform) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      
    },
  }
})
