//logs.js
import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();


Page({
	data: {
		indicatorDots: true,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 5000,
		duration: 1000,
		previousMargin: 0,
		nextMargin: 0,
		cityData: [],
		messageData: [],
		skuData: [],
		imgData: [],
		mapData: [],
		actData: [],
		mainData: [],
		urlSet:[],
		urlSetTwo:[],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			thirdapp_id: 2
		},
		stars:[1,2,3,4,5]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getCityData();
		//self.getUserInfoData()
	},
	
	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('threeInfo').user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.userInfoData = res.info.data[0];
			};
			self.setData({
				web_userInfoData: self.data.userInfoData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserInfoData', self);
		};
		api.userInfoGet(postData, callback);
	},
	
	intoMap() {
		const self = this;
		wx.openLocation({ //所以这里会显示你当前的位置
			// longitude: 109.045249,
			// latitude: 34.325841,
			longitude: parseFloat(self.data.mainData.longitude),
			latitude: parseFloat(self.data.mainData.latitude),
			name: self.data.mainData.title,
			address: self.data.mainData.address,
			scale: 28
		})
		/* wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success: function(res) { //因为这里得到的是你当前位置的经纬度
				var latitude = res.latitude
				var longitude = res.longitude
				
			}
		}) */
	},


	getCityData() {
		var self = this;
		var postData = {};

		postData.searchItem = {
			type: 11

		};
		postData.order = {
			listorder: 'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.cityData.push.apply(self.data.cityData, res.info.data);
			}
			self.getMainData();
		};
		console.log('self.city', self.city)
		api.labelGet(postData, callback);
	},

	getMainData() {
		var self = this;
		var postData = {
			searchItem: {}
		};

		postData.searchItem.id = self.data.id;
		postData.getAfter = {
			category: {
				tableName: 'Label',
				middleKey: 'category_id',
				key: 'id',
				searchItem: {
					status: 1
				},
				condition: '='
			},
			sku: {
				tableName: 'Sku',
				middleKey: 'product_no',
				key: 'product_no',
				searchItem: {
					status: 1
				},
				condition: '='
			},
			company1: {
				tableName: 'Product',
				middleKey: 'passage1',
				key: 'product_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		var callback = (res) => {
			console.log('getMainData', res);
			self.data.mainData = res.info.data[0]
			self.data.mainData.meet_facility = self.data.mainData.meet_facility.split(',');
			self.data.mainData.entertainment = self.data.mainData.entertainment.split(',');
			self.data.mainData.food_facility = self.data.mainData.food_facility.split(',');
			self.data.mainData.special_facility = self.data.mainData.special_facility.split(',');
			self.data.mainData.common_facility = self.data.mainData.common_facility.split(',');
			self.data.mainData.passage3 = self.data.mainData.passage3.split(',');
			self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			for (var i = 0; i < self.data.cityData.length; i++) {
				if (self.data.cityData[i].id == self.data.mainData.passage2) {
					self.data.mainData.passage2 = self.data.cityData[i].title
				}
			}
			console.log('self.data.mainData', self.data.mainData)
			for (var j = 0; j < self.data.mainData.sku.length; j++) {
				if (self.data.mainData.sku[j].behavior == 0) {
					
					self.data.skuData.push(self.data.mainData.sku[j])
				};
				if (self.data.mainData.sku[j].title == '图集') {
					self.data.imgData.push(self.data.mainData.sku[j])
				};
				if (self.data.mainData.sku[j].title == '位置地图') {
					self.data.mapData.push(self.data.mainData.sku[j])
				};
				if (self.data.mainData.sku[j].title == '历史活动') {
					self.data.actData.push(self.data.mainData.sku[j])
				}
			}
			console.log('self.data.skuData213', self.data.skuData)
			for (var i = 0; i < self.data.skuData.length; i++) {
				self.data.skuData[i].content = api.wxParseReturn(self.data.skuData[i].content).nodes;
			}
			console.log('self.data.skuData', self.data.skuData)
			console.log('self.data.imgData', self.data.imgData)
			console.log('self.data.actData', self.data.actData)

			self.setData({
				web_mainData: self.data.mainData,
				web_skuData: self.data.skuData,
				web_imgData: self.data.imgData,
				web_mapData: self.data.mapData,
				web_actData: self.data.actData
			})
			self.getMessageData()
		};
		api.productGet(postData, callback);
	},
	
	previewImg(e){
		const self = this;
		var index = e.currentTarget.dataset.index;
		if(self.data.imgData[index].mainImg.length>0){
		  for(var i=0;i<self.data.imgData[index].mainImg.length;i++){
			  self.data.urlSet.push(self.data.imgData[index].mainImg[i].url);
		  }
		}
		console.log('self.data.imgData.mainImg',self.data.imgData.mainImg)
		wx.previewImage({
		  current: self.data.imgData[index].mainImg[0].url,
		  urls: self.data.urlSet,
		  success: function(res) {},
		  fail: function(res) {},
		  complete: function(res) {},
		})
	},
	
	previewImgTwo(e){
		const self = this;
		var index = e.currentTarget.dataset.index;
		if(self.data.actData[index].mainImg.length>0){
		  for(var i=0;i<self.data.actData[index].mainImg.length;i++){
			  self.data.urlSetTwo.push(self.data.actData[index].mainImg[i].url);
		  }
		}
		console.log('self.data.actData.mainImg',self.data.actData.mainImg)
		wx.previewImage({
		  current: self.data.actData[index].mainImg[0].url,
		  urls: self.data.urlSetTwo,
		  success: function(res) {},
		  fail: function(res) {},
		  complete: function(res) {},
		})
	},

	getMessageData(id) {
		var self = this;
		var postData = {
			searchItem: {
				type: 3,
				user_type: 0
			}
		};
		//postData.tokenFuncName = 'getThreeToken';
		postData.searchItem.relation_id = self.data.id;
		postData.getAfter = {
			UserInfo: {
				tableName: 'UserInfo',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['name']
			},
		};
		var callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.messageData.push.apply(self.data.messageData, res.info.data)
			}
			self.setData({
				web_messageData: self.data.messageData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.messageGet(postData, callback);
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
