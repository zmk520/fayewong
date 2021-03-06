Page({
  data: {
    direction: '--',
    angle: '--',
    rotate: '',
    x:'-',
    y:'-',
    z:'-',
    latitude:'',
    longitude:'',
    speed:'',
    accuracy:''
  },
  //事件处理函数
  onLoad: function () {
    
    var that = this;
    wx.onCompassChange(function (res) {
      // 罗盘数据保留两位小数
      var directions = res.direction;
      var radios = res.direction.toFixed(0);
      
      that.setData({
        angle: directions,
        rotate: 360 - radios,
        direction: check(radios)
      })
    });
    wx.onAccelerometerChange(function(res){
      // 加速度数据
      var a = res.x;
      var b = res.y;
      var c = res.z;
      that.setData({
        x:a,
        y:b,
        z:c
      });
      wx.getLocation({
        type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function(res){
          // success
          var mylatitude = res.latitude;
          var mylongitude = res.longitude;
          var myspeed = res.speed;
          var myaccuracy = res.accuracy;
          that.setData({
            latitude:mylatitude,
            longitude:mylongitude,
            speed:myspeed,
            accuracy:myaccuracy
          })
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
    })
    // 判断手机是否有陀旋仪
    // 外部检测，如果没有陀旋仪数据，代码不会进入wx.onCompassChange
    // 必须使用setsetTimeout包裹代码，否则代码立即执行都会弹窗
    setTimeout(function(){
      if(that.data.direction == '--' && that.data.angle == '--'){
        wx.showToast({
          title: '您的手机没有电子罗盘或被禁用',
          icon: 'loading',
          duration: 5000,//持续时间
          mask: true
        })
      }
    },3000);
    // 判断文字
    function check(i){
      if(15<=i && i<=75){
        return '东北'
      }else if(75<i && i<105){
        return '正东'
      }else if(105<=i && i<=165){
        return '东南'
      }else if(165<i && i<195){
        return '正南'
      }else if(195<=i && i<=255){
        return '西南'
      }else if(255<i && i<285){
        return '正西'
      }else if(285<=i && i<=345){
        return '西北'
      }else{
        return '正北'
      }
    }
  },
  // 设置页面分享
  onShareAppMessage: function () {
      return {
          title: '我现在面向 ' + this.data.direction + ' 方向 , 点我使用迷你指南针为您指引方向！',
          path: '/pages/mypage/mypage'
      }
  }
})