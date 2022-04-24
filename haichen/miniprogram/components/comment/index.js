// components/comment/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object,
      value:{}
    },
    user:{
      type: Object,
      value:{}
    },
    page:{
      type:String,
      value:""
    },
    arr:{
      type:Number,
      value:0
    },
    order:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
    isShow:false,
    comm:"",
    pid:"pid",
    comments:[],
    isFoucs:false,
    piditem:{},
    openid:wx.getStorageSync('openId'),
    orderid:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    linechange:function(e){
      if(e.detail.lineCount>=1&&e.detail.lineCount<6){
        this.setData({
          rows:e.detail.lineCount
        })
      }
    },
    focu:function(e){
      this.setData({
        isFoucs:true
      })
      console.log(this.data.pid)
    },
    onBlur:function(){
      this.setData({
        pid:'pid'
      })
    },
    foccom:function(e){
      let pid=e.currentTarget.dataset.pid;
      let piditem=e.currentTarget.dataset.item;
      console.log(piditem)
      this.setData({
        pid:pid,
        isFoucs:true,
        piditem:piditem
      })
    },
    onChange:function(e){
      this.setData({
        isShow:e.detail.value!==""?true:false,
        comm:e.detail.value
      })
    },
    send:function(){
      console.log(this.data.comm)
      const db=wx.cloud.database({});
      db.collection("comment").add({
        data:{
          openPid:this.data.pid,
          place_id:this.data.obj._id,
          comment:this.data.comm,
          user_open_id:wx.getStorageSync('openId'),
          order_id:this.data.orderid
        },
        success:res=>{
          this.getComments()
          this.setData({
            isShow:false,
            comm:""
          })
          let pages=getCurrentPages();
          if (pages[pages.length-2]!=undefined){
            let temp=pages[pages.length-2];
            if(temp.route.indexOf('evaluated')>-1){
              wx.navigateTo({
                url: '/pages/info/evaluated-success/evaluated-success',
              })
            }
          }
          
        }
      })
    },
    getComments:function(){
      console.log(this.data.obj._id)
      wx.cloud.callFunction({
        name: 'lookupsearch',
        data: {
          openId:wx.getStorageSync('openId'),
          main:"comment",
          major:{
            place_id:this.data.obj._id
          },
          lookup:{
            from:'users',localField:'user_open_id',foreignField:'_openid',as:'list'
          }
        },
        success: res => {
          console.log(res)
          this.setData({
            comments:res.result.list.map(item=>{
              if(item.list.length!=0){
                item.avatarUrl=item.list[0].avatarUrl;
                item.name=item.list[0].name;
                item.phone=item.list[0].phone;
              }
              return item;
            })
          })
          
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    },
    delcomm:function(e){
      let item=e.currentTarget.dataset.item;
      
      const db=wx.cloud.database({});
      db.collection('comment').doc(item._id).remove({
        success:res=>{
          this.getComments()
        }
      })
    }
  },
  attached:function(){
    
  },
  observers:{
    "obj"(obj){
      if(obj._id!==undefined){
        
      this.getComments();
      }
    },
    "order"(order){
      if(order._id!==undefined){
        this.setData({
          orderid:order._id
        })
      }
    }
  }
})
