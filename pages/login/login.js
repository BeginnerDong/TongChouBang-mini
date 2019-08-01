import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
var token = new Token();

Page({

	data: {

		sForm: {
			login_name: '',
			password: ''

		},
		web_show: true,
		isRead: false,
		show1: false
	},

	onLoad() {
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
		self.setData({
			web_show1:self.data.show1,
			web_isRead: self.data.isRead
		})
	},
	
	isShow1(){
		const self = this;
		self.getMainData();
		self.data.show1 = !self.data.show1;
		self.setData({
			web_show1: self.data.show1
		})
	},


	read() {
		const self = this;
		self.data.isRead = !self.data.isRead;
		self.setData({
			web_isRead: self.data.isRead
		})
	},

	onShow() {
		const self = this;
		if (wx.getStorageSync('threeInfo') && wx.getStorageSync('threeToken')) {
			self.setData({
				web_show: false
			});
			wx.redirectTo({
				url: '/pages/myCenter/myCenter'
			})
		};

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
	


	submit() {
		const self = this;

		wx.showLoading();
		if (api.checkComplete(self.data.sForm)) {
			if (!self.data.isRead) {
				api.showToast('请阅读免责声明', 'none')
				return
			};
			wx.setStorageSync('login', self.data.sForm);
		} else {
			api.showToast('请输入账号密码', 'none')
		}
		const callback = (res) => {
			if (res) {
				wx.setStorageSync('threeInfo', res.data.info);
				wx.redirectTo({
					url: '/pages/myCenter/myCenter'
				})
				api.showToast('登陆成功', 'none')
			} else {
				wx.hideLoading();
				api.showToast('用户不存在', 'none')
			}
		}
		token.getToken(callback);
	},


	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'sForm');
		self.setData({
			web_sForm: self.data.sForm,
		});
	},





	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


})
