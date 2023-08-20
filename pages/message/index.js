const app = getApp();

const db = wx.cloud.database();

Page({

  data: {
    openid: app.globalData.openid,
    auth: app.globalData.userInfo.currAuth,
    userList: [],
  },

  onLoad() {
    app.setUserInfoSub(this.userInfoCallback);

    if (this.data.auth == 1) {
      this.bindNotify();
    }
  },

  userInfoCallback: function(value) {
    this.setData({
      auth: value.currAuth,
    })
    if (this.data.auth == 1) {
      this.bindNotify();
    }
  },

  bindNotify() {
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
    var that = this;
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
          if (e.type == "init") {
            res.data.forEach(chat => {
              this.addChat(chat._id, chat._openid, chat._otherid);
            })
          } else if ("newChat" in e.docChanges[0].updatedFields) {
            let l = that.data.userList.length;
            res.data.forEach(chat => {
              var exist = false;
              for (var i = 0; i < l; i++) {
                if (chat._id == that.data.userList[i].chatid) {
                  exist = true;
                  break;
                }
              }
              if (!exist) {
                this.addChat(chat._id, chat._openid, chat._otherid);
              }
            })
          }
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  addChat(chatid, openid, otherid) {
    var that = this;
    db.collection('users')
    .where({
      _openid: openid == that.data.openid ? otherid : openid
    })
    .get({
      success: res => {
        var user = {
          chatid: chatid,
          userInfo: {
            id: res.data[0]._openid,
            avatar: res.data[0].userInfo.cloudAvatarUrl,
            name: res.data[0].userInfo.nickName,
          }
        }
        that.setData({
          userList: that.data.userList.concat(user)
        })

        db.collection("chat-record").doc(chatid)
        .watch({
          onChange: this.onChange.bind(this),
          onError(err) {
            console.log(err)
          }
        })
      }
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
                }
                break;
              }
              if (j == length-1) {
                unread = true;
                let record = {
                  id: e.docs[0]._id,
                  timestamp: chatInfo.sendTimeTS - 1
                }
                chat = chat.concat(record);
                wx.setStorageSync('chatRecord', chat);
              }
            }
          } else {
            unread = true;
            let record = {
              id: e.docs[0]._id,
              timestamp: chatInfo.sendTimeTS - 1
            }
            wx.setStorageSync('chatRecord', [record]);
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
    app.globalData.unread = false;
    db.collection('chat-notify').where({
      _openid: app.globalData.openid
    })
    .get()
    .then(res => {
      wx.setStorageSync('notifyNum', res.data[0].notifyNum);
    })
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