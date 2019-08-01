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
	
		submitData: {
			phone:'',
			password:'',
			passwordNew:''
		},
		buttonCanClick:false,
		isRead:false
	},

	onLoad(options) {
		const self = this;
		
		
		self.setData({
			web_buttonCanClick:self.data.buttonCanClick
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
	

	resetPassword() {
		const self = this;
		const postData = {};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.tokenFuncName = 'getThreeToken';
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.solely_code == 100000) {
				api.showToast('修改成功','none');
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);
				
			} else {
				api.showToast(res.msg,'none')
			}

		};
		api.resetPassword(postData, callback);
	},

	


	submit() {
		const self = this;
		api.buttonCanClick(self);
		console.log(self.data.submitData)
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			if(!self.data.submitData.password!=self.data.submitData.passwordNew){
				api.buttonCanClick(self, true);
				api.showToast('两次密码不一致', 'none')
				return
			};
			self.resetPassword();
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
