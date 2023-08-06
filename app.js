import updateManager from './common/updateManager';

App({
  globalData: {
    openid: null,
    userInfo: {
      currAuth: 0,
      avatarUrl: null,
      nickName: null,
    },

    userInfoSub: [],
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
        // get openid
        wx.cloud.callFunction({
          name: 'getOpenId',
        }).then((res) => {
          if (res.result.openid) {
            this.globalData.openid = res.result.openid;
            wx.setStorageSync('userId', res.result.openid);
          } else {

          }
        }).catch((e) => {
          console.log("ERROR: Fail to get user id");
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
      wx.cloud.downloadFile({
        fileID: userInfo.avatarUrl, // file ID
        success: res => {
          this.globalData.userInfo.avatarUrl = res.tempFilePath;
        },
        fail: console.error
      })
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
          wx.cloud.downloadFile({
            fileID: res.data[0].userInfo.avatarUrl, // file ID
            success: res => {
              this.globalData.userInfo.avatarUrl = res.tempFilePath;
            },
            fail: console.error
          })
        } else if (res.data.length > 1) {
          console.log("CRITICAL: Duplicate users");
        }
      })
    }
  },

  setUserInfo: function(avatar, name) {
    wx.cloud.uploadFile({
      cloudPath: 'users/avatar/' + this.globalData.openid + '.jpeg', // the cloud path to upload
      filePath: avatar, // temp file path of avatar
      success: (res) => {
        let cloudUserInfo = {
          currAuth: 1,
          avatarUrl: res.fileID,
          nickName: name,
        }

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
                userInfo: cloudUserInfo
              }
            })
          } else {
            wx.cloud.database().collection('users')
            .doc(res.data[0]._id)
            .update({
              data: {
                userInfo: cloudUserInfo
              }
            })
          }
        })

        // update local userInfo
        wx.setStorageSync('userInfo', cloudUserInfo);
      },
      fail: console.error
    })

    let userInfo = {
      currAuth: 1,
      avatarUrl: avatar,
      nickName: name,
    }

    // update global userInfo
    this.globalData.userInfo = userInfo;

    this.globalData.userInfoSub.forEach(element => {
      element(userInfo);
    });
  },

  setUserInfoSub: function(method) {
    this.globalData.userInfoSub.push(method);
  },

  // createUserInfo() {
  //   wx.navigateTo({
  //     url: '/pages/usercenter/create-user',
  //   })
  // },

});
