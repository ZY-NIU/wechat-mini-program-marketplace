import updateManager from './common/updateManager';

App({
  globalData: {
    openid: null,
    userInfo: {
      currAuth: 0,
      avatarUrl: null,
      nickName: null,
      cloudAvatarUrl: null,
    },

    unread: false,

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
          wx.cloud.downloadFile({
            fileID: res.data[0].userInfo.cloudAvatarUrl, // file ID
            success: res => {
              var fs = wx.getFileSystemManager();
              fs.saveFile({
                tempFilePath: res.tempFilePath, // 传入一个本地临时文件路径
                success: res => {
                  this.globalData.userInfo.avatarUrl = res.savedFilePath; // res.savedFilePath 为一个本地缓存文件路径
                  wx.setStorageSync('userInfo', this.globalData.userInfo);
                }
              })
            },
            fail: console.error
          })
        } else if (res.data.length > 1) {
          console.error("CRITICAL: Duplicate users");
        }
      })
    }
  },

  setUserInfo: function(avatar, name) {
    var fs = wx.getFileSystemManager();
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      if (userInfo.avatarUrl == avatar && userInfo.nickName == name) {
        this.globalData.userInfoSub.forEach(element => {
          element(this.globalData.userInfo);
        });
        return
      } else if (userInfo.avatarUrl == avatar) {
        // update global userInfo
        this.globalData.userInfo.nickName = name;
        // update local userInfo
        wx.setStorageSync('userInfo', this.globalData.userInfo);
        // update cloud userInfo
        wx.cloud.database().collection('users')
        .where({
          _openid: this.globalData.openid
        })
        .update({
          data: {
            'userInfo.nickName': name
          }
        })
        this.globalData.userInfoSub.forEach(element => {
          element(this.globalData.userInfo);
        });
        return
      } else {
        fs.removeSavedFile({
          filePath: userInfo.avatarUrl
        })
      }
    }

    fs.saveFile({
      tempFilePath: avatar, // 传入一个本地临时文件路径
      success: res => {
        let userInfo = {
          currAuth: 1,
          avatarUrl: res.savedFilePath,
          nickName: name,
        }

        this.globalData.userInfoSub.forEach(element => {
          element(userInfo);
        });

        wx.cloud.uploadFile({
          cloudPath: `users/avatar/${this.globalData.openid}.${avatar.match(/\.(\w+)$/)[1]}`, // the cloud path to upload
          filePath: res.savedFilePath, // stored file path of avatar
          success: (res) => {
            userInfo.cloudAvatarUrl = res.fileID;
            // update global userInfo
            this.globalData.userInfo = userInfo;
            // update local userInfo
            wx.setStorageSync('userInfo', userInfo);

            let cloudUserInfo = {
              currAuth: 1,
              cloudAvatarUrl: res.fileID,
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
                    userInfo: cloudUserInfo,
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

            // set chat notification
            wx.cloud.database().collection('chat-notify')
            .where({
              _openid: this.globalData.openid
            })
            .get()
            .then((res) => {
              if (res.data.length == 0) {
                wx.cloud.database().collection('chat-notify')
                .add({
                  data: {
                    notifyNum: 0,
                    newChat: 0,
                  }
                })
              }
            })

            wx.hideLoading();
    
            // this.globalData.userInfo.cloudAvatarUrl = res.fileID;
          },
          fail: console.error
        })
      }
    })


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
