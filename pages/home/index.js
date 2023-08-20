import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  data: {
    goodsListLoadStatus: 0,
    auth: 0,

    tabList: [
      {
        text: '推荐',
        key: 0,
      },
      // {
      //   text: '闲置',
      //   key: 1,
      // },
      // {
      //   text: '租房',
      //   key: 2,
      // },
      // {
      //   text: '顺风车',
      //   key: 3,
      // },
    ],
    locationIndex: 0,
    locationArray: ['Waterloo'],
    goodsList: []
  },

  goodListPagination: {
    num: 10,
    pivot: wx.cloud.database().serverDate(),
  },

  privateData: {
    tabIndex: 0,
  },
  
  onLoad() {
    this.init();
    this.setData({
      auth: app.globalData.userInfo.currAuth
    })
    app.setUserInfoSub(this.userInfoCallback);

    if (this.data.auth == 1) {
      this.getTabBar().bindNotify();
    }
  },

  userInfoCallback: function(value) {
    this.setData({
      auth: value.currAuth,
    })
    if (this.data.auth == 1) {
      this.getTabBar().bindNotify();
    }
  },

  onShow() {
    this.getTabBar().init(app.globalData.unread);
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    // this.loadGoodsList(true);
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    const pagePivot = this.goodListPagination.pivot;

    try {
      const db = wx.cloud.database();
      await db.collection('goods')
      .where({
        // _openid: db.command.neq(app.globalData.openid),
        time: db.command.lt(pagePivot),
        'goodInfo.location': this.data.locationArray[this.data.locationIndex],
      })
      .orderBy('time', 'desc')
      .limit(pageSize)
      .field({
        _id: true,
        time: true,
        'goodInfo.priImg': true,
        'goodInfo.priceSign': true,
        'goodInfo.price': true,
        'goodInfo.title': true,
      })
      .get()
      .then((res) => {
        if (res.data.length == 0) {
          this.setData({ goodsListLoadStatus: 2 });
          this.goodListPagination.pivot = wx.cloud.database().serverDate();
        } else {
          let saveList = wx.getStorageSync('saveList');
          let tempGood = res.data;
          tempGood.forEach(element => {
            if (saveList.includes(element._id)) {
              element.saved = true;
            } else {
              element.saved = false;
            }
          });
          this.setData({
            goodsList: fresh ? tempGood : this.data.goodsList.concat(tempGood),
            goodsListLoadStatus: 0,
          });
    
          this.goodListPagination.pivot = this.data.goodsList[this.data.goodsList.length-1].time;
        }
      }).catch((e) => {
        console.log("ERROR: Fail to get items");
      });

    } catch (err) {
      this.setData({ goodsListLoadStatus: 3 });
    }
  },

  bindLocationPickerChange: function(e) {
    this.setData({
      locationIndex: e.detail.value
    })
  },

  goodListClickHandle(e) {
    wx.navigateTo({
      url: '/pages/goods/details/index?id=' + e.detail._id,
    });
  },

  goodListSaveHandle(e) {
    if (this.data.auth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆即可保存收藏哦',
        duration: 1500,
      });
      return;
    }

    let length = this.data.goodsList.length;
    for (let i = 0; i < length; i++) {
      if (this.data.goodsList[i]._id == e.detail._id) {
        let val = "goodsList[" + i + "].saved";
        this.setData({
          [val]: e.detail.saved
        });
        break;
      }
    }

    let saveList = wx.getStorageSync('saveList');
    if (e.detail.saved) {
      if (saveList) {
        wx.setStorageSync('saveList', saveList.concat( e.detail._id ));
      } else {
        wx.setStorageSync('saveList', [ e.detail._id ]);
      }

      // const userDB = wx.cloud.database().collection('users');
      // userDB.where({
      //   _openid: app.globalData.openid
      // })
      // .get()
      // .then((res) => {
      //   console.log(res)
      // })
    } else {
      if (saveList) {
        wx.setStorageSync('saveList', saveList.filter(item => item !== e.detail._id));
      }
    }
  }
});