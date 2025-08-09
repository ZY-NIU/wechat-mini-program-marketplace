Page({
  data: {
    historyWords: [],
    searchValue: '',
    dialog: {
      title: '确认删除当前历史记录',
      showCancelButton: true,
      message: '',
    },
    dialogShow: false,
  },

  deleteType: 0,
  deleteIndex: '',

  onShow() {
    this.queryHistory();
  },

  queryHistory() {
    let searchHistory = wx.getStorageSync('searchHistory');
    if (searchHistory) {
      this.setData({
        historyWords: searchHistory
      })
    }
  },

  confirm() {
    const { historyWords } = this.data;
    const { deleteType, deleteIndex } = this;
    historyWords.splice(deleteIndex, 1);
    if (deleteType === 0) {
      this.setData({
        historyWords,
        dialogShow: false,
      });
      wx.setStorageSync('searchHistory', this.data.historyWords);
    } else {
      this.setData({ historyWords: [], dialogShow: false });
      wx.setStorageSync('searchHistory', []);
    }
  },

  close() {
    this.setData({ dialogShow: false });
  },

  handleClearHistory() {
    const { dialog } = this.data;
    this.deleteType = 1;
    this.setData({
      dialog: {
        ...dialog,
        message: '确认删除所有历史记录',
      },
      dialogShow: true,
    });
  },

  deleteCurr(e) {
    const { index } = e.currentTarget.dataset;
    const { dialog } = this.data;
    this.deleteIndex = index;
    this.deleteType = 0;
    this.setData({
      dialog: {
        ...dialog,
        message: '确认删除当前历史记录',
        deleteType: 0,
      },
      dialogShow: true,
    });
  },

  handleHistoryTap(e) {
    const { historyWords } = this.data;
    const { dataset } = e.currentTarget;
    const _searchValue = historyWords[dataset.index || 0] || '';
    if (_searchValue) {
      console.log(_searchValue)
      // wx.navigateTo({
      //   url: `/pages/goods/result/index?searchValue=${_searchValue}`,
      // });
    }
  },

  handleSubmit(e) {
    // if (value.length === 0) return;
    this.setData({
      historyWords: this.data.historyWords.concat(e.detail.value)
    })
    wx.setStorageSync('searchHistory', this.data.historyWords);
    // wx.navigateTo({
    //   url: `/pages/goods/result/index?searchValue=${value}`,
    // });
  },
});
