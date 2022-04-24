// pages/appoint/yycalendar/yycalendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    beginTime: {
      type: String,
      value: '09:00'
    },
    endTime: {
      type: String,
      value: '21:00'
    },
    timeGap: {
      type: Number,
      value: 60
    },
    show: {
      type: Boolean,
      value: false
    },
    unreserveTime:{
      type:Array,
      value:[]
    },
    timeday:{
      type:Number,
      value:0
    },
    mem:{
      type:String,
      value:''
    },
    role:{
      type:String,
      value:"common"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeRangeInfo: [],
    days: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTimeRange: function (beginTime, endTime, timeGap, days) {
      let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
      var date = new Date()
      var newDate = new Date()
      if (days == undefined || days == '') {
        newDate = date
      } else {
        newDate.setDate(date.getDate() + days);
      }
      const year = newDate.getFullYear()
      const month = this.formatNumber(newDate.getMonth() + 1)
      const day = this.formatNumber(newDate.getDate())
      const week = show_day[newDate.getDay()]

      var date1 = new Date(year + '/' + month + '/' + day + ' ' + beginTime)
      var date2 = new Date(year + '/' + month + '/' + day + ' ' + endTime)

      var s = date.getTime()+this.data.timeday*1000*60*60*24, news = newDate.getTime(), s1 = date1.getTime(), s2 = date2.getTime();
      var total = (s2 - s1) / 1000;
      var min = parseInt(total / 60);//计算整数分
      var timeGap = timeGap
      var amount = min / timeGap
      var timeRange = new Array()
      var timeStr = this.formatNumber(date1.getHours()) + ':' + this.formatNumber(date1.getMinutes())
      var timeInfo = new Object()
      var isDisabled = false
      if (s1 < s) {
        isDisabled = true
      }
      if(this.data.role=="admin"){
        isDisabled = false
      }
      timeInfo["timeStamp"] = s1
      timeInfo["timeStr"] = timeStr
      timeInfo["isDisabled"] = isDisabled
     
      timeRange.push(timeInfo)

      for (var i = 0; i < amount; i++) {
        var timeInfo = new Object()

        date1.setMinutes(date1.getMinutes() + timeGap, date1.getSeconds(), 0);
        var timeStamp = date1.getTime()
        if (timeStamp > s2) {
          date1 = date2
          timeStamp = s2
        }
        var isDisabled = false
        if (timeStamp < s) {
          isDisabled = true
        }
        
        var timeStr = this.formatNumber(date1.getHours()) + ':' + this.formatNumber(date1.getMinutes())
        timeInfo["timeStamp"] = timeStamp
        timeInfo["timeStr"] = timeStr
        
        if(this.data.role=="admin"){
          timeInfo["isDisabled"] = false
        }else{
          timeInfo["isDisabled"] = isDisabled
        }
        timeRange.push(timeInfo)
      }
      var obj = new Object()
      obj["month"] = month
      obj["day"] = day
      obj["week"] = week
      obj["list"] = timeRange
      obj["timeStamp"] = s
      obj["newtimeStamp"] = news
    
      
      this.data.unreserveTime.forEach((item,index)=>{
        if(item.year==year&&item.month==month&&item.day==day){
          obj.list.forEach((option)=>{
              if(option.timeStr==item.time){
                option.isDisabled=true;
              }
          })
        
        }
      })
      
      return obj;
    },
    formatNumber: function (n) {
      return n < 10 ? '0' + n : n
    },
    _nextDay: function () {

      var days = this.data.days
      days += 1
     
      var timeRangeInfo = this.getTimeRange(this.data.beginTime, this.data.endTime, this.data.timeGap, days)
    
      this.setData({
        timeRangeInfo: timeRangeInfo,
        days: days
      })
    },
    _lastDay: function () {
      var days = this.data.days
      days -= 1
      var timeRangeInfo = this.getTimeRange(this.data.beginTime, this.data.endTime, this.data.timeGap, days)
    
      this.setData({
        timeRangeInfo: timeRangeInfo,
        days: days
      })
    },
    _checkedClick: function (e) {
      var idx = e.currentTarget.dataset.idx
      var timeRangeInfo = this.data.timeRangeInfo
      var list = timeRangeInfo.list
      var timeStr = list[idx].timeStr
      // for (var i = 0; i < list.length; i++) {
      //   var info = list[i]
      //   if (i == idx) {
      //     info.checked = true
      //   } else {
      //     info.checked = false
      //   }
      // }
      list[idx].checked=!list[idx].checked
      this.setData({
        timeRangeInfo: timeRangeInfo,
        //show: false
      })
      var newDate = new Date(timeRangeInfo.newtimeStamp)
      const year = newDate.getFullYear()
      const month = this.formatNumber(newDate.getMonth() + 1)
      const day = this.formatNumber(newDate.getDate())
      var dateStr = year + '.' + month + '.' + day + '.' + timeStr+'.'+timeRangeInfo.week
      var myEventDetail = { date: dateStr } // detail对象，提供给事件监听函数
      
     // this.triggerEvent('yybindchange', myEventDetail)
    },
    _bottomBtnClick: function () {
      var timeRangeInfo = this.data.timeRangeInfo
      var list = timeRangeInfo.list
      var timeStr = ''
      // for (var i = 0; i < list.length; i++) {
      //   var info = list[i]
      //   if (info.checked) {
      //     timeStr = info.timeStr
      //     break;
      //   }
      // }
      this.setData({
        show: false
      })
      var newDate = new Date(timeRangeInfo.newtimeStamp)
      const year = newDate.getFullYear()
      const month = this.formatNumber(newDate.getMonth() + 1)
      const day = this.formatNumber(newDate.getDate());
      let str=[]
      for (var i = 0; i < list.length; i++) {
        var info = list[i]
        if (info.checked) {
          timeStr = info.timeStr
          var dateStr = year + '.' + month + '.' + day + '.' + timeStr+'.'+timeRangeInfo.week
          str.push(dateStr)
        }
      }
      var myEventDetail = { date: str } // detail对象，提供给事件监听函数
      this.triggerEvent('yybindchange', myEventDetail)
    },
    delClick: function () {
      this.setData({
        show: false
      })
      this.triggerEvent('del', {isShow:this.data.show})
    }
  },


  attached: function () {
    var timeRangeInfo = this.getTimeRange(this.data.beginTime, this.data.endTime, this.data.timeGap)
    this.setData({
      timeRangeInfo: timeRangeInfo
    })
  },

  observers: {
    'unreserveTime'(unreserveTime) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      var timeRangeInfo = this.getTimeRange(this.data.beginTime, this.data.endTime, this.data.timeGap)
       
      this.setData({
        timeRangeInfo: timeRangeInfo
      })
    }
  }




})
