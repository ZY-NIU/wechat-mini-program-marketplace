Component({
  externalClasses: ['wr-class'],

  data: {
    myGood: null,
    hasIcon: null,
    saved: null,
  },

  properties: {
    myGood: {
      type: Boolean,
      observer(myGood) {
        this.setData({ myGood });
      },
    },
    hasRightIcon: {
      type: Boolean,
      observer(hasRightIcon) {
        this.setData({ hasIcon: hasRightIcon });
      },
    },
    saved: {
      type: Boolean,
      observer(saved) {
        this.setData({ saved });
      },
    },
  },

  methods: {
    tapOne() {
      if (this.data.myGood) {
        this.triggerEvent('toEdit');
      } else {
        this.triggerEvent('toChat');
      }
    },

    tapTwo(e) {
      this.triggerEvent('toShare', e);
    },

    tapThree(e) {
      if (this.data.myGood) {
        this.triggerEvent('toComplete');
      } else {
        this.setData({
          saved: !this.data.saved,
        })
        this.triggerEvent('toSave', { saved: this.data.saved });
      }
    },
  },
});
