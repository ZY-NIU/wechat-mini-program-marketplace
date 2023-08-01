Page({
  data: {
    pageLoading: false,
    tabList: [
      {
        text: '推荐',
        key: 0,
      },
      {
        text: '闲置',
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
    location: "滑铁卢",
    goodsList: [
      {
        id: 1,
        title: '白色短袖连衣裙',
        price: 34,
        originPrice: 35,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      },
      {
        id: 2,
        title: '短袖',
        price: 3456,
        originPrice: 9999,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
      },
      {
        id: 3,
        title: '棋',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
      },
      {
        id: 4,
        title: '5个碗，6个锅',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-17a.png',
      },
      {
        id: 5,
        title: 'personal computer, mouse',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      },
      {
        id: 6,
        title: '洗衣机，烘干机，衣服，裤子',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
      },
    ]
  },

  privateData: {
    tabIndex: 0,
  },
  
  onLoad() {
    this.init();
  },

  onShow() {
    this.getTabBar().init();
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
      // pageLoading: true,
    });

    // this.loadGoodsList(true);
  },

  navToSearchPage() {
    // wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    // this.loadGoodsList(true);
  },

  locationChangeHandle(e) {

  },

  goodListClickHandle(e) {

  },

  goodListLikeHandle(e) {

  }
});