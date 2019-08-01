import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();



Page({
	data: {
		num: '',
		mainData: [],
		searchItem: {},
		isFirstLoadAllStandard: ['getMainData'],
		labelData:[]
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		console.log(options)
		self.data.title = options.title;
		self.getLabelData();
		

	},

	onShow() {
		const self = this;


	},
	getLabelData() {
		var self = this;
		var postData = {};

		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.getBefore = {
			Label: {
				tableName: 'Label',
				middleKey: 'parentid',
				key: 'id',
				searchItem: {
					title: ['in', ['精选案例']]
				},
				condition: 'in'
			}
		};
		postData.order = {
			listorder: 'desc'
		};
		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.labelData.push.apply(self.data.labelData, res.info.data);
				self.data.num = self.data.labelData[0].id; 
				self.data.searchItem.menu_id = self.data.num
			}
			self.setData({
				num:self.data.num,
				web_labelData: self.data.labelData,
			});
			self.getMainData()
		};
		api.labelGet(postData, callback);
	},
	
	


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			title: ['LIKE', ['%' + self.data.title + '%']]
		}
		postData.order = {
			listorder: 'desc'
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none', 1000);
				};
				api.buttonCanClick(self, true);
				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.showToast('网络故障', 'none')
			}
		};
		api.productGet(postData, callback);
	},






	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedi(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},


})
