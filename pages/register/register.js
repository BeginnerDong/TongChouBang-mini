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
	
		submitData: {
			
			code: '',
			name:'',
			phone:'',
			address:'',
			thirdapp_id:2
		},
		isRead:false,
		hasSend:false,
		text:'获取验证码',
		currentTime:61,
		show1:false
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
			hasSend:self.data.hasSend,
			text:self.data.text,
			currentTime:self.data.currentTime,
			web_show1:self.data.show1,
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

	read() {
		const self = this;
		self.data.isRead = !self.data.isRead;
		self.data.show1 = false;
		self.setData({
			web_show1: self.data.show1,
			web_isRead: self.data.isRead
		})
	},
	
	sendCode(){
		var self = this;		
		if(self.data.hasSend){
			return;
		};
		var phone = self.data.submitData.phone;		
		if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {		
			api.showToast('手机号码错误', 'none')
			return;
		}
		var postData = {
			params:{
				PhoneNumbers:self.data.submitData.phone
			}
		};
		var callback = function(res){
			if(res.solely_code==100000){
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
						
						self.data.hasSend = true;
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

	register() {
		const self = this;
		
		const postData = {
			
			thirdapp_id:2,
			name:self.data.submitData.name,
			phone:self.data.submitData.phone,
			address:self.data.submitData.address
		};
		postData.smsAuth = {						
			phone:self.data.submitData.phone,						
			code:self.data.submitData.code					,
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('注册成功', 'none', 800);
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 800)
			} else {
				api.showToast(res.msg, 'none', 1000);
			};

		};
		api.register(postData, callback);
	},



	submit() {
		const self = this;
		api.buttonCanClick(self);
		
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			if(!self.data.isRead){
				api.buttonCanClick(self, true);
				api.showToast('请阅读免责声明', 'none')
				return
			};
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式错误', 'none')
			} else {
				self.register();
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData',self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	isShow1(){
		const self = this;
		self.getMainData();
		self.data.show1 = !self.data.show1;
		self.setData({
			web_show1: self.data.show1
		})
	},

/* 	bindRegionChange(e) {
		this.setData({
			region: e.detail.value
		})
	},

	bindPickerChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		console.log(self.data.typeData[e.detail.value].id)
		self.data.submitData.menu_id = self.data.typeData[e.detail.value].id;
		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	}, */






	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
