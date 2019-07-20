// pages/myCenter/myCenter.js
import {
  Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
  Token
} from '../../utils/token.js';
const token = new Token(); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  addPingjia: function () {
    wx.navigateTo({
      url: '/pages/addPingjia/addPingjia'
    })
  },
  detail: function () {
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails'
    })
  },
  myOrder: function () {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder'
    })
  },
  applyEnter: function () {
    wx.navigateTo({
      url: '/pages/applyEnter/applyEnter'
    })
  },
  helpCenter:function() {
    wx.navigateTo({
      url: '/pages/helpCenter/helpCenter'
    })
  },
  connectUs: function () {
    wx.navigateTo({
      url: '/pages/connectUs/connectUs'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  intoPathRedirect(e) {
    const self = this;
    api.pathTo(api.getDataSet(e, 'path'), 'redi');
  },
  intoPath(e) {
    const self = this;
    api.pathTo(api.getDataSet(e, 'path'), 'nav');
  }

})