import { defaultAvatarUrl } from '../../../config/constant';

const app = getApp();

Page({

  data: {
    defaultAvatarUrl: defaultAvatarUrl,
    avatarUrl: null,
    name: null,
  },

  onLoad: function(options) {
    let user = decodeURIComponent(options.user);
    user = JSON.parse(user);
    this.setData({
      avatarUrl: user.avatar,
      name: user.name,
    })
  },

  onChooseAvatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },

  updateName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  submit(e) {
    var name = e.detail.value.name;
    if (name) {
      app.setUserInfo(this.data.avatarUrl, name);
      wx.navigateBack();
    } else {
      this.setData({
        name: null
      })
    }
  },
})