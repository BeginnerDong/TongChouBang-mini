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
			code: ''

		},
		web_show: true,
		isRead: false,
		show1: false,
		hasSend:false,
		text:'获取验证码',
		currentTime:61
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
		if(options.label){
			self.data.label = options.label
		};
		if(options.id){
			self.data.id = options.id
		};
		self.setData({
			hasSend:self.data.hasSend,
			text:self.data.text,
			currentTime:self.data.currentTime,
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
		self.data.show1 = false;
		self.setData({
			web_show1: self.data.show1,
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
	
	sendCode(){
		var self = this;
		wx.showLoading()
		if(self.data.hasSend){
			return;
		};
		var phone = self.data.sForm.login_name;		
		if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {		
			api.showToast('手机号码错误', 'none')
			return;
		}
		var postData = {
			params:{
				PhoneNumbers:self.data.sForm.login_name
			}
		};
		var callback = function(res){
			if(res.solely_code==100000){
				wx.hideLoading();
				self.data.hasSend = true;
				self.setData({
					hasSend:self.data.hasSend,
				});
				var interval = setInterval(function() {
					self.data.currentTime--; //每执行一次让倒计时秒数减一
				
					self.data.text=self.data.currentTime + 's';//按钮文字变成倒计时对应秒数
					self.setData({
						
						text:self.data.text,
						currentTime:self.data.currentTime
					})
					//如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
					if (self.data.currentTime <= 0) {
						clearInterval(interval)
						
						self.data.hasSend = false;
						self.data.text='重新发送';
						self.data.currentTime= 61;
						self.setData({
							hasSend:self.data.hasSend,
							text:self.data.text,
							currentTime:self.data.currentTime
						})
					}
					
				}, 1000);
			}else{
				
				api.showToast('发送失败', 'none')
			};
		};
		api.sendCode(postData, callback);
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
			return
		};
		const postData = {
			login_name: self.data.sForm.login_name,			
		};	
		postData.smsAuth = {
			phone:self.data.sForm.login_name,						
			code:self.data.sForm.code,
		};
		const callback = (res) => {
			if (res.solely_code==100000) {
				wx.setStorageSync('threeToken', res.token);
				wx.setStorageSync('threeInfo', res.info);
				/* if(self.data.label&&self.data.label=='one'){
					wx.redirectTo({
						url: '/pages/goodsDetails/goodsDetails?id='+self.data.id+'&label='+self.data.label
					})
				}else if(self.data.label&&self.data.label=='two'){
					wx.redirectTo({
						url: '/pages/goodsDetailsTwo/goodsDetailsTwo?id='+self.data.id
					})
				}else{
					wx.redirectTo({
						url: '/pages/myCenter/myCenter'
					})
				} */
				if(self.data.label){
					wx.redirectTo({
						url: '/pages/orderKnow/orderKnow?id='+self.data.id+'&label='+self.data.label
					})
				}else{
					wx.redirectTo({
						url: '/pages/orderKnow/orderKnow'
					})
				}
				api.showToast('登陆成功', 'none')
			} else {
				wx.hideLoading();
				api.showToast(res.msg, 'none')
			}
		}
		api.login(postData,callback);
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
