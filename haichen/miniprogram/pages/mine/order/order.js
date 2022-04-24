// miniprogram/pages/mine/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appoint:[],
    user:{},
    str:{
      
    },
    items:[{
      type: 'radio',
      label: '时间',
      value: 'time',
      
      children: [{
              label: '未开始',
              value: 'reserved',
            
          },
          {
              label: '已结束',
              value: 'complete',
          },
      ],
      
  },{
    type: 'radio',
    label: '审核状态',
    value: 'review',
    
    children: [{
            label: '预定成功',
            value: 'success',
          
        },
        {
          label: '预订中',
          value: 'unpaid',
        
        },
        {
            label: '预定失败',
            value: 'refuse',
        },
    ],
    
}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getAppoint();
    this.setData({
      user:app.globalData.user,
      str:{
        'users':{id:app.globalData.user.id}
      },
    })

    this.getOrder()

    
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

  getOrder: function(){
    wx.cloud.callFunction({
      name: 'searchs',
      data: {
        collection:'order-haicheng',
        search:{
          'users':{id:app.globalData.user.id}
        },
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
              let nextTime=parseInt(date.getHours())+1
               return {year,
                month,
                day,
                time,
                week,current_time:v,next_time:nextTime+":00"}
            })
          }else{
            item.appointments=item.appointments.map((v)=>{
              let date =new Date(v.current_time);
              
              let nextTime=parseInt(date.getHours())+1
              v.next_time=nextTime+":00"
              return v
            })
          }
          
          item.status = item.review == 'success' ? '预订成功' : item.review == 'refuse' ? '预定失败' :'确认中'

          return item
        })

        newAppoint.reverse();
        
        this.setData({
          appoint:newAppoint,
          appointList:newAppoint,
        })
       
      },
      fail: err => {
       
      }
    });
  },

  getAppoint(){
    wx.cloud.callFunction({
      name: 'lookupsearch',
      data: {
        openId:app.globalData.openId,
        main:"appointments",
        major:{
          openId:app.globalData.openId
        },
        lookup:{
          from:'place',localField:'place_id',foreignField:'_id',as:'list'
        }
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
                 appoint:data,
               })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
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
    this.getOrder()
    wx.stopPullDownRefresh();
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
  deleteApp:function(event){
    var id=event.currentTarget.dataset.id;
    var index=event.currentTarget.dataset.index;
    var item=event.currentTarget.dataset.item;
    const db = wx.cloud.database({});
    let that=this;
    wx.showModal({
      title: '',
      content: '您确定要撤销预约吗？',
      success (res) {
        if (res.confirm) {
          console.log(id);
          db.collection('appointments').doc(id).remove({
            success: function(res) {
              console.log(res)
              let app=that.data.appoint;
              app.splice(index, 1); 
              that.setData({
                appoint:app
              })
            }
          })
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
              console.log(res)
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  edit_appoint:function(event){
    var obj=event.currentTarget.dataset.item;
    let str=""
    Object.keys(obj).forEach(item=>{
      str=str+item+"="+obj[item]+"&"
    })
    wx.navigateTo({
      url: '../edit-appoint/edit-appoint?'+str,
    })
  },
  onChange(e){
    //console.log(e)
    
    let filter=e.detail.checkedValues
    let {appoint}=this.data
    //console.log(appoint)
    let arr=[]
    filter.forEach((item)=>{
      if(item!=''){
        if(item=='reserved'){
          arr=appoint.filter((v)=>{
            let temp=v.appointments.filter((a)=>{
              return new Date().getTime()< a.current_time   
            })
            return temp.length!=0
          })
        }
        if(item=='complete'){
          arr=appoint.filter((v)=>{
            let temp=v.appointments.filter((a)=>{
              return new Date().getTime()> a.current_time   
            })
            return temp.length!=0
          })
        }

        //console.log(appoint)
        if(item=="success"){
          arr=appoint.filter((v)=>{
            return v.review=='success'
          })
        }
        if(item=="unpaid"){
          arr=appoint.filter((v)=>{
            return v.review=='unpaid'
          })
        }
        if(item=="refuse"){
          arr=appoint.filter((v)=>{
            return v.review=='refuse'
          })
        }
      }
    })

    //console.log(arr);
    this.setData({
      appointList:arr
    })
  }
})