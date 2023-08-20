const app = getApp();

Page({

  data: {
    openid: app.globalData.openid,
    auth: app.globalData.userInfo.currAuth,
    userList: [],
  },

  onLoad() {
    var that = this;

    app.setUserInfoSub(this.userInfoCallback);

    const db = wx.cloud.database();
    const _ = db.command;
    db.collection("chat-record").where(
      _.or([
        {
          _openid: app.globalData.openid,
        },
        {
          _otherid: app.globalData.openid,
        }
      ])
    ).get({
      success: res => {
        if (res.data.length != 0) {
          res.data.forEach(chat => {
            // create a new database and listen to that to see if there is new message
            db.collection('users')
            .where({
              _openid: chat._openid == that.data.openid ? chat._otherid : chat._openid
            })
            .get({
              success: res => {
                var user = {
                  chatid: chat._id,
                  userInfo: {
                    id: res.data[0]._openid,
                    avatar: res.data[0].userInfo.cloudAvatarUrl,
                    name: res.data[0].userInfo.nickName,
                  }
                }
                that.setData({
                  userList: that.data.userList.concat(user)
                })

                db.collection("chat-record").doc(chat._id)
                .watch({
                  onChange: this.onChange.bind(this),
                  onError(err) {
                    console.log(err)
                  }
                })
              }
            })
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  userInfoCallback: function(value) {
    this.setData({
      auth: value.currAuth,
    })
  },

  onChange(e) {
    let length = this.data.userList.length;
    for (var i = 0; i < length; i++) {
      if (this.data.userList[i].chatid == e.docs[0]._id) {
        let chatInfo = e.docs[0].chatList[e.docs[0].chatList.length-1];

        var unread = false;
        if (chatInfo.id != this.data.openid) {
          var chat = wx.getStorageSync('chatRecord');
          if (chat) {
            let length = chat.length;
            for (var j = 0; j < length; j++) {
              if (chat[j].id == e.docs[0]._id) {
                if (chat[j].timestamp < chatInfo.sendTimeTS) {
                  unread = true;
                  break;
                }
              }
            }
          }
        }
        
        let msgContent = "userList[" + i + "].msgContent";
        let sendTime = "userList[" + i + "].sendTime";
        let sendTimeTS = "userList[" + i + "].sendTimeTS";
        let readRecord = "userList[" + i + "].unread";
        let content = chatInfo.msgType == "text" ? chatInfo.msgContent : ("[" + chatInfo.msgType + "]");
        this.setData({
          [msgContent]: content,
          [sendTime]: this.formatDate(chatInfo.sendTime),
          [sendTimeTS]: chatInfo.sendTimeTS,
          [readRecord]: unread
        })

        break;
      }
    }
  },

  startChat(e) {
    let user = this.data.userList[e.currentTarget.dataset.index];
    let readRecord = "userList[" + e.currentTarget.dataset.index + "].unread";
    this.setData({
      [readRecord]: false
    })
    wx.navigateTo({
      url: '/pages/message/chat/index?id=' + user.userInfo.id,
    })
  },

  formatDate(inputStr) {
    const weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    
    // Parse the input string to a Date object
    const inputDate = new Date(inputStr);
    
    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // reset time to midnight for accurate comparison

    // Check if the input date is "today"
    if (inputDate.toDateString() === currentDate.toDateString()) {
        const timeParts = inputStr.split(' ')[1].split(':');
        return `${timeParts[0]}:${timeParts[1]}`; // Return only HH:MM
    }

    // Check if the input date is within this week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    if (inputDate >= startOfWeek && inputDate <= endOfWeek) {
        return weekdays[inputDate.getDay()];
    }

    // If neither today nor this week, return the month and day
    const dateParts = inputStr.split(' ')[0].split('/');
    return `${dateParts[1]}-${dateParts[2]}`;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})