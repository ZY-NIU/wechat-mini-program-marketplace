const getDefaultData = () => ({
  
});

Page({
  data: {
    showMakePhone: false,
    userInfo: {
      avatarUrl: '',
      nickName: '正在登录...',
      phoneNumber: '',
    },
    // menuData,
    // orderTagInfos,
    customerServiceInfo: {},
    currAuthStep: 1,
    showKefu: true,
    versionNo: '',
    following: 0,
    follower: 0,
    save: 0,
  },

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
    // fetchUserCenter().then(
    //   ({
    //     userInfo,
    //     countsData,
    //     orderTagInfos: orderInfo,
    //     customerServiceInfo,
    //   }) => {
    //     // eslint-disable-next-line no-unused-expressions
    //     menuData?.[0].forEach((v) => {
    //       countsData.forEach((counts) => {
    //         if (counts.type === v.type) {
    //           // eslint-disable-next-line no-param-reassign
    //           v.tit = counts.num;
    //         }
    //       });
    //     });
    //     const info = orderTagInfos.map((v, index) => ({
    //       ...v,
    //       ...orderInfo[index],
    //     }));
    //     this.setData({
    //       userInfo,
    //       menuData,
    //       orderTagInfos: info,
    //       customerServiceInfo,
    //       currAuthStep: 2,
    //     });
    //     wx.stopPullDownRefresh();
    //   },
    // );
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({ url: '/pages/usercenter/address/list/index' });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    // if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/usercenter/person-info/index' });
    // } else {
    //   this.fetUseriInfoHandle();
    // }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
