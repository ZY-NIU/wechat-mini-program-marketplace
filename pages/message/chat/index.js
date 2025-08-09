const app = getApp();
const utils = require('../../../utils/utils.js');

Page({

  data: {
    chatId: null,

    myInfo: {
      id: null,
      avatar: null,
    },
    otherInfo: {
      id: null,
      avatar: null,
      name: null,
    },
    
    chatList: [],
    inputValue: '',
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        otherInfo: { 
          id: options.id,
        },
        myInfo: {
          id: app.globalData.openid,
          avatar: app.globalData.userInfo.avatarUrl
        }
      });
      const db = wx.cloud.database();
      db.collection('users')
      .where({
        _openid: options.id
      })
      .get({
        success: res => {
          this.setData({
            otherInfo: {
              id: options.id,
              avatar: res.data[0].userInfo.cloudAvatarUrl,
              name: res.data[0].userInfo.nickName,
            }
          });

          wx.setNavigationBarTitle({
            title: res.data[0].userInfo.nickName
          })
        }
      })

      var that = this;
      const _ = db.command;
      db.collection("chat-record").where({
        _openid: _.or(_.eq(that.data.myInfo.id), _.eq(options.id)),
        _otherid: _.or(_.eq(that.data.myInfo.id), _.eq(options.id))
      })
      .get({
        success: res => {
          if (res.data.length != 0) {
            this.setData({
              chatId: res.data[0]._id
            })

            db.collection("chat-record").doc(res.data[0]._id)
            .watch({
              onChange: this.onChange.bind(this),
              onError(err) {
                console.log(err)
              }
            })
          }
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },

  onReady() {
    
  },

  onChange(e) {
    if (e.type == "init") {
      if (e.docs.length != 0) {
        this.initChat(e.docs[0].chatList);
      }
    } else {
      let i = this.data.chatList.length;
      const newChat = [...this.data.chatList];
      if (e.docs.length) {
        newChat.push(e.docs[0].chatList[i])
      }
      this.setData({
        chatList: newChat
      })
      this.goBottom()
    }

    // add timestamp to local storage
    let curTS = this.data.chatList[this.data.chatList.length-1].sendTimeTS;
    var chat = wx.getStorageSync('chatRecord');
    if (chat) {
      let length = chat.length;
      for (var i = 0; i < length; i++) {
        if (chat[i].id == this.data.chatId) {
          chat[i].timestamp = curTS;
          wx.setStorageSync('chatRecord', chat);
          break;
        }
        if (i == length-1) {
          let record = {
            id: this.data.chatId,
            timestamp: curTS
          }
          chat = chat.concat(record);
          wx.setStorageSync('chatRecord', chat);
        }
      }
    } else {
      let record = {
        id: this.data.chatId,
        timestamp: curTS
      }
      wx.setStorageSync('chatRecord', [record]);
    }
  },

  initChat(records) {
    this.setData({
      chatList: records
    })
    //跳转到页面底部
    this.goBottom()
  },

  sendMessage(e) {
    var textOnly = false;
    if (this.data.chatList.length != 0) {
      let lastMessage = this.data.chatList[this.data.chatList.length - 1];
      if (lastMessage.id == this.data.myInfo.id && (Date.now() - lastMessage.sendTimeTS < 300000)) {
        textOnly = true;
      }
    }
    
    const doc = {
      id: this.data.myInfo.id,
      msgType: "text",
      msgContent: e.detail.value,
      sendTime: utils.formatTime(new Date()),
      sendTimeTS: Date.now(),
      textOnly: textOnly,
    }

    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    if (this.data.chatId != null) {
      db.collection("chat-record").doc(this.data.chatId)
      .update({
        data: {
          chatList: _.push(doc)
        }
      })
      .then(res => {
        that.goBottom()
      })
    } else {
      db.collection("chat-record").add({
        data: {
          _otherid: that.data.otherInfo.id,
          chatList: [doc]
        }
      })
      .then(res => {
        this.setData({
          chatId: res._id
        })

        db.collection("chat-record").doc(res._id)
        .watch({
          onChange: this.onChange.bind(this),
          onError(err) {
            console.log(err)
          }
        })

        db.collection("chat-notify").where({
          _openid: _.or(that.data.otherInfo.id, that.data.myInfo.id)
        }).update({
          data: {
            newChat: _.inc(1)
          }
        })
      })
    }

    db.collection("chat-notify").where({
      _openid: that.data.otherInfo.id
    }).update({
      data: {
        notifyNum: _.inc(1)
      }
    })

    this.setData({
      inputValue: ""
    })
  },

  goBottom() {
    wx.createSelectorQuery().select('#chatUI').boundingClientRect(function (rect) {
      if (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.height + 4
        })
      }
    }).exec()
  },

  sendFiles() {
    let a = this;
    wx.showActionSheet({
      itemList: [ "图片", "视频" ],
      itemColor: "#666",
      success: function(e) {
        if (e.tapIndex == 0) {
          a.chooseWxMedia("image");
        } else if (e.tapIndex == 1) {
          a.chooseWxMedia("video");
        }
      }
    });
  },

  // chooseWxImage: function() {
  //   let a = this;
  //   wx.chooseImage({
  //     sizeType: [ "compressed" ],
  //     sourceType: [ 'album', 'camera'],
  //     count: 5,
  //     success: e => {
  //       var mediaOk = true;
  //       for (var i = 0; i < e.tempFiles.length; i++) {
  //         if (e.tempFiles[i].size > 2097152) {
  //           wx.showModal({
  //             title: "提示",
  //             content: "选择的图片过大，请发送不超过2M的图片",
  //             showCancel: !1,
  //             success: function(e) {
  //                 e.confirm;
  //                 mediaOk = false;
  //             }
  //           })
  //         }
  //       }
        
  //       if (mediaOk) {
  //         a.uploadMediasToCloud(e.tempFiles.tempFilePath, "image");
  //       }
  //     },
  //     fail: e => {
  //       console.log(e)
  //     }
  //   });
  // },

  chooseWxMedia: function(type) {
    let a = this;
    wx.chooseMedia({
      sizeType: [ "compressed" ],
      mediaType: [ type ],
      sourceType: [ 'album', 'camera'],
      count: type == 'image' ? 5 : 1,
      success(res) {
        var mediaOk = true;
        if (type == "image") {
          for (var i = 0; i < res.tempFiles.length; i++) {
            if (res.tempFiles[i].size > 2097152) {
              wx.showModal({
                title: "提示",
                content: "选择的图片过大，请发送不超过2M的图片",
                showCancel: !1,
                success: function(e) {
                    e.confirm;
                    mediaOk = false;
                }
              })
            }
          }
        } else {
          if (res.tempFiles[0].duration > 10) {
            wx.showModal({
              title: "提示",
              content: "选择的视频过长，请发送不超过10秒的视频",
              showCancel: !1,
              success: function(e) {
                  e.confirm;
                  mediaOk = false;
              }
            })
          }
        }
        
        if (mediaOk) {
          console.log(res)
          a.uploadMediasToCloud(res.tempFiles, type);
        }
      },
      fail(err) {
        console.log(err)
      }
    });
  },

  uploadMediasToCloud: async function(paths, type) {
    console.log(paths)
    wx.showLoading({
      title: type == 'image' ? '发送图片' : '发送视频',
      mask: true,
    });

    var time = new Date();
    var imgTime = time.toISOString().replace(/\D/g, '');

    for (var i = 0 ; i < paths.length; ++i) {
      var imgId = `${this.data.chatId}-${imgTime}-${i}`;
      let fileId = await this.uploadMediaToCloud(paths[i].tempFilePath, imgId);
      this.sendMedia(fileId, type);
    }
    wx.hideLoading();
  },

  uploadMediaToCloud: function(path, id) {
    let cloudPath = `chatImages/${id}.${path.match(/\.(\w+)$/)[1]}`;
    let filePath = path;
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath,
        success: res => {
          resolve(res.fileID);
        },
        fail: err => {
          reject(err);
        }
      })
    })
  },

  sendMedia(path, type) {
    var textOnly = false;
    if (this.data.chatList.length != 0) {
      let lastMessage = this.data.chatList[this.data.chatList.length - 1];
      if (lastMessage.id == this.data.myInfo.id && (Date.now() - lastMessage.sendTimeTS < 300000)) {
        textOnly = true;
      }
    }
    
    const doc = {
      id: this.data.myInfo.id,
      msgType: type,
      msgContent: path,
      sendTime: utils.formatTime(new Date()),
      sendTimeTS: Date.now(),
      textOnly: textOnly,
    }

    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;

    if (this.data.chatId != null) {
      db.collection("chat-record")
      .doc(that.data.chatId)
      .update({
        data: {
          chatList: _.push(doc)
        }
      })
      .then(res => {
        that.goBottom()
      })
    } else {
      db.collection("chat-record").add({
        data: {
          _otherid: that.data.otherInfo.id,
          chatList: [doc]
        }
      })
      .then(res => {
        this.setData({
          chatId: res._id
        })

        db.collection("chat-record").doc(res._id)
        .watch({
          onChange: this.onChange.bind(this),
          onError(err) {
            console.log(err)
          }
        })
      })
    }
  },

  previewImg(e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: [e.target.dataset.src]
    })
  },

  onShareAppMessage() {
    return {
      title: "刀刀 · 轻松发布管理闲置",
      path: "/pages/home/index",
      imageUrl: "/images/selling.png",
    }
  }
})