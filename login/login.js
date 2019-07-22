// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     show:false
  },
 myCenter: function () {
    wx.navigateTo({
      url: '/pages/myCenter/myCenter'
    })
  },
 myCenter: function () {
   wx.navigateTo({
     url: '/pages/myCenter/myCenter'
   })
 },

  register: function () {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },
  changePassword: function() {
    wx.navigateTo({
      url: '/pages/changePassword/changePassword'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	this.setData({
		web_show:this.data.show
	})
  },
	
	
	isShow(){
		this.data.show =!this.data.show
		this.setData({
			web_show:this.data.show
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
  onShareAppMessage: function () {
  
  }
})