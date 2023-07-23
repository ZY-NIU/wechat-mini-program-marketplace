Component({
  externalClasses: ['wr-class'],

  data: { },

  methods: {
    toChat() {
      this.triggerEvent('toChat');
    },

    toShare(e) {
      this.triggerEvent('toShare', e);
    },

    toSave(e) {

    },
  },
});
