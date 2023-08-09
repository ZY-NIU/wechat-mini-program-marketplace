import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  // TODO: check message and images legal
  data: {
    imagesPath: [],
    cloudImagesPath: [],
    addImages: true,
    titleFocus: false,
    priceFocus: false,
    descriptionFocus: false,
    priceSignIndex: 0,
    priceSignArray: ['CAD$', 'CNY¥'],
    condIndex: 4,
    condArray: ['全新', '二手 · 99新', '二手 · 微瑕', '二手 · 良好', '二手'],
    locationIndex: 0,
    locationArray: ['Waterloo'],

    submitTitle: "发布",
  },

  onLoad(options) {
    if (options.mode == 0) {
      this.setData({
        submitTitle: "保存",
      })
    } else {
      this.setData({
        submitTitle: "发布",
      })
    }
  },

  uploadImages: function() {
    let a = this;
    wx.showActionSheet({
      itemList: [ "从相册中选择", "拍照" ],
      itemColor: "#666",
      success: function(e) {
        if (e.tapIndex == 0) {
          a.chooseWxImage("album");
        } else if (e.tapIndex == 1) {
          a.chooseWxImage("camera");
        }
      }
    });
  },

  chooseWxImage: function(type) {
    let a = this;
    wx.chooseImage({
      sizeType: [ "compressed" ],
      sourceType: [ type ],
      count: 9 - a.data.imagesPath.length,
      success: function(e) {
        var imageOk = true;
        for (var i = 0; i < e.tempFiles.length; i++) {
          if (e.tempFiles[i].size > 2097152) {
            wx.showModal({
              title: "提示",
              content: "选择的图片过大，请上传不超过2M的图片",
              showCancel: !1,
              success: function(e) {
                  e.confirm;
                  imageOk = false;
              }
            })
          }
        }
        
        if (imageOk) {
          a.setData({
            imagesPath: a.data.imagesPath.concat(e.tempFilePaths),
          });

          if (a.data.imagesPath.length >= 9) {
            a.setData({
              addImages: false,
            });
          }
        }
      }
    });
  },

  deleteImage: function(e) {
    var imgsPath = this.data.imagesPath;
    var index = e.currentTarget.dataset.index;
    imgsPath.splice(index, 1);
    this.setData({
      imagesPath: imgsPath,
      addImages: true
    });
  },

  // for showing info in wxml
  hasTitle(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        titleFocus: true,
      });
    } else {
      this.setData({
        titleFocus: false,
      });
    }
  },
  hasPrice(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        priceFocus: true,
      });
    } else {
      this.setData({
        priceFocus: false,
      });
    }
  },
  hasDescription(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        descriptionFocus: true,
      });
    } else {
      this.setData({
        descriptionFocus: false,
      });
    }
  },
  bindCondPickerChange: function(e) {
    this.setData({
      condIndex: e.detail.value
    })
  },
  bindPriceSignPickerChange: function(e) {
    this.setData({
      priceSignIndex: e.detail.value
    })
  },
  bindLocationPickerChange: function(e) {
    this.setData({
      locationIndex: e.detail.value
    })
  },

  submit(e) {
    var tmpPrice = e.detail.value.price ? Number(e.detail.value.price) : null
    let item = {
      onSale: true,
      userInfo: null,
      title: e.detail.value.title,
      priceSign: this.data.priceSignArray[this.data.priceSignIndex],
      price: tmpPrice,
      originPrice: tmpPrice,
      description: e.detail.value.description,
      attributes: [
        {
          attribute: "商品成色",
          value: this.data.condArray[this.data.condIndex],
        },
      ],
      location: this.data.locationArray[this.data.locationIndex],
      deliver: e.detail.value.deliver,
    }

    if (this.itemValid(item)) {
      var time = new Date();

      var goodId = app.globalData.openid + '-' + time.toISOString().replace(/\D/g, '');
      item.userInfo = {
        name: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.cloudAvatarUrl,
      }
      item.time = time.toUTCString();

      wx.showLoading({
        title: '发布中',
      });

      (async () => {
          await this.uploadImagesToCloud(goodId);

          if (this.data.cloudImagesPath.length == 0) {
            wx.hideLoading();
            Toast({
              context: this,
              selector: '#t-toast',
              message: '发布失败',
              icon: 'close',
              duration: 1000,
            });
            return
          } else {
            item.images = this.data.cloudImagesPath;
            item.priImg = this.data.cloudImagesPath[0];

            // update cloud good info
            const db = wx.cloud.database();
            const goodsDB = db.collection('goods');
            goodsDB.where({
              goodId: goodId
            })
            .get()
            .then((res) => {
              if (res.data.length == 0) {
                goodsDB.add({
                  data: {
                    goodId: goodId,
                    goodInfo: item
                  }
                })
              } else {
                goodsDB.where({
                  goodId: res.data[0].goodId
                })
                .update({
                  data: {
                    goodInfo: item
                  }
                })
              }
            })

            // update user's good list
            let good =  {
              goodId: goodId,
              priImg: item.priImg,
              title: item.title,
              price: item.price,
              originPrice: item.originPrice,
              priceSign: item.priceSign,
              onSale: item.onSale,
            }
            const userGoodsDB = db.collection('user_goods_list');
            userGoodsDB.where({
              _openid: app.globalData.openid
            })
            .get()
            .then((res) => {
              if (res.data.length == 0) {
                userGoodsDB.add({
                  data: {
                    avatarUrl: app.globalData.cloudAvatarUrl,
                    nickName: app.globalData.nickName,
                    goods: [good],
                  }
                })
              } else {
                userGoodsDB.where({
                  _openid: app.globalData.openid,
                })
                .update({
                  data: {
                    'goods': db.command.push([good])
                  }
                })
                // userGoodsDB.where({
                //   _openid: app.globalData.openid,
                //   'goods.goodId': db.command.eq(goodId)
                // })
                // .update({
                //   data: {
                //     'goods.$': db.command.set(good)
                //   }
                // })
              }
            })

            // update local good info
            // let good =  {
            //   priImg: item.priImg,
            //   title: item.title,
            //   price: item.price,
            //   originPrice: item.originPrice,
            //   priceSign: item.priceSign,
            // }
            // let goodList = wx.getStorageSync('myGoods');
            // if (goodList) {
            //   wx.setStorageSync('myGoods', goodList.concat({
            //     goodId: goodId,
            //     good
            //   }));
            // } else {
            //   // TODO: check if there are some in the cloud
            //   // if there are: pull and concate
            //   // if not: first item, then create new list
            //   wx.setStorageSync('myGoods', [{
            //     goodId: goodId,
            //     good
            //   }]);
            // }
          
            wx.hideLoading();
            Toast({
              context: this,
              selector: '#t-toast',
              message: '发布成功',
              icon: 'check',
              duration: 1000,
            });
            wx.navigateBack({ delta: 1 });
          }
      })();
    }
  },

  uploadImagesToCloud: async function(id) {
    var time = new Date();
    var imgTime = time.toISOString().replace(/\D/g, '');

    for (var i = 0 ; i < this.data.imagesPath.length; ++i) {
      var imgId = `${id}-${imgTime}-${i}`;
      let fileId = await this.uploadImageToCloud(i, imgId);
      this.setData({
        cloudImagesPath: this.data.cloudImagesPath.concat(fileId)
      })
    }
  },

  uploadImageToCloud: function(i, id) {
    let cloudPath = `goodImages/${id}.${this.data.imagesPath[i].match(/\.(\w+)$/)[1]}`;
    let filePath = this.data.imagesPath[i];
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

  itemValid: function(item) {
    if (this.data.imagesPath.length < 1) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '* 至少一张照片哦',
        duration: 1000,
      });
      return false;
    }
    if (!item.title) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '* 起一个标题哦',
        duration: 1000,
      });
      return false;
    }
    if (!item.price) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '* 添加下价格哦',
        duration: 1000,
      });
      return false;
    }
    return true;
  },

});
