Component({
  externalClasses: ['wr-class'],

  properties: {
    goodsList: {
      type: Array,
      value: [],
    },
  },

  data: {
    independentID: '',
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

    onSaveGoods(e) {
      this.triggerEvent('save', { ...e.detail.good });
    },

    init() {
      
    },
  },
});
