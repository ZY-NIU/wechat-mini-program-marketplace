import Toast from 'tdesign-miniprogram/toast/index';

import { defaultAvatarUrl } from '../../config/constant';

const app = getApp();

Page({

  data: {
    userInfo: {
      currAuth: 0,
      avatarUrl: null,
      nickName: null,
    },
  
    isCreateTradePopupShow: false,

    defaultAvatarUrl: defaultAvatarUrl,
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });

    app.setUserInfoSub(this.userInfoCallback);
  },

  onShow() {
    this.getTabBar().init();
  },

  userInfoCallback: function(value) {
    this.setData({
      userInfo: value,
    })
  },

  tapAvatar() {
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

  createTrade(e) {
    this.setData({
      isCreateTradePopupShow: true,
    });
  },

  handlePopupHide() {
    this.setData({
      isCreateTradePopupShow: false,
    });
  },

  gotoCreateItemPage() {
    wx.navigateTo({
      url: '/pages/goods/create/item/index?mode=1',
    })
  },

  viewMyItems() {
    wx.navigateTo({
      url: '/pages/selling/my-goods/index',
    })
  }

})