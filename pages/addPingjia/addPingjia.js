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


		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			thirdapp_id: 2
		},
		submitData: {
			content: '',
			score: ''
		},
		stars: [1, 2, 3, 4, 5],
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.data.id = options.id;
		self.getMainData();
		self.setData({
			web_stars: self.data.stars
		})
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.searchItem.id = self.data.id;
		const callback = (res) => {
			self.data.mainData = {};
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			};
			console.log(self.data.mainData);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.orderGet(postData, callback);
	},
	
	submit() {
		const self = this;
		api.buttonCanClick(self);
	
	
		var newObject = api.cloneForm(self.data.submitData);
		
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		if (pass) {
		
			self.addMessage();
		} else {
			api.buttonCanClick(self,true);
			api.showToast('请补全信息','none');
		};
	},

	addMessage() {
		const self = this;
		const postData = {
			tokenFuncName:'getThreeToken',
			data: {
				content: self.data.submitData.content,
				socre:self.data.submitData.score,
				relation_id: self.data.mainData.id,
				user_no:wx.getStorageSync('threeInfo').user_no,
				type: 3
			}
		};
		if(self.data.mainData.products[0].sku_id!=0){
			postData.data.relation_id = self.data.mainData.products[0].snap_product.product.id
		}else{
			postData.data.relation_id = self.data.mainData.products[0].snap_product.id
		};
		postData.saveAfter = [{
			tableName: 'Order',
			FuncName: 'update',
			searchItem: {
				order_no: self.data.mainData.order_no
			},
			data: {
				order_step: 3
			}
		}];
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.showToast('评价成功','none');	
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);

			} else {
				api.showToast(res.msg,'none')
			};


			console.log('getMainData', self.mainData)
		};
		api.messageAdd(postData, callback);
	},

	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData', self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},


	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

})
