import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({

  data: {
    auth: 0,

    lowerPrice: false,
    currency: "$",

    navigation: { type: 'fraction' },
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,

    myGood: null,
    isfollowing: false,
    saved: null,

    isCompletePopupShow: false,

    onSold: true,
  },

  onLoad(options) {
    this.setData({
      auth: app.globalData.userInfo.currAuth
    })
    app.setUserInfoSub(this.userInfoCallback);
    if (options.id) {
      this.loadGood(options.id);
    }
  },

  userInfoCallback: function(value) {
    this.setData({
      auth: value.currAuth,
    })
  },

  loadGood(id) {
    wx.cloud.database().collection('goods')
    .doc(id)
    .get({
      success: res => {
        if (res.data._openid == app.globalData.openid) {
          this.setData({
            myGood: true,
          })
        } else {
          let saveList = wx.getStorageSync('saveList');
          let followingList = wx.getStorageSync('followingList');
          this.setData({
            myGood: false,
            saved: saveList.includes(res.data._id),
            isfollowing: followingList.includes(res.data._openid),
          });
        }
  
        let lowerPrice = false;
        let good = res.data.goodInfo;
        if (good.originPrice && good.price && good.originPrice < good.price) {
          lowerPrice = true;
        }
        if (good.priceSign) {
          var currency = good.priceSign[good.priceSign.length - 1];
        }
        this.setData({
          details: good,
          id: res.data._id,
          sellerId: res.data._openid,
          lowerPrice,
          currency
        });
      },
      fail: err => {
        this.setData({
          onSold: false
        })
      }
    })
  },

  previewImg(e) {
    wx.previewImage({
      current: this.data.details.images[e.detail.index],
      urls: this.data.details.images
    })
  },

  toSellerInfo() {
    if (!this.data.myGood) {
      wx.navigateTo({
        url: '/goods_package/pages/lists/index?id=' + this.data.sellerId,
      });
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

  toSave(e) {
    if (this.data.auth === 0) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登陆即可保存收藏哦',
        duration: 1500,
      });
      return;
    }

    this.setData({
      saved: e.detail.saved
    });
    
    // change the saved status of prev page
    let curPages = getCurrentPages();
    let prevPage = curPages[curPages.length - 2];
    if (prevPage) {
      let length = prevPage.data.goodsList.length;
      for (let i = 0; i < length; i++) {
        if (prevPage.data.goodsList[i]._id == this.data.id) {
          let val = "goodsList[" + i + "].saved";
          prevPage.setData({
            [val]: e.detail.saved
          });
          break;
        }
      }
    }

    let saveList = wx.getStorageSync('saveList');
    if (e.detail.saved) {
      if (saveList) {
        wx.setStorageSync('saveList', saveList.concat( this.data.id ));
      } else {
        wx.setStorageSync('saveList', [ this.data.id ]);
      }
    } else {
      if (saveList) {
        wx.setStorageSync('saveList', saveList.filter(item => item !== this.data.id));
      }
    }
  },

  toEdit() {
    wx.navigateTo({
      url: '/goods_package/pages/create/item/index?mode=0&id=' + this.data.id,
    })
  },

  toComplete() {
    this.setData({
      isCompletePopupShow: true,
    });
  },

  async itemSold() {
    if (this.data.id) {
      this.setData({
        isCompletePopupShow: false,
      });

      const db = wx.cloud.database();
      await db.collection('goods')
      .doc(this.data.id)
      .field({
        'goodInfo.images': true,
      })
      .get({
        success: res => {
          wx.cloud.deleteFile({
            fileList: res.data.goodInfo.images,
            fail: console.error
          })
        }
      })

      await db.collection('goods')
      .doc(this.data.id)
      .remove({
        success: res => {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '恭喜售出',
            icon: 'check',
            duration: 1000,
          });
          
        },
        fail: err => {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '操作失败',
            icon: 'close',
            duration: 1000,
          });
        }
      })

      wx.navigateBack({ delta: 1 });
    }
  },

  handlePopupHide() {
    this.setData({
      isCompletePopupShow: false,
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.details.title,
      path: '/goods_package/pages/details/index?id=' + this.data.id,
      imageUrl: '',
    }
  }
})