import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  data: {
    isMy: false,

    auth: 0,

    sellerId: null,
    sellerAvatar: null,
    sellerName: '',
    
    goodsList: [],
    goodsListLoadStatus: 0,

    isfollowing: false,

    pageSize: 10,
    pageIdx: 0,

    screenShot: false
  },
  
  onLoad(options) {
    this.setData({
      auth: app.globalData.userInfo.currAuth
    })
    app.setUserInfoSub(this.userInfoCallback);

    if (options.id == app.globalData.openid) {
      this.setData({
        isMy: true,
      })
    }

    this.setData({
      sellerId: options.id
    })
    const db = wx.cloud.database();
    db.collection('users')
    .where({
      _openid: this.data.sellerId
    })
    .get()
    .then((res) => {
      let followingList = wx.getStorageSync('followingList');

      this.setData({
        sellerAvatar: res.data[0].userInfo.cloudAvatarUrl,
        sellerName: res.data[0].userInfo.nickName,
        isfollowing: followingList.includes(options.id)
      });
    })

    this.init();
  },

  userInfoCallback: function(value) {
    this.setData({
      auth: value.currAuth,
    })
  },

  onShow() {
    this.setData({
      pageIdx: 0,
    })
    this.init();
  },

  init() {
    wx.stopPullDownRefresh();
    this.loadGoodsList(true);
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.data.pageSize;
    const pageIdx = this.data.pageIdx;

    try {
      const db = wx.cloud.database();
      await db.collection('goods')
      .where({
        _openid: this.data.sellerId
      })
      .orderBy('time', 'desc')
      .skip(pageIdx * pageSize)
      .limit(pageSize)
      .field({
        _id: true,
        'goodInfo.priImg': true,
        'goodInfo.priceSign': true,
        'goodInfo.originPrice': true,
        'goodInfo.price': true,
        'goodInfo.title': true,
      })
      .get()
      .then((res) => {
        if (res.data.length == 0) {
          this.setData({ 
            goodsListLoadStatus: 2,
            pageIdx: 0,
          });
        } else {
          let saveList = wx.getStorageSync('saveList');
          let tempGood = res.data;
          tempGood.forEach(element => {
            if (saveList.includes(element._id)) {
              element.saved = true;
            } else {
              element.saved = false;
            }
          });

          this.setData({
            goodsList: fresh ? tempGood : this.data.goodsList.concat(tempGood),
            goodsListLoadStatus: 0,
            pageIdx: this.data.pageIdx + 1
          });
        }
      }).catch((e) => {
        console.log("ERROR: Fail to get items");
      });

    } catch (err) {
      this.setData({ goodsListLoadStatus: 3 });
    }
  },

  goodListClickHandle: function(e) {
    wx.navigateTo({
      url: '/goods_package/pages/details/index?id=' + e.detail._id,
    })
  },

  goodListSaveHandle: function(e) {
    if (this.data.auth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆即可保存收藏哦',
        duration: 1500,
      });
      return;
    }

    let length = this.data.goodsList.length;
    for (let i = 0; i < length; i++) {
      if (this.data.goodsList[i]._id == e.detail._id) {
        let val = "goodsList[" + i + "].saved";
        this.setData({
          [val]: e.detail.saved
        });
        break;
      }
    }

    let saveList = wx.getStorageSync('saveList');
    if (e.detail.saved) {
      if (saveList) {
        wx.setStorageSync('saveList', saveList.concat( e.detail._id ));
      } else {
        wx.setStorageSync('saveList', [ e.detail._id ]);
      }
    } else {
      if (saveList) {
        wx.setStorageSync('saveList', saveList.filter(item => item !== e.detail._id));
      }
    }
  },

  followSeller() {
    if (this.data.auth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆体验更多功能哦',
        duration: 1500,
      });
      return;
    }

    let followingList = wx.getStorageSync('followingList');
    this.setData({
      isfollowing: !this.data.isfollowing,
    });

    if (this.data.isfollowing) {
      if (followingList) {
        wx.setStorageSync('followingList', followingList.concat( this.data.sellerId ));
      } else {
        wx.setStorageSync('followingList', [ this.data.sellerId ]);
      }
    } else {
      if (followingList) {
        wx.setStorageSync('followingList', followingList.filter(item => item !== this.data.sellerId));
      }
    }
  },

  toChat() {
    if (this.data.auth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆体验更多功能哦',
        duration: 1500,
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/message/chat/index?id=' + this.data.sellerId,
    })
  },

  toShare() {
    if (this.data.auth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆体验更多功能哦',
        duration: 1500,
      });
      return;
    }

    this.onShareAppMessage();
  },

  onShareAppMessage() {
    var title = '';
    var image = '';
    if (this.data.goodsList.length == 0) {
      title = '闲置';
      image = '/images/share.png'
    } else {
      this.data.goodsList.forEach(e => {
        title += ' · ';
        title += e.goodInfo.title;
      })
      this.setData({
        screenShot: true
      })
      setTimeout(() => {
        this.setData({
          screenShot: false
        })
      }, 1000);
    }
    
    return {
      title: "出" + title,
      path: '/goods_package/pages/lists/index?id=' + this.data.sellerId,
      imageUrl: image,
    }
  }
})