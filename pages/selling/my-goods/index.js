import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({

  data: {
    goodsList: [],
    goodsListLoadStatus: 0,

    pageSize: 10,
    pageIdx: 0,

    isEditPopupShow: false,

    curGoodId: null,

    screenShot: false,
  },

  onLoad() {
    this.init();
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
        _openid: app.globalData.openid
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
          this.setData({
            goodsList: fresh ? res.data : this.data.goodsList.concat(res.data),
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

  gotoCreateItemPage() {
    wx.navigateTo({
      url: '/goods_package/pages/create/item/index?mode=1',
    })
  },

  goodListClickHandle: function(e) {
    wx.navigateTo({
      url: '/goods_package/pages/details/index?id=' + e.detail._id,
    })
  },

  editGoods: function(e) {
    this.setData({
      isEditPopupShow: true,
      curGoodId: e.detail._id,
    });
  },

  editGoodPage() {
    wx.navigateTo({
      url: '/goods_package/pages/create/item/index?mode=0&id=' + this.data.curGoodId,
    })
  },

  async itemSold() {
    if (this.data.curGoodId) {
      const db = wx.cloud.database();
      await db.collection('goods')
      .doc(this.data.curGoodId)
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
      .doc(this.data.curGoodId)
      .remove({
        success: res => {
          this.setData({
            isEditPopupShow: false,
          });
          Toast({
            context: this,
            selector: '#t-toast',
            message: '恭喜售出',
            icon: 'check',
            duration: 1000,
          });
        },
        fail: res => {
          this.setData({
            isEditPopupShow: false,
          });
          Toast({
            context: this,
            selector: '#t-toast',
            message: '操作失败',
            icon: 'close',
            duration: 1000,
          });
        }
      })
    }
  },

  handlePopupHide() {
    this.setData({
      isEditPopupShow: false,
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
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
      path: '/goods_package/pages/lists/index?id=' + app.globalData.openid,
      imageUrl: image,
    }
  }
})