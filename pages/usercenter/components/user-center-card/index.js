const AuthStepType = {
  UNAUTH: 0,
  AUTH: 1,
};

Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.LOGOUT,
    },
    userInfo: {
      type: Object,
      value: {},
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    AuthStepType,
  },

  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
  },
});
