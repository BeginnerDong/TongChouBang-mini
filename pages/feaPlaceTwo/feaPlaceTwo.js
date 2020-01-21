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

		mainData: [],
		searchItem: {},
		isFirstLoadAllStandard: ['getMainData'],
		labelData: [],
		spuArray: [],
		isSelect:false,
		search:{
			title:''
		},
		stars:[1,2,3,4,5]
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		console.log(options)
		if(options.id){
			self.data.spuArray.push(parseInt(options.id))
		};
		self.data.getBefore = {
			spu: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {

					relation_two: ['in', self.data.spuArray]
				},
				condition: 'in'
			}
		};

		self.setData({
			web_isSelect:self.data.isSelect,
			web_spuArray:self.data.spuArray
		})
		self.getLabelData();
		self.getMainData()

	},
	
	select(e){
		const self = this;
		var index =api.getDataSet(e,'index');
		self.setData({
			web_isSelect:true,
			web_index:index
		})
	},
	
	selectChild(e){
		const self = this;
		var id = api.getDataSet(e,'id');
		var position = self.data.spuArray.indexOf(id);
		if(position >= 0){			
			self.data.spuArray.splice(position, 1);					
		}else{
			self.data.spuArray.push(id);		
		}
		console.log(self.data.spuArray)
		self.setData({
			web_spuArray:self.data.spuArray
		})
	},
	
	reset(){
		const self = this;
		api.buttonCanClick(self, false);
		self.data.spuArray = [];
		self.data.getBefore = {
			spu: {
				tableName: 'Relation',
				middleKey: 'product_no',
				key: 'relation_one',
				searchItem: {
		
					relation_two: ['in', self.data.spuArray]
				},
				condition: 'in'
			}
		};
		self.getMainData(true);
		self.setData({
			web_isSelect:false,
			web_spuArray:self.data.spuArray
		})
	},
	
	confirm(){
		const self = this;
		api.buttonCanClick(self, false);
		self.getMainData(true);
		self.setData({
			web_isSelect:false,
		})
	},

	goSearch(){
		const self = this;
		console.log('self.data.search.title',self.data.search.title)
		if(self.data.search.title!=''){
			
			api.pathTo('/pages/search/search?title='+self.data.search.title,'nav')
			self.data.search.title='';
		}else{
			api.showToast('输入标题搜索','nav')
		}
		self.setData({
			web_search: self.data.search,
		});
	},


	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'search');
		console.log('self.data.search', self.data.search)
		self.setData({
			web_search: self.data.search,
		});
	},

	onShow() {
		const self = this;


	},

	getLabelData() {
		var self = this;
		var postData = {};

		postData.searchItem = {
			type: ['in', [7, 8]],
			id: ['in', [4, 8, 18, 22, 23, 24, 25, 26, 27]]
		};
		postData.getAfter = {
			child: {
				tableName: 'Label',
				middleKey: 'id',
				key: 'parentid',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		postData.order = {
			listorder: 'desc'
		};

		var callback = function(res) {
			if (res.info.data.length > 0) {
				self.data.labelData.push.apply(self.data.labelData, res.info.data);
				for (var i = 0; i < self.data.labelData.length; i++) {
					self.data.labelData[i].title = self.data.labelData[i].title.split('-')
				}
			}
			self.setData({
				web_labelData: self.data.labelData
			})
		};
		console.log('self.data.labelData', self.data.labelData)
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
			category_id: 1,
			listorder:0
		};
		if (self.data.spuArray.length > 0) {
			postData.getBefore = api.cloneForm(self.data.getBefore);
		};
		postData.order = {
			create_time: 'asc'
		};
		postData.getAfter = {
			message:{
				tableName:'Message',
				middleKey:'id',
				key:'relation_id',
				searchItem:{
					status:1
				},
				condition:'=',
				compute:{
				  score:[
				    'sum',
				    'score',
				    {
				      status:1,
				    }
				  ],
				  count:[
				    'count',
				    'count',
				    {
				      status:1,
				    }
				  ]
				},
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
					for (var i = 0; i < self.data.mainData.length; i++) {
						self.data.mainData[i].averageScore = self.data.mainData[i].message.score/self.data.mainData[i].message.count
					}
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
	
	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},


})
