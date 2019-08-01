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
			email: ''
		},
		count:40

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		console.log(options)
		self.data.buyType = options.type;
		self.data.buyId = options.id;
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserInfoData', self);
		self.setData({
			web_count:self.data.count
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

	







	counter(e) {
		const self = this;
		var type = api.getDataSet(e,'type')
		if (type == '+') {
			if (self.data.count < 150) {
				self.data.count = self.data.count + 1
			}

		} else if (type == '-') {
			if (self.data.count> 40) {
				self.data.count = self.data.count- 1
			}

		}
		self.setData({
			web_count:self.data.count
		})
	},


	addOrder() {

		const self = this;
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.remarks;
		delete newObject.email;
		const pass = api.checkComplete(newObject);
		if (pass) {
			const postData = {
				tokenFuncName:'getThreeToken',
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
					api.showToast('预约成功','none');	
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300);
				} else {
					api.showToast(res.msg,'none');
				};
			};
			api.addOrder(postData, callback);
		} else {
			api.showToast('请补充必要信息','none')
		}

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
