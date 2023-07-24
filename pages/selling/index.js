Page({

  data: {
    userHeadUrl: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
  
    isCreateTradePopupShow: false,
  },

  createTrade(e) {
    this.setData({
      isCreateTradePopupShow: true,
    });
  },

  handlePopupHide() {
    this.setData({
      isCreateTradePopupShow: false,
    });
  },

})