Page({

  data: {
    goodsList: [
      {
        id: 1,
        title: '白色短袖连衣裙发撒的发撒地方阿斯顿发送到发送的发',
        price: 34,
        originPrice: 35,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        priceSign: "CAD$"
      },
      {
        id: 2,
        title: '短袖',
        price: 3456,
        originPrice: 9999,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        priceSign: "CNY¥"
      },
      {
        id: 3,
        title: '棋',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
        priceSign: "CAD$"
      },
      {
        id: 4,
        title: '5个碗，6个锅',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-17a.png',
        priceSign: "CAD$"
      },
      {
        id: 5,
        title: 'personal computer, mouse',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        priceSign: "CAD$"
      },
      {
        id: 6,
        title: '洗衣机，烘干机，衣服，裤子',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        priceSign: "CAD$"
      },
      {
        id: 11,
        title: '白色短袖连衣裙发撒的发撒地方阿斯顿发送到发送的发',
        price: 34,
        originPrice: 35,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        priceSign: "CAD$"
      },
      {
        id: 21,
        title: '短袖',
        price: 3456,
        originPrice: 9999,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        priceSign: "CAD$"
      },
      {
        id: 31,
        title: '棋',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
        priceSign: "CAD$"
      },
      {
        id: 41,
        title: '5个碗，6个锅',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-17a.png',
        priceSign: "CAD$"
      },
      {
        id: 51,
        title: 'personal computer, mouse',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        priceSign: "CAD$"
      },
      {
        id: 61,
        title: '洗衣机，烘干机，衣服，裤子asdfasdf大神发四大发阿斯顿发撒地方撒地方撒地方撒地方阿斯顿发阿斯顿发阿斯顿发四大发阿斯顿发阿斯顿发撒地方四大发撒地方撒地方撒的发撒的发撒的发达',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        priceSign: "CAD$"
      },
    ],

    isEditPopupShow: false,
  },

  gotoCreateItemPage() {
    wx.navigateTo({
      url: '/pages/goods/create/item/index?mode=1',
    })
  },

  goodListClickHandle: function(e) {
    console.log(e)
  },

  editGoods: function(e) {
    this.setData({
      isEditPopupShow: true,
    });
  },

  handlePopupHide() {
    this.setData({
      isEditPopupShow: false,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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

  }
})