Component({
  externalClasses: ['wr-class'],

  properties: {
    goodsList: {
      type: Array,
      value: [],
    },
    icon: {
      type: String,
      value: '',
    },
  },

  data: {

  },

  lifetimes: {
    ready() {
      this.init();
    },
  },

  methods: {
    onClickGoods(e) {
      this.triggerEvent('click', { ...e.detail.good });
    },

    onEditGoods(e) {
      this.triggerEvent('edit', { ...e.detail.good });
    },

    init() {

    }
  },
});
