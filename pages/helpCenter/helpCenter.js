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
	
		searchItem: {},
		mainData:[],
		isFirstLoadAllStandard: ['getMainData']
	},
	
	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	
	},
	
	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			menu_id: 103
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData,res.info.data)
			};
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.articleGet(postData, callback);
	},
	
	  onReachBottom() {
	  const self = this;
	  if(!self.data.isLoadAll&&self.data.buttonCanClick){
	    self.data.paginate.currentPage++;
	    self.getMainData();
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
