import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  data: {
    userInfo: {
      currAuth: 0,
      avatarUrl: null,
      nickName: null,
    },

    following: 0,
    follower: 0,
    save: 0,

    versionNo: '',
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

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },

  onShareAppMessage() {
    return {
      title: "刀刀 · 轻松发布管理闲置",
      path: "/pages/home/index",
      imageUrl: "/images/logo_dao.png",
    }
  }
});
