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
        // if (data.originPrice && data.price && data.originPrice < data.price) {
        //   lowerPrice = true;
        // }
        if (data.goodInfo.priceSign) {
          var currency = data.goodInfo.priceSign[data.goodInfo.priceSign.length - 1];
        }
        this.setData({ good: data, lowerPrice, currency });
      },
    },
    icon: {
      type: String,
      value: '',
      observer(icon) {
        this.setData({ icon });
      },
    },
  },

  data: {
    id: '',
    good: { id: '' },
    currency: '$',
    lowerPrice: false,
    icon: 'star',
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },

  pageLifeTimes: {},

  methods: {
    clickHandle() {
      this.triggerEvent('click', { good: this.data.good });
    },

    editHandle() {
      if (this.data.icon === 'star') {
        this.setData({
          'good.saved': !this.data.good.saved,
        })
      }
      this.triggerEvent('edit', { good: this.data.good });
    },

    init() {
    },

  },
});
