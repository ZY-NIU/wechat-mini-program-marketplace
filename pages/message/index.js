// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [
      {
        userAvatar: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
        username: "的发顺丰",
        record: [
          {
            text: "aaaaa",
            time: "1/7",
          }
        ]
      },
      {
        userAvatar: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
        username: "阿斯顿发",
        record: [
          {
            text: "hello啊的撒发阿斯顿发阿斯顿发阿斯顿发撒地方撒地方撒地方撒地方四大发",
            time: "11/12",
          }
        ]
      },
      {
        userAvatar: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
        username: "啊撒",
        record: [
          {
            text: "你好呀",
            time: "15:12",
          }
        ]
      },
      {
        userAvatar: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
        username: "Zeyu",
        record: [
          {
            text: "还在出吗",
            time: "13:10",
          }
        ]
      },
      {
        userAvatar: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
        username: "Zeyu",
        record: [
          {
            text: "aaaaa",
            time: "11/7",
          },
          {
            text: "aaaaa",
            time: "11/7",
          },
          {
            text: "还好",
            time: "11/7",
          },
          {
            text: "出完了吗",
            time: "11/7",
          }
        ]
      }
    ],
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
    this.getTabBar().init();
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