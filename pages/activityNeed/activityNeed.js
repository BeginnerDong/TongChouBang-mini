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
			code:''
		},
		hasSend:false,
		text:'获取验证码',
		currentTime:61	
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserInfoData', self);		
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
		postData.smsAuth = {
			phone:self.data.submitData.phone,						
			code:self.data.submitData.code,
		};
		postData.data.user_type = 0;
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.solely_code == 100000) {
				
				wx.showModal({
				 title: '提交成功',
				 content: '提交需求成功，负责人会在八个小时之内联系你，请注意接听电话，咨询热线：13126608897',
				 showCancel: false,//是否显示取消按钮
				 confirmText:"我知道了",//默认是“确定”
				 confirmColor: '#FE546F',//确定文字的颜色
				 success: function (res) {
					if (res.cancel) {
					   //点击取消,默认隐藏弹框
					} else {
					
					}
				 },
				 fail: function (res) { },//接口调用失败的回调函数
				 complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
			  })
				self.data.submitData ={
					phone: '',
					passage1: '',
					title: '',
					description: '',
					content: '',
					keywords: '',
					type: 1,				
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
