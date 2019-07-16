//index.js
//index.js
Page({
  data: {
    imgUrls: [
      '/images/banner.png',
      '/images/banner.png',
      '/images/banner.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  detail: function () {
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails'
    })
  }
 
})
