import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  data: {
    userInfo: {
      currAuth: 0,
      avatarUrl: null,
      nickName: null,
    },

    

    customerServiceInfo: {},
    showKefu: true,
    versionNo: '',
    following: 0,
    follower: 0,
    save: 0,
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    this.getVersionInfo();

    app.setUserInfoSub(this.userInfoCallback);
    if (this.data.userInfo.currAuth== 1) {
      this.getTabBar().bindNotify();
    }
  },

  onShow() {
    this.getTabBar().init(app.globalData.unread);
    this.init();
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  userInfoCallback: function(value) {
    this.setData({
      userInfo: value,
    })
    if (this.data.userInfo.currAuth== 1) {
      this.getTabBar().bindNotify();
    }
  },

  gotoUserEditPage() {
    if (this.data.userInfo.currAuth === 0) {
      let user = {
        avatar: this.data.userInfo.avatarUrl,
        name: this.data.userInfo.nickName,
      }
      user = JSON.stringify(user);
      wx.navigateTo({
        url: '/pages/usercenter/create-user/index?user=' + encodeURIComponent(user),
      })
    }
  },

  authHandle() {
    
  },

  viewMySave() {
    if (this.data.userInfo.currAuth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆查看收藏哦',
        duration: 1500,
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/usercenter/my-save/index',
    })
  },

  viewMyFollowing() {
    if (this.data.userInfo.currAuth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆查看关注哦',
        duration: 1500,
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/usercenter/my-following/index',
    })
  },

  viewMyItems() {
    if (this.data.userInfo.currAuth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆查看物品哦',
        duration: 1500,
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/selling/my-goods/index',
    })
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

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
