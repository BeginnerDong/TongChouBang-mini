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
		indicatorDots: true,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 4000,
		duration: 1000,
		previousMargin: 0,
		nextMargin: 0,
		swiperData:[],
		productOneData:[],
		productTwoData:[],
		productThreeData:[],
		productFourData:[],
		productFiveData:[],
		productSixData:[],
		searchItem:{
			status:1,
			
		},
		search:{
			title:''
		},
		isFirstLoadAllStandard:['getProductOneData']
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getSliderData();
		self.getLabelOneData();
	/* 	self.getLabelTwoData();
		self.getLabelThreeData();
		self.getLabelFourData();
		self.getLabelFiveData();
		self.getLabelSixData(); */
	},
	
	goSearch(){
		const self = this;
		console.log('self.data.search.title',self.data.search.title)
		if(self.data.search.title!=''){
			
			api.pathTo('/pages/search/search?title='+self.data.search.title,'nav')
			self.data.search.title='';
		}else{
			api.showToast('输入标题搜索','nav')
		}
		self.setData({
			web_search: self.data.search,
		});
	},
	
	
	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'search');
		console.log('self.data.search',self.data.search)
		self.setData({
			web_search: self.data.search,
		});
	},

	menuClick(e) {
		var that = this;
		//console.log(e);
		var num = e.currentTarget.dataset.num;
		that.setData({
			num: e.currentTarget.dataset.num
		})
		if (num == 0) {

		} else if (num == 1) {
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
		} else if (num == 5) {
			wx.navigateTo({
				url: '/pages/conferenceBuffet/conferenceBuffet'
			})
		} else if (num == 6) {
			wx.navigateTo({
				url: '/pages/lease/lease'
			})
		} else if (num == 7) {
			wx.navigateTo({
				url: '/pages/advertising/advertising'
			})
		} else if (num == 8) {
			wx.navigateTo({
				url: '/pages/giftPurchasing/giftPurchasing'
			})
		}
	},

	getSliderData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
			title: '首页轮播',
		};
	
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.swiperData = res.info.data[0]
			};
			
			self.setData({
				web_swiperData:self.data.swiperData
			})
		};
		api.labelGet(postData, callback);
	},

	getLabelOneData(id) {
		var self = this;
		var postData = {};

		postData.searchItem = {
			parentid: 4,
			title: '年会场地'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.id1 = res.info.data[0].id;
				self.getProductOneData(res.info.data[0].id)
			}
			self.setData({
				web_id1:self.data.id1
			})
		};

		api.labelGet(postData, callback);
	},

	getProductOneData(id) {
		var self = this;
		var postData = {};
		postData.paginate={
			count: 0,
			currentPage:1,
			pagesize:4,
			is_page:true,
		};
		postData.searchItem = {
			status: 1,
			listorder:['not in',0]
		};
		postData.getBefore = {
			Label: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
					status: ['in', [1]],
					relation_two: ['in', [id]]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder:'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.productOneData.push.apply(self.data.productOneData, res.info.data);
				self.getLabelTwoData();
			}
			self.setData({
				web_productOneData:self.data.productOneData
			})
			console.log('self.data.productOneData',self.data.productOneData)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductOneData', self);
		};

		api.productGet(postData, callback);
	},

	getLabelTwoData(id) {
		var self = this;
		var postData = {};

		postData.searchItem = {
			parentid: 4,
			title: '品牌推广场地'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.id2 = res.info.data[0].id;
				self.getProductTwoData(res.info.data[0].id)
			}
			self.setData({
				web_id2:self.data.id2
			})
		};

		api.labelGet(postData, callback);
	},

	getProductTwoData(id) {
		var self = this;
		var postData = {};
		postData.paginate={
			count: 0,
			currentPage:1,
			pagesize:4,
			is_page:true,
		};
		postData.searchItem = {
			status: 1,
			listorder:['not in',0]
		};
		postData.getBefore = {
			Label: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
					status: ['in', [1]],
					relation_two: ['in', [id]]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder:'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.productTwoData.push.apply(self.data.productTwoData, res.info.data);
				self.getLabelThreeData();
			}
			self.setData({
				web_productTwoData:self.data.productTwoData
			})
			//api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductTwoData', self);
		};

		api.productGet(postData, callback);
	},

	getLabelThreeData(id) {
		var self = this;
		var postData = {};

		postData.searchItem = {
			parentid: 4,
			title: '发布会场地'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.id3 = res.info.data[0].id;
				self.getProductThreeData(res.info.data[0].id)
			}
			self.setData({
				web_id3:self.data.id3
			})
		};

		api.labelGet(postData, callback);
	},

	getProductThreeData(id) {
		var self = this;
		var postData = {};
		postData.paginate={
			count: 0,
			currentPage:1,
			pagesize:4,
			is_page:true,
		};
		postData.searchItem = {
			status: 1,
			listorder:['not in',0]
		};
		postData.getBefore = {
			Label: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
					status: ['in', [1]],
					relation_two: ['in', [id]]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder:'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.productThreeData.push.apply(self.data.productThreeData, res.info.data);
				self.getLabelFourData();
			}
			self.setData({
				web_productThreeData:self.data.productThreeData
			})
			//api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductThreeData', self);
		};

		api.productGet(postData, callback);
	},

	getLabelFourData(id) {
		var self = this;
		var postData = {};

		postData.searchItem = {
			parentid: 4,
			title: '婚宴场地'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.id4 = res.info.data[0].id;
				self.getProductFourData(res.info.data[0].id)
			}
			self.setData({
				web_id4:self.data.id4
			})
		};

		api.labelGet(postData, callback);
	},

	getProductFourData(id) {
		var self = this;
		var postData = {};
		postData.paginate={
			count: 0,
			currentPage:1,
			pagesize:4,
			is_page:true,
		};
		postData.searchItem = {
			status: 1,
			listorder:['not in',0]
		};
		postData.getBefore = {
			Label: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
					status: ['in', [1]],
					relation_two: ['in', [id]]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder:'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.productFourData.push.apply(self.data.productFourData, res.info.data);
				self.getLabelFiveData();
			}
			self.setData({
				web_productFourData:self.data.productFourData
			})
			//api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductFourData', self);
		};

		api.productGet(postData, callback);
	},

	getLabelFiveData(id) {
		var self = this;
		var postData = {};

		postData.searchItem = {
			parentid: 4,
			title: '商务会议场地'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.id5 = res.info.data[0].id;
				self.getProductFiveData(res.info.data[0].id)
			}
			self.setData({
				web_id5:self.data.id5
			})
		};

		api.labelGet(postData, callback);
	},

	getProductFiveData(id) {
		var self = this;
		var postData = {};
		postData.paginate={
			count: 0,
			currentPage:1,
			pagesize:4,
			is_page:true,
		};
		postData.searchItem = {
			status: 1,
			listorder:['not in',0]
		};
		postData.getBefore = {
			Label: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
					status: ['in', [1]],
					relation_two: ['in', [id]]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder:'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.productFiveData.push.apply(self.data.productFiveData, res.info.data)
				self.getLabelSixData();
			}
			self.setData({
				web_productFiveData:self.data.productFiveData
			})
			//api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductFiveData', self);
		};

		api.productGet(postData, callback);
	},

	getLabelSixData(id) {
		var self = this;
		var postData = {};

		postData.searchItem = {
			parentid: 4,
			title: '团建场地'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.id6 = res.info.data[0].id;
				self.getProductSixData(res.info.data[0].id)
			}
			self.setData({
				web_id6:self.data.id6
			})
		};

		api.labelGet(postData, callback);
	},

	getProductSixData(id) {
		var self = this;
		var postData = {};
		postData.paginate={
			count: 0,
			currentPage:1,
			pagesize:4,
			is_page:true,
		};
		postData.searchItem = {
			status: 1,
			listorder:['not in',0]
		};
		postData.getBefore = {
			Label: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
					status: ['in', [1]],
					relation_two: ['in', [id]]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder:'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.productSixData.push.apply(self.data.productSixData, res.info.data)
			}
			self.setData({
				web_productSixData:self.data.productSixData
			})
			//api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductSixData', self);
		};

		api.productGet(postData, callback);
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
