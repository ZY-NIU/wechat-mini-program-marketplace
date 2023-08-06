import { defaultAvatarUrl, defaultName } from '../../../../config/constant';

Component({

  properties: {
    userInfo: {
      type: Object,
      value: {},
    },
  },

  data: {
    defaultAvatarUrl: defaultAvatarUrl,
    defaultName: defaultName,
  },

  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
  },
});
