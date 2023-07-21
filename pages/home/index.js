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
        id: '88888888',
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        title: '白色短袖连衣裙',
        price: 34,
        originPrice: 35,
      },
      {
        id: '88888888',
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        title: '短袖',
        price: 3456,
        originPrice: 9999,
      },
      {
        id: '88888888',
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
        title: '白色短袖连衣裙',
        price: 4,
        originPrice: 3,
      },
      {
        id: '88888888',
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-17a.png',
        title: '白色短袖连衣裙',
        price: 4,
        originPrice: 3,
      },
      {
        id: '88888888',
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        title: '白色短袖连衣裙',
        price: 4,
        originPrice: 3,
      },
      {
        id: '88888888',
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        title: '白色短袖连衣裙',
        price: 4,
        originPrice: 3,
      },
    ]
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