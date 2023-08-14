Page({
  data: {
    usersList: [],
  },
  
  onLoad() {
    this.init();
  },

  init() {
    wx.stopPullDownRefresh();
    this.loadSaveList(true);
  },

  onPullDownRefresh() {
    this.init();
  },

  loadSaveList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    let followingList = wx.getStorageSync('followingList');
    if (followingList) {
      const db = wx.cloud.database();
      followingList.forEach(element => {
        db.collection('users')
        .where({
          _openid: element
        })
        .field({
          'userInfo.cloudAvatarUrl': true,
          'userInfo.nickName': true,
        })
        .get()
        .then((res) => {
          let temp = res.data[0].userInfo;
          temp.isfollowing = true;
          temp.id = element;
          this.setData({
            usersList: this.data.usersList.concat(temp)
          })
        }).catch((e) => {
          console.log("ERROR: Fail to get user");
        });
      });
    }
  },

  userClickHandle: function(e) {
    wx.navigateTo({
      url: '/pages/goods/lists/index?id=' + this.data.usersList[e.currentTarget.dataset.index].id,
    });
  },

  unfollowSeller: function(e) {
    let val = "usersList[" + e.currentTarget.dataset.index + "].isfollowing";
    this.setData({
      [val]: !this.data.usersList[e.currentTarget.dataset.index].isfollowing
    });

    let user = this.data.usersList[e.currentTarget.dataset.index];
    let followingList = wx.getStorageSync('followingList');
    if (user.isfollowing) {
      if (followingList) {
        wx.setStorageSync('followingList', followingList.concat( user.id ));
      } else {
        wx.setStorageSync('followingList', [ user.id ]);
      }
    } else {
      if (followingList) {
        wx.setStorageSync('followingList', followingList.filter(item => item !== user.id));
      }
    }
  },
})