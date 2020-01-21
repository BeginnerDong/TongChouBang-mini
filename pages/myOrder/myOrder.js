import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();



Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
    },
    isFirstLoadAllStandard:['getMainData'],
  },


  onLoad(options){
    const self = this;
    api.commonInit(self);
	console.log(options)
    self.data.mainData = [];
    if(options.num){
      self.changeSearch(options.num)
    }else{
      self.getMainData()  
    };
    self.setData({
      web_mainData:self.data.mainData
    });
    
  },

  onShow(){
    const self = this;
  
   
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getThreeToken';
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.mainData.push.apply(self.data.mainData,res.info.data);
        }else{
          self.data.isLoadAll = true;
         
        };
        api.buttonCanClick(self,true);
        api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
        self.setData({
          web_mainData:self.data.mainData,
        });  
      }else{
        api.showToast('网络故障','none')
      }
    };
    api.orderGet(postData,callback);
  },

  deleteOrder(e){
    const self = this;
    api.buttonCanClick(self);
	var index = api.getDataSet(e,'index')
    const postData = {};
    postData.tokenFuncName = 'getThreeToken';
    postData.searchItem = {};
    postData.searchItem.id = self.data.mainData[index].id;
	postData.data = {
		order_step:4
	};
    const callback  = res=>{
      if(res){
        api.dealRes(res);
      };
      self.getMainData(true);
    };
    api.orderUpdate(postData,callback);
  },



  menuClick: function (e) {
    const self = this;
    api.buttonCanClick(self)
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },

  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem = {};
    if(num=='0'){
		
    }else if(num=='1'){
		self.data.searchItem.order_step = '0'
    }else if(num=='2'){
      self.data.searchItem.order_step = '1'
    }else if(num=='3'){
      self.data.searchItem.order_step = '2'
    }else if(num=='4'){
      self.data.searchItem.order_step = '3'
    }else if(num=='5'){
      self.data.searchItem.order_step = '4'
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },


})

  