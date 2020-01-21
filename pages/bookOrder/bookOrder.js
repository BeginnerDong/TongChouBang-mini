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
			time: '',
			scale: '',
			remarks: '',
			name: '',
			phone: '',
		},
		count: 1,
		startTime: '',
		endTime: ''

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		if (!wx.getStorageSync('threeToken')) {
			api.pathTo('/pages/login/login?label=' + options.label + '&id=' + options.productid, 'redi');
		};
		console.log(options)
		self.data.buyType = options.type;
		self.data.buyId = options.id;
		self.data.id = options.productid;
		self.data.sale_count = options.sale_count;
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserInfoData', self);
		self.setData({
			web_count: self.data.count
		})
	},



	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData', self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},



	timeChange(e) {
		const self = this;
		self.data.submitData.time = e.detail.value;
		self.setData({
			web_time: e.detail.value,
		})
	},



	startChange(e) {
		const self = this;
		self.data.startTime = e.detail.value;
		self.setData({
			web_startTime: e.detail.value,
		})
	},


	endChange(e) {
		const self = this;
		self.data.endTime = e.detail.value;
		self.setData({
			web_endTime: e.detail.value,
		})
	},


	counter(e) {
		const self = this;
		var type = api.getDataSet(e, 'type')
		if (type == '+') {
			self.data.count = self.data.count + 1
		} else if (type == '-') {
			if (self.data.count > 1) {
				self.data.count = self.data.count - 1
			}

		}
		self.setData({
			web_count: self.data.count
		})
	},


	addOrder() {

		const self = this;
		api.buttonCanClick(self, false);
		self.data.submitData.group_no = self.data.startTime + '-' + self.data.endTime;
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.remarks;
		delete newObject.email;
		const pass = api.checkComplete(newObject);
		if (pass) {
			const postData = {
				tokenFuncName: 'getThreeToken',
				data: {
					passage_array: [self.data.submitData],
				}
			};
			if (self.data.buyType == 'sku') {
				postData.orderList = [{
					sku: [{
						id: self.data.buyId,
						count: self.data.count
					}, ],
					type: 1
				}, ]
			} else if (self.data.buyType == 'product') {
				postData.orderList = [{
					product: [{
						id: self.data.buyId,
						count: self.data.count
					}, ],
					type: 1
				}, ]
			}
			

			console.log('self.userData', self.userData)
			const callback = (res) => {
				if (res && res.solely_code == 100000) {
					api.buttonCanClick(self, true);
					self.orderUpdate(res.info.id);
				} else {
					api.buttonCanClick(self, true);
					api.showToast(res.msg, 'none');
				};
			};
			api.addOrder(postData, callback);
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补充必要信息', 'none')
		}
	},

	orderUpdate(id) {
		const self = this;
		var now = Date.parse(new Date())/1000;
		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.searchItem = {};
		postData.searchItem.id = id;
		postData.data = {
			update_time: now
		};
		postData.saveAfter = [{
			tableName: 'Product',
			FuncName: 'update',
			searchItem: {
				id: self.id
			},
			data: {
				sale_count: parseInt(self.data.sale_count) + parseInt(self.data.count)
			}
		}];
		const callback = res => {
			if (res.solely_code==100000) {
				wx.showModal({
					title: '预约成功',
					content: '提交预约成功，负责人会在八小时之内联系你，请注意接听电话，咨询热线：13126608897',
					showCancel: false, //是否显示取消按钮
					confirmText: "我知道了", //默认是“确定”
					confirmColor: '#FE546F', //确定文字的颜色
					success: function(res) {
						if (res.cancel) {
							//点击取消,默认隐藏弹框
						} else {
							setTimeout(function() {
								api.pathTo('/pages/myOrder/myOrder', 'redi');
							}, 800);
						}
					},
					fail: function(res) {}, //接口调用失败的回调函数
					complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
				})
			};
		};
		api.orderUpdate(postData, callback);
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
