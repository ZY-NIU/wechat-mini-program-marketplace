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
        let isValidityLinePrice = true;
        if (data.originPrice && data.price && data.originPrice < data.price) {
          isValidityLinePrice = false;
        }
        if (data.priceSign) {
          var currency = data.priceSign[data.priceSign.length - 1];
        }
        this.setData({ goods: data, isValidityLinePrice, currency });
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
    goods: { id: '' },
    currency: '$',
    isValidityLinePrice: false,
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
      this.triggerEvent('click', { goods: this.data.goods });
    },

    editHandle() {
      this.triggerEvent('edit', { goods: this.data.goods });
    },

    addLikeHandle(e) {
      const { id } = e.currentTarget;
      const { id: cardID } = e.currentTarget.dataset;
      this.triggerEvent('add-like', {
        ...e.detail,
        id,
        cardID,
        goods: this.data.goods,
      });
    },

    init() {
    },

  },
});
