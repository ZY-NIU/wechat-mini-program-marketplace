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
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { ...e.detail, index });
    },

    onEditGoods(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('edit', { ...e.detail, index });
    },

    init() {

    }
  },
});
