import TabMenu from './data';

const app = getApp();

Component({
  data: {
    active: 0,
    list: TabMenu,

    unread: false,
  },

  methods: {
    onChange(event) {
      this.setData({ active: event.detail.value });
      wx.switchTab({
        url: this.data.list[event.detail.value].url.startsWith('/')
          ? this.data.list[event.detail.value].url
          : `/${this.data.list[event.detail.value].url}`,
      });
    },

    init(unread) {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) =>
          (item.url.startsWith('/') ? item.url.substr(1) : item.url) ===
          `${route}`,
      );
      this.setData({ active, unread });
    },

    bindNotify() {
      const db = wx.cloud.database();
      db.collection("chat-notify").where({
        _openid: app.globalData.openid
      })
      .watch({
        onChange: this.newMessage.bind(this),
        onError(err) {
          console.log(err)
        }
      })
    },

    newMessage(e) {
      if (e.type == "init") {
        let count = wx.getStorageSync('notifyNum');
        if (count) {
          if (count < e.docs[0].notifyNum) {
            wx.setStorageSync('notifyNum', e.docs[0].notifyNum);
            this.setUnread();
          }
        } else {
          wx.setStorageSync('notifyNum', e.docs[0].notifyNum);
          this.setUnread();
        }
      } else {
        this.setUnread()
      }
    },

    setUnread() {
      this.setData({
        unread: true
      })
      app.globalData.unread = true
    }
  },
});
