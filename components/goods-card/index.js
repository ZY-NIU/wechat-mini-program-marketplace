Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    id: {
      type: String,
      value: '',
      observer(id) {
        this.setData({ id });
      },
    },
    data: {
      type: Object,
      observer(data) {
        if (!data) {
          return;
        }
        let lowerPrice = false;
        // if (good.goodInfo.originPrice && good.goodInfo.price && good.goodInfo.originPrice < good.goodInfo.price) {
        //   lowerPrice = true;
        // }
        if (data.goodInfo.priceSign) {
          var currency = data.goodInfo.priceSign[data.goodInfo.priceSign.length - 1];
        }
        this.setData({ good: data, lowerPrice, currency });
      },
    },
  },

  data: {
    id: '',
    good: { },
    currency: '$',
    lowerPrice: false,
  },

  methods: {
    clickHandle() {
      this.triggerEvent('click', { good: this.data.good });
    },

    saveHandle() {
      this.setData({
        'good.saved': !this.data.good.saved,
      })
      this.triggerEvent('save', { good: this.data.good });
    },
  },
});
