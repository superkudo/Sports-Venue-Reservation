// components/place/place.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    str:{
      type: Object,
      value: {
        place_open:true
      }
    },
    strtype:{
      type:String,
      value:"common"
    },
    filter:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    places:[],
    Location:{},
    curr:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPlace:function(str,call){
      this.setData({
        places:[]
      })
      
      if(this.data.strtype==="common"){
        //console.log(str,this.data.strtype)
        wx.cloud.callFunction({
          name: 'searchs',
          data: {
            collection:'place-haicheng',
            search:str,
          },
          success: res => {
            let tempdata=res.result.result.data;
            tempdata.forEach(item=>{
              if(item.Location!==undefined){
                //console.log(this.data.Location.latitude,this.data.Location.longitude,item.Location.latitude,item.Location.longitude)
                item.km=this.getDistance(this.data.Location.latitude,this.data.Location.longitude,item.Location.latitude,item.Location.longitude)
              }
            })
            this.setData({
              places:res.result.result.data.reverse()
            })
            call()
          },
          fail: err => {
            //console.error('[云函数] [login] 调用失败', err)
          }
        })
      }else if(this.data.strtype==="collect"){
        wx.cloud.callFunction({
          name: 'searchs',
          data: {
            collection:'like',
            search:{
              user_openId:wx.getStorageSync('openId')
            },
          },
          success: res => {
            let tempdata=res.result.result.data;
            
            tempdata.forEach(item=>{
              if(item.Location!==undefined){
                item.km=this.getDistance(this.data.Location.latitude,this.data.Location.longitude,item.Location.latitude,item.Location.longitude)
              }
            })
            let arr=res.result.result.data.map((item)=>{
              item._id=item.place_id;
              return item;
            })
            this.setData({
              places:arr
            })
          },
          fail: err => {
            //console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
      
    },
    Rad:function(d){
      return d*Math.PI/180.0;
    },
    getDistance:function(lat1,lng1,lat2,lng2){
      let radLat1=this.Rad(lat1);
      let radLat2=this.Rad(lat2);
      let a=this.Rad(lat1)-this.Rad(lat2);
      let b=this.Rad(lng1)-this.Rad(lng2);
      //console.log(a,b)
      let s=2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
      
      s=s*6378.137;
      //console.log(s);
      s=Math.round(s*10000)/10000;
      //console.log(s)
      s=s.toFixed(2);
      //console.log("经纬度计算的距离"+s);
      return s;

    },
    appoint:function(event){
      if(wx.getStorageSync('userInfo')!==undefined&&wx.getStorageSync('userInfo')!==""){
        // var exid=event.currentTarget.dataset.exid;
        // var img=event.currentTarget.dataset.img;
        // var price=event.currentTarget.dataset.price;
        // var times=event.currentTarget.dataset.times;
        let obj=event.currentTarget.dataset.item;
        let str=""
        Object.keys(obj).forEach(item=>{
          if(obj[item] instanceof Array||obj[item] instanceof Object){
            obj[item]=JSON.stringify(obj[item]);
          }
          str=str+item+"="+obj[item]+"&"
        })
        //let mem=app.globalData.user.member[exid]==null?"非会员":app.globalData.user.member[exid]
        let mem=app.globalData.user.member[obj._id]==null?"非会员":app.globalData.user.member[obj._id]
        //let ser= 'appoint-detail/appoint-detail?id='+exid+'&img='+img+'&price='+price+'&times='+JSON.stringify(times)+'&mem='+mem
        let ser=str+'&mem='+mem
        this.triggerEvent('appoint', {url:ser,type:'nav'})
      }else{
        wx.showToast({
          title: '请登录',
          icon: 'none',
          duration: 500
        })
        this.triggerEvent('appoint', {url:'../mine/mine',type:'tab'})
      }
    },
  },
  attached: function () {
    wx.getLocation({
      type: 'gcj02',
      success:res=>{
       this.setData({
         Location:res
       })
       //console.log(this.data.Location)
       this.getPlace(this.data.str,()=>{} )
      }
     })
    
     
  },
  observers: {
    'str'(str) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      this.getPlace(str,()=>{})
    },
    'filter'(filter){
      if(filter!==this.data.curr){
        if(filter==0){
          this.setData({
            places:[]
          })
          this.getPlace(this.data.str,()=>{})
        }
        
        
      }
      if(filter==0){
        let places=this.data.places;
        places.reverse();
        this.setData({
          places:places
        })
      }else if(filter==1){
        if(filter!==this.data.curr){
          this.getPlace(this.data.str,()=>{
            let places=this.data.places;
            places=places.filter(item=>{
              return item.km!=undefined
            })
            places.sort((a,b)=>{
              return a.km-b.km
            });
            this.setData({
              places:[]
            })
            this.setData({
              places:places
            })
          })
        }
        
      }else if(filter==2){
        if(filter!==this.data.curr){
          this.setData({
            places:[]
          })
          this.getPlace(this.data.str)
        }
        
      }
      this.setData({
        curr:filter
      })
    }
  }
})
