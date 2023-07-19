Page({
  data: {
    pageLoading: false,
    tabList: [
      {
        text: '推荐',
        key: 0,
      },
      {
        text: '二手',
        key: 1,
      },
      {
        text: '租房',
        key: 2,
      },
      {
        text: '顺风车',
        key: 3,
      },
    ],
  },

  privateData: {
    tabIndex: 0,
  },
  
  onLoad() {
    this.init();
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

    this.setData({
      pageLoading: true,
    });

    // this.loadGoodsList(true);
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    // this.loadGoodsList(true);
  },

  navToSearchPage() {
    // wx.navigateTo({ url: '/pages/goods/search/index' });
  }

});