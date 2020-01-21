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


	data: {
		isFirstLoadAllStandard: ['getUserInfoData'],
		submitData: {
			phone: '',
			passage1: '',
			title: '',
			passage_array: [],
			content: '',
			relation_id: '',
			type: 2,
			
		},
		cityData: [],
		type: [{
				name: '找特色会场',
				isSelect: false
			}, {
				name: '找印刷商',
				isSelect: false
			}, {
				name: '找兼职',
				isSelect: false
			},
			{
				name: '会议自助餐',
				isSelect: false
			}, {
				name: '活动道具租赁',
				isSelect: false
			}, {
				name: '线下广告',
				isSelect: false
			}, {
				name: '礼品采购',
				isSelect: false
			}, {
				name: '店铺转让',
				isSelect: false
			}
		],
		cityData:[],
		isRead:false,
		show:false
	},

	onLoad(options) {
		const self = this;
		self.data.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['免责声明']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		api.commonInit(self);
		self.getUserInfoData()
		self.getCityData();
		self.setData({
			web_show: self.data.show,
			web_isRead:self.data.isRead
		})		
	},
	
	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
		};
	
		postData.getBefore = api.cloneForm(self.data.getBefore);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;	
			} 
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
	},
	
	isShow(){
		const self = this;
		self.getMainData();
		self.data.show = !self.data.show;
		self.setData({
			web_show: self.data.show
		})
	},
	
	read() {
		const self = this;
		self.data.isRead = !self.data.isRead;
		self.data.show1 = false;
		self.setData({
			web_show1: self.data.show1,
			web_isRead: self.data.isRead
		})
	},
	
	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData',self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	cityChange(e){
		const self = this;
		self.data.submitData.relation_id = self.data.cityData[e.detail.value].id;
		self.setData({
			web_index:e.detail.value,
			web_submitData:self.data.submitData
		})
	},

	messageAdd() {
		const self = this;
		const postData = {};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.data.user_type = 0;
		postData.tokenFuncName = 'getThreeToken';
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.solely_code == 100000) {
				api.showToast('申请成功','none');
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);
				
			} else {
				api.showToast(res.msg,'none')
			}

		};
		api.messageAdd(postData, callback);
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
			self.setData({
				web_cityData:self.data.cityData
			})
		};
		api.labelGet(postData, callback);
	},



	submit() {
		const self = this;
		api.buttonCanClick(self);
		console.log(self.data.submitData)

		var newObject = api.cloneForm(self.data.submitData);
		console.log(newObject)
		delete newObject.content;
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		if (pass) {
			if(!self.data.isRead){
				api.buttonCanClick(self, true);
				api.showToast('请阅读免责声明', 'none')
				return
			};
			self.messageAdd();
		} else {
			api.buttonCanClick(self,true);
			api.showToast('请补全信息','none');
		};
	},


	selectType(e) {
		const self = this;
		console.log(index)
		var index  = api.getDataSet(e,'index');
		console.log(self.data.submitData.passage_array)
		console.log(api.inArray(self.data.type[index].name, self.data.submitData.passage_array))
		var position = self.data.submitData.passage_array.indexOf(self.data.type[index].name);
		if (position >= 0) {

			self.data.submitData.passage_array.splice(position, 1);
			self.data.type[index].isSelect = false;

		} else {
			self.data.submitData.passage_array.push(self.data.type[index].name);
			self.data.type[index].isSelect = true;
		}
		console.log(self.data.submitData.passage_array)
		self.setData({
			web_submitData:self.data.submitData,
			type:self.data.type
		})

	},

	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('threeInfo').user_no
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



	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	}

})
