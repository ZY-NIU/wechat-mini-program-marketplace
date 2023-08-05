import updateManager from './common/updateManager';

App({
  globalData: {
    openid: null,
    currAuth: 0,
    userInfo: {
      avatarUrl: null,
      nickName: null,
    },
  },

  onLaunch: function () {
    wx.cloud.init({
      env: 'YOUR_CLOUDBASE_ENV_ID'
    })

    // get openId
    this.getOpenId();
    // get userInfo
    this.getUserInfo();
  },

  onShow: function () {
    updateManager();
  },

  getOpenId() {
    try {
      // get open id from local storage
      var id = wx.getStorageSync('userId');
      if (id) {
        this.globalData.openid = id;
      } else {
        // get open id using api from cloud
        wx.showLoading({
          title: '登陆中',
        });

        // get openid
        wx.cloud.callFunction({
          name: 'getOpenId',
        }).then((res) => {
          if (res.result.openid) {
            this.globalData.openid = res.result.openid;
            wx.setStorageSync('userId', res.result.openid);
          } else {

          }
          wx.hideLoading();
        }).catch((e) => {
          console.log("ERROR: Fail to get user id");
          wx.hideLoading();
        });
      }
    } catch (e) {
      console.log("ERROR: Fail to login");
    }
  },

  getUserInfo() {
    // get user info from local storage
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.currAuth = 1;
    } else {
      // get user info from cloud
      wx.cloud.database().collection('users')
      .where({
        _openid: this.globalData.openid
      })
      .get()
      .then((res) => {
        if (res.data.length == 1) {
          this.globalData.userInfo = res.data[0].userInfo;
          wx.setStorageSync('userInfo', res.data[0].userInfo);
          this.globalData.currAuth = 1;
        } else if (res.data.length > 1) {
          console.log("CRITICAL: Duplicate users");
        }
      })
    }
  },

  setUserInfo: function(avatar, name) {
    // update global userInfo
    this.globalData.userInfo.avatarUrl = avatar;
    this.globalData.userInfo.nickName = name;

    // update local userInfo
    wx.setStorageSync('userInfo', this.globalData.userInfo)

    // update cloud userInfo
    wx.cloud.database().collection('users')
    .where({
      _openid: this.globalData.openid
    })
    .get()
    .then((res) => {
      if (res.data.length == 0) {
        wx.cloud.database().collection('users')
        .add({
          data: {
            userInfo: {
              avatarUrl: avatar,
              nickName: name,
            }
          }
        })
      } else {
        wx.cloud.database().collection('users')
        .doc(res.data[0]._id)
        .update({
          data: {
            userInfo: {
              avatarUrl: avatar,
              nickName: name,
            }
          }
        })
      }
      this.globalData.currAuth = 1;
    })
  },

  createUserInfo() {
    wx.navigateTo({
      url: '/pages/usercenter/create-user',
    })
  },

});
