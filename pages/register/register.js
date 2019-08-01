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
			login_name: '',
			password: '',
			name:'',
			phone:'',
			address:'',
			thirdapp_id:2
		},
		isRead:false
	},

	onLoad() {
		const self = this;
		self.setData({
			web_isRead:self.data.isRead
		})		
	},

	read(){
		const self = this;
		self.data.isRead = !self.data.isRead;
		self.setData({
			web_isRead:self.data.isRead
		})
	},

	register() {
		const self = this;
		const postData = api.cloneForm(self.data.submitData)
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
