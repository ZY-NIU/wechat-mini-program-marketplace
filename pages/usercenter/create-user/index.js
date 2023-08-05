import { defaultAvatarUrl } from '../../../config/constant';

const app = getApp();

Page({

  data: {
    defaultAvatarUrl: defaultAvatarUrl,
    avatarUrl: null,
    name: null,
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

  onShareAppMessage() {

  }
})