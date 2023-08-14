const app = getApp();

Page({

  data: {
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
  },

  onLoad(options) {
    if (options.id) {
      this.loadGood(options.id);
    }
  },

  loadGood(id) {
    wx.cloud.database().collection('goods')
    .where({
      _id: id
    })
    .get()
    .then(res => {
      if (res.data[0]._openid == app.globalData.openid) {
        this.setData({
          myGood: true,
        })
      } else {
        let saveList = wx.getStorageSync('saveList');
        let followingList = wx.getStorageSync('followingList');
        this.setData({
          myGood: false,
          saved: saveList.includes(res.data[0]._id),
          isfollowing: followingList.includes(res.data[0]._openid),
        });
      }

      let lowerPrice = false;
      let good = res.data[0].goodInfo;
      if (good.originPrice && good.price && good.originPrice < good.price) {
        lowerPrice = true;
      }
      if (good.priceSign) {
        var currency = good.priceSign[good.priceSign.length - 1];
      }
      this.setData({
        details: good,
        id: res.data[0]._id,
        sellerId: res.data[0]._openid,
        lowerPrice,
        currency
      });
    })
  },

  toSellerInfo() {
    if (!this.data.myGood) {
      wx.navigateTo({
        url: '/pages/goods/lists/index?id=' + this.data.sellerId,
      });
    }
  },

  followSeller() {
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
    console.log('chat')
  },

  toShare() {
    console.log('share')
  },

  toSave(e) {
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
    console.log('edit')
  },

  toComplete() {
    console.log('complete')
  }
})