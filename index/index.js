// pages/index/index.js
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
    num: 0
  },
  detail: function () {
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails'
    })
  },
 search: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
 menuClick: function (e) {
   var that=this;
   //console.log(e);
   var num = e.currentTarget.dataset.num;
   that.setData({
     num: e.currentTarget.dataset.num
   })
   if (num==0){
     wx.navigateTo({
       url: '/pages/index/index'
     })
   } else if (num == 1){
     wx.navigateTo({
       url: '/pages/feaPlace/feaPlace'
     })
   } else if (num == 2) {
     wx.navigateTo({
       url: '/pages/typographer/typographer'
     })
   } else if (num == 3) {
     wx.navigateTo({
       url: '/pages/partJob/partJob'
     })
   } else if (num == 4) {
     wx.navigateTo({
       url: '/pages/shopTransfer/shopTransfer'
     })
   }
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
  }
})