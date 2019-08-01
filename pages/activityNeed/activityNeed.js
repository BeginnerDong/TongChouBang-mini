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
		
		cityData: [],
		type: [
			{
				name: '不限',
				isSelect: false
			},
			{
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
		submitData: {
			phone: '',
			passage1: '',
			title: '',
			description: '',
			content: '',
			keywords: '',
			type: 1,
			
		},
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserInfoData', self);		
	},
	
	
	
	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData',self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	typeChange(e){
		const self = this;
		self.data.submitData.title = self.data.type[e.detail.value].name;
		self.setData({
			web_index:e.detail.value,
			web_submitData:self.data.submitData
		})
	},
	
	timeChange(e){
		const self = this;
		self.data.submitData.description = e.detail.value;
		self.setData({
			web_time:e.detail.value,
		})
	},

	messageAdd() {
		const self = this;
		const postData = {};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.data.user_type = 0;
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.solely_code == 100000) {
				api.showToast('申请成功','none');
				self.data.submitData ={
					phone: '',
					passage1: '',
					title: '',
					description: '',
					content: '',
					keywords: '',
					type: 1,
					user_type:0
				};
				self.setData({
					web_index:'',
					web_time:'',
					web_submitData:self.data.submitData
				})
			} else {
				api.showToast(res.msg,'none')
			}

		};
		api.addMessage(postData, callback);
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
		
			self.messageAdd();
		} else {
			api.buttonCanClick(self,true);
			api.showToast('请补全信息','none');
		};
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
