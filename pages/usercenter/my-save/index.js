Page({
  data: {
    goodsList: [],
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

    let saveList = wx.getStorageSync('saveList');
    if (saveList) {
      const db = wx.cloud.database();
      saveList.forEach(element => {
        db.collection('goods')
        .doc(element)
        .field({
          'goodInfo.priImg': true,
          'goodInfo.priceSign': true,
          'goodInfo.originPrice': true,
          'goodInfo.price': true,
          'goodInfo.title': true,
        })
        .get()
        .then((res) => {
          let temp = res.data;
          temp.saved = true;
          this.setData({
            goodsList: this.data.goodsList.concat(temp)
          })
        }).catch((e) => {
          console.log("ERROR: Fail to get items");
        });
      });
    }
  },

  goodListClickHandle: function(e) {
    wx.navigateTo({
      url: '/pages/goods/details/index?id=' + e.detail._id,
    })
  },

  goodListSaveHandle: function(e) {
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
})