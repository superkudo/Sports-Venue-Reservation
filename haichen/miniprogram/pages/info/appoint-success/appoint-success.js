// miniprogram/pages/info/appoint-success/appoint-success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [
      {
        type: 'light',
        block: true,
        text: '保存付款码到相册',
      }
    ],

    buttons2:[
      {
          type: 'light',
          block: true,
          text: '返回首页',
      }
    ],
  id:"",
  place_pay_src:'',
  place_phone:'',
  price:'',
  review:false,
  icon:{
    type:"warn"
  },
  status:'',
  ispay:false
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.review=="false"||options.review==undefined){
      this.setData({
        icon:{
          type:"warn"
        }
      })
    }else{
      this.setData({
        icon:{
          type:"success"
        }
      })
    }
    let status=''
    switch(options.review){
      case 'success':
        status='成功'
        break;
      case 'unpaid':
        status='待审核'  
        break;
      default:
        status=''  
    }
    this.setData({
      id:options.id,
      place_pay_src:options.place_pay_src,
      place_phone:options.place_phone,
      price: options.price,
      review:options.review,
      status:status,
      ispay: true
    })
    //let {buttons}=this.data
    // if(options.place_phone!=''){
    //   buttons.push({
    //     type: 'light',
    //       block: true,
    //       text: options.review=='false'?'请联系管理员确认预约':'联系管理员',
    //   })
    //   this.setData({
    //     buttons:buttons
    //   })
    // }
  },
  onClick(e) {
    //console.log(e)
    const { index } = e.currentTarget.dataset
    if(index==0){
      if(this.data.ispay == true)
      {
        wx.switchTab({
          url: '../../hot/hot',
        })
      }
      else
      { 
        wx.cloud.downloadFile({
          fileID: this.data.place_pay_src, // 文件 ID
          success: res => {
            // 返回临时文件路径
            console.log(res.tempFilePath)
            wx.saveImageToPhotosAlbum({
              filePath:res.tempFilePath,
              success(res) { 
                wx.showToast({
                  title:'保存成功'
                })
              }
            })

          },
          fail: console.error
        })
        
        //console.log(11)
      }


     
      

    }
    // else if(index==1){
    //   if(this.data.place_pay_src!=''){
    //     wx.navigateTo({
    //       url: '../pay/pay?place_pay_src='+this.data.place_pay_src+'&place_phone='+this.data.place_phone,
    //     })
    //   }else{
    //     wx.showToast({
    //       title: '场地还未上传收款二维码',
    //       icon:'none',
    //       duration:2000
    //     })
    //   }
    // }
    else if(index==1){
      wx.setClipboardData({  data: this.data.place_phone,  } )
      wx.makePhoneCall({
        phoneNumber: this.data.place_phone,
      })
    
    }
   
},

  goBack: function(){
    wx.switchTab({
      url: '../../hot/hot',
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
  // onShareAppMessage: function (res) {
  //   if(res.from=="button"){
  //     return{
  //       title:"参与拼团",
  //       path:"/pages/client/order-detail/order-detail?id="+this.data.id,
  //       imageUrl:"../../../images/icons/changdi.png"
  //     }
  //   }
    
  // }

  subOrder(){

    // wx.request({
    //   url: 'http://wxpusher.zjiecode.com/api/send/message',
    //   data:{
    //     appToken:'AT_Cnhhhja8M13UhAO3qNMewz72Jy0al2kD',
    //     content:'你有一个新的预订等待确认',
    //     summary:'请打开海晟小程序里进行确认',
    //     uid:'UID_QYrcA6RKzzQHVwGax1WSpzx8J4j1',
      
    //   }
    // })

    
    this.setData({
      ispay: true
    })
    
  }
})