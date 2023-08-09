const app = getApp();

Page({

  data: {
    goodsList: [
      {
        id: 1,
        title: '白色短袖连衣裙发撒的发撒地方阿斯顿发送到发送的发',
        price: 34,
        originPrice: 35,
        priImg: app.globalData.cloudAvatarUrl,
        priceSign: "CAD$"
      }
    ],

    isEditPopupShow: false,
  },

  init() {
    this.loadGoodsList();
  },

  loadGoodsList() {
    const userGoodsDB = wx.cloud.database().collection('user_goods_list');
    userGoodsDB.where({
      _openid: app.globalData.openid
    })
    .get()
    .then((res) => {
      this.setData({
        goodsList: res.data[0].goods
      })
    })
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
    this.loadGoodsList();
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

  }
})