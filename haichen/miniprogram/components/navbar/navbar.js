const app = getApp()
import { $wuxDialog } from '../index'
Component({  
    properties: {    
        navbarData: {   
            //navbarData   由父页面传递的数据，变量名字自命名      
            type: Object,      
            value: {
              showCapsule: 1,       
              showBack:1,      
              showHome:1,      
              title: '海晟网球',
            },      
            observer: function (newVal, oldVal) { }    
            }  ,
            role:{
                type:String,
                value:'用户'
            },
            mem:{
                type:String,
                value:'非会员'
            },
        },  
        data: {    
            height: '',    //默认值  默认显示左上角    
            navbarData: {      
                showCapsule: 1,      
                showBack:1,      
                showHome:1    
            },
            titleHeight:44  ,
            menuBottom:0,
            menuHeight:24,
            menuWeight:80,
            
            visible: false,
        },  
        attached: function () {   
                const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
                 let menuBottom = menuButtonInfo.top - app.globalData.height ;
                 let menuHeight = menuButtonInfo.height;
                // 定义导航栏的高度   方便对齐 
                var isiOS = wx.getSystemInfoSync().system.indexOf('iOS') > -1;
                let that =this;
                // if(app.globalData.user.role=='common'){
                //     wx.setStorageSync('role', '用户')
                // }
                this.setData({      
                    height: app.globalData.height ,
                    titleHeight: !isiOS?48:44 ,
                    menuBottom:menuBottom,
                    menuHeight:menuHeight,
                    menuWeight:menuButtonInfo.width ,
                    role:wx.getStorageSync('role')!=''?wx.getStorageSync('role'):'用户'
                })
                
        },  
        methods: {    
            // 返回上一页面    
            _navback() {      
                wx.navigateBack()    
            },    
            //返回到首页    
            _backhome() {      
                wx.switchTab({        
                    url: '/pages/hot/hot',      
                })    
        }  ,
        toggle:function(){
            this.setData({
                visible: true,
            })
        }, 
        onClose() {
            this.setData({
                visible: false,
            })
        },
        onChange(e) {
            if(app.globalData.user.role!='admin'&&e.detail.value=='管理'){
                wx.showToast({
                    title: '未申请成为场地管理员',
                    icon: 'none',
                    duration: 1000,
                  })
                  this.setData({
                      visible:false
                  })
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '../info/info?msg=申请成为场地管理员需要联系微信号15234197121',
                    })
                  },1000)
            }else{
                wx.setStorageSync('role',e.detail.value)
                this.setData({
                    role:e.detail.value,
                    visible:false
                })
                if(e.detail.value=='管理'){
                    wx.navigateTo({
                        url: '../index/admin/admin',
                      })
                }
            }
        },
}})
