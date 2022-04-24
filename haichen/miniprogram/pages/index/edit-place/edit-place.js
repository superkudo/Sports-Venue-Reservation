// miniprogram/pages/index/edit-place/edit-place.js
import { $wuxForm } from '../../../components/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    weeks: [{
      title: '周日',
      value: '周日',
    },{
      title: '周一',
      value: '周一',
    }, {
        title: '周二',
        value: '周二',
    }, {
        title: '周三',
        value: '周三',
    }, {
        title: '周四',
        value: '周四',
    }, {
        title: '周五',
        value: '周五',
    }, {
        title: '周六',
        value: '周六',
    },]
    ,
    times:[{
      title:"08:00",
      value:"08:00"
    },{
      title:"09:00",
      value:"09:00"
    },{
      title:"10:00",
      value:"10:00"
    },{
      title:"11:00",
      value:"11:00"
    },{
      title:"12:00",
      value:"12:00"
    },{
      title:"13:00",
      value:"13:00"
    },{
      title:"14:00",
      value:"14:00"
    },{
      title:"15:00",
      value:"15:00"
    },{
      title:"16:00",
      value:"16:00"
    },{
      title:"17:00",
      value:"17:00"
    },{
      title:"18:00",
      value:"18:00"
    },{
      title:"19:00",
      value:"19:00"
    },{
      title:"20:00",
      value:"20:00"
    },{
      title:"21:00",
      value:"21:00"
    },{
      title:"22:00",
      value:"22:00"
    },],
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
        title:"网球",
        value:"8"
      },
    ],
    type:{
      
      title:"网球",
      value:"8"
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    if(options.place_times!=undefined){
      options.special=JSON.parse(options.place_times)
    }
    if(options.children!=undefined){
      options.children=JSON.parse(options.children);
    }
    if(options.place_images==undefined){
      options.place_images=[];
    }else{
      options.place_images=JSON.parse(options.place_images)
    }

    //console.log(options.type)

    if(options.type==undefined){
      this.setData({
        type:{
          title:"网球",
          value:"8"
        }
      })
    }else{
      this.setData({
        "type.value":options.type,
        "type.title":this.data.types[parseInt(options.type)-1].title,
      })
    }
    if(options.Location==undefined){
      options.Location={}
    }else{
      options.Location=JSON.parse(options.Location)
    }
    if(options.member==undefined){
      options.member={
        commonvip:0,
        novip:7,
        vip:0
      }
    }else{
      options.member=JSON.parse(options.member)
    }
    this.setData({
      obj:options,
    })
  },
  chooseMap:function(){
    wx.chooseLocation({
      ...this.data.obj.Location,       
      scale: 18,
      success:open=>{
        let obj=this.data.obj;
        obj.place_area=open.address;
        obj.Location=open
        this.setData({
          obj:obj
        })
        const { setFieldsValue } = $wuxForm()
        
        setFieldsValue({
          place_area:open.address
        })
      }
    })
  },
  addTime:function(){
    let data=this.data.obj;
    let length=data.special.length;
    data.special.push({
        prop1:"prop"+(length+1)+"-1",
        weekday:[],
        prop2:'prop'+(length+1)+'-2',
        daytime:[],
        prop3:'price'+(length+1)+'-3',
        price:0,
        show:true
    })
    this.setData({
      obj:data,
    })
    
  },
  addChildren:function(){
    let data=this.data.obj;
    let length=data.children.length;
    data.children.push({
      prop:"children"+(length+1),
      show:true,
      value:""
    })
    this.setData({
      obj:data,
    })
  },
  typeConfirm(e){

    this.setData({
      type:{
        title:e.detail.label,
        value:e.detail.value
      }
    })
   
  },
  delTime:function(event){
    var index=event.currentTarget.dataset.index;
    let that=this;
    wx.showModal({
      title: '',
      content: '您确定要删除过滤器吗？',
      success (res) {
        if (res.confirm) {
          let data=that.data.obj;
          data.special[index].show=false;
          that.setData({
            obj:data
          })
         
        }else if (res.cancel){

        }
      }
    })
  },

  delChildren:function(event){
    var index=event.currentTarget.dataset.index;
    let that=this;
    wx.showModal({
      title: '',
      content: '您确定要删除吗？',
      success (res) {
        if (res.confirm) {
          let data=that.data.obj;
          data.children[index].show=false;
          that.setData({
            obj:data
          })
         
        }else if (res.cancel){

        }
      }
    })
  },
  onChange(e) {
    const { form, changedValues, allValues } = e.detail
    console.log(allValues)
    let obj=this.data.obj;
    obj.place_name=allValues.place_name;
    obj.place_phone=allValues.place_phone;
    obj.place_area=allValues.place_area;
    obj.place_price=allValues.place_price;
    obj.member_price=allValues.member_price;
    obj.vip_price=allValues.vip_price;
    obj.intro=allValues.intro;
    obj.member={
      commonvip:allValues.commonvip,
      novip:allValues.novip,
      vip:allValues.vip
    }
    let data=obj.special;
    data.forEach((item)=>{
      if(changedValues[item.prop3]!==undefined){
        item.price=changedValues[item.prop3]
      }
    })
    obj.children.forEach(item=>{
      if(changedValues[item.prop]!==undefined){
        item.value=changedValues[item.prop]
      }
    })
    
    this.setData({
      obj:obj
    })
  },

  onConfirm(e) {
    const { index ,prop} = e.currentTarget.dataset
    //this.setValue(e.detail, index)
    let data=this.data.obj;
    data.special[index][prop]=e.detail.value
  
    this.setData({
      obj:data
    })
   // console.log(`onConfirm${index}`, e.detail.value,index,prop)
  },
  onValueChange(e) {
      const { index } = e.currentTarget.dataset
      //console.log(`onValueChange${index}`, e.detail)
  },

  addImg : function(e){
    let type=e.currentTarget.dataset.type
    wx.chooseImage({
        count : 1, 
        sizeType : ["original","compressed"], 
        sourceType : ['album','camera'], 
        success : (chooseres)=>{ 
         
            wx.cloud.uploadFile({
              cloudPath: "payImg/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000)+'.png',
              filePath : chooseres.tempFilePaths[0], 
              success : (res) => { 
                
                let obj=this.data.obj;  
                obj[type]=res.fileID
                this.setData({
                  obj:obj
                })
                wx.showLoading({ 
                  title : '图片上传中', 
                  mask : true, 
                  success : function () { 
                      wx.hideLoading() 
                  }
                });
              },
              fail : (err) => {
              
              }
            })
        },
        fail : (err) => {
         
        }
    })
  },

  addImages : function(){
    wx.chooseImage({
        count : 1, 
        sizeType : ["original","compressed"], 
        sourceType : ['album','camera'], 
        success : (chooseres)=>{ 
         
            wx.cloud.uploadFile({
              cloudPath: "images/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000)+'.png',
              filePath : chooseres.tempFilePaths[0], 
              success : (res) => { 
               
                let ims=this.data.obj;
                if(ims.place_images==undefined){
                  ims.place_images=[];
                }
                ims.place_images.push(res.fileID);  
                this.setData({
                  obj:ims
                })
                wx.showLoading({ 
                  title : '图片上传中', 
                  mask : true, 
                  success : function () { 
                      wx.hideLoading() 
                  }
                });
              },
              fail : (err) => {
                console.log(err)
              }
            })
        },
        fail : (err) => {
          console.log(err)
        }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  addPlace:function(){
    if(wx.getStorageSync('openId')!==undefined&&wx.getStorageSync('openId')!==""){
      if(this.data.obj.place_area===""||this.data.obj.place_name===""||this.data.obj.place_phone===""){
        wx.showToast({
          title: '请完整填写信息',
          icon: 'none',
          duration: 500
        })
      }else{

        console.log(this.data.obj)
        

        wx.cloud.callFunction({
          name: 'commonApi',
          data: {
            source:'update',
            database:'place-haicheng',
            id:this.data.obj._id,
            data:{
              place_name:this.data.obj.place_name,
              place_phone:this.data.obj.place_phone,
              place_area:this.data.obj.place_area,
              place_price:this.data.obj.place_price,
              member_price: this.data.obj.member_price,
              vip_price:this.data.obj.vip_price,
              place_img_src:this.data.obj.place_img_src,
              place_pay_src:this.data.obj.place_pay_src,
              place_times:this.data.obj.special,
              intro:this.data.obj.intro,
              place_images:this.data.obj.place_images,
              type:this.data.type.value,
              Location:this.data.obj.Location,
              children:this.data.obj.children,
              member:this.data.obj.member
            }
          },
          success: res => {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 500
            })
            // wx.navigateBack({
            //   complete: (res) => {},
            // })
            wx.switchTab({
              url: '../../mine/mine',
            })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        });

        // const db=wx.cloud.database({});
        // const cont = db.collection('place');
        // cont.doc(this.data.obj._id).update({
        //   data:{
        //     place_name:this.data.obj.place_name,
        //     place_phone:this.data.obj.place_phone,
        //     place_area:this.data.obj.place_area,
        //     place_price:this.data.obj.place_price,
        //     place_img_src:this.data.obj.place_img_src,
        //     place_pay_src:this.data.obj.place_pay_src,
        //     place_times:this.data.obj.special,
        //     intro:this.data.obj.intro,
        //     place_images:this.data.obj.place_images,
        //     type:this.data.type.value,
        //     Location:this.data.obj.Location,
        //     children:this.data.obj.children,
        //     member:this.data.obj.member
        //   }
        // }).then(res=>{
        //   console.log(res)
        //     wx.showToast({
        //       title: '成功',
        //       icon: 'success',
        //       duration: 500
        //     })
        //     wx.navigateBack({
        //       complete: (res) => {},
        //     })
        // })
        
      }
    }else{
      this.onGetOpenid();
      
    }
   
  },
  onGetOpenid: function() {
    
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openId = res.result.userInfo.openId
        wx.setStorageSync("openId", res.result.userInfo.openId);
        this.addPlace();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
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