import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  // TODO: check message and images legal
  data: {
    // imagesPath: [],
    id: null,
    cloudImagesPath: [],
    title: null,
    price: null,
    description: null,
    priceSignIndex: 0,
    priceSignArray: ['CAD$', 'CNY¥'],
    condIndex: 4,
    condArray: ['全新', '二手 · 99新', '二手 · 微瑕', '二手 · 良好', '二手'],
    locationIndex: 0,
    locationArray: ['Waterloo', 'Toronto'],
    delivery: false,

    mode: 1,
    addImages: true,
    titleFocus: false,
    priceFocus: false,
    descriptionFocus: false,
  },

  onLoad(options) {
    if (options.mode == 0) {
      const db = wx.cloud.database();
      db.collection('goods')
      .doc(options.id)
      .get({
        success: res => {
          if (res.data.goodInfo.images.length >= 9) {
            this.setData({
              addImages: false,
            });
          }
  
          this.setData({
            mode: 0,
            id: options.id,
            cloudImagesPath: res.data.goodInfo.images,
            title: res.data.goodInfo.title,
            titleFocus: res.data.goodInfo.title !== '',
            price: res.data.goodInfo.price,
            priceFocus: res.data.goodInfo.price !== '',
            description: res.data.goodInfo.description,
            descriptionFocus: res.data.goodInfo.description !== '',
            condIndex: this.data.condArray.indexOf(res.data.goodInfo.attributes[0].value),
            priceSignIndex: this.data.priceSignArray.indexOf(res.data.goodInfo.priceSign),
            locationIndex: this.data.locationArray.indexOf(res.data.goodInfo.location),
            delivery: res.data.goodInfo.deliver
          })
        },
        fail: res => {
          this.setData({
            mode: 1
          })
        }
      })
    } else {
      this.setData({
        mode: 1
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
      count: 9 - a.data.cloudImagesPath.length,
      success: e => {
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
          a.uploadImagesToCloud(e.tempFilePaths);

          if (a.data.cloudImagesPath.length >= 9) {
            a.setData({
              addImages: false,
            });
          }
        }
      },
      fail: e => {
        console.log(e)
      }
    });
  },

  uploadImagesToCloud: async function(paths) {
    wx.showLoading({
      title: '审核图片',
    });

    var time = new Date();
    var imgTime = time.toISOString().replace(/\D/g, '');

    let id = app.globalData.openid;

    for (var i = 0 ; i < paths.length; ++i) {
      var imgId = `${id}-${imgTime}-${i}`;
      let fileId = await this.uploadImageToCloud(paths[i], imgId);
      this.setData({
        cloudImagesPath: this.data.cloudImagesPath.concat(fileId)
      })
    }
    wx.hideLoading();
  },

  uploadImageToCloud: function(path, id) {
    let cloudPath = `goodImages/${id}.${path.match(/\.(\w+)$/)[1]}`;
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

  deleteImage: function(e) {
    var imgsPath = this.data.cloudImagesPath;
    var index = e.currentTarget.dataset.index;
    var deletePath = imgsPath[index];

    wx.cloud.deleteFile({
      fileList: [deletePath],
      fail: console.error
    })

    imgsPath.splice(index, 1);
    this.setData({
      cloudImagesPath: imgsPath,
      addImages: true
    });
  },

  previewImg(e) {
    wx.previewImage({
      current: this.data.cloudImagesPath[e.detail.index],
      urls: this.data.cloudImagesPath
    })
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
      // var time = new Date();

      // var goodId = app.globalData.openid + '-' + time.toISOString().replace(/\D/g, '');
      let avatar = app.globalData.userInfo.cloudAvatarUrl;
      let name = app.globalData.userInfo.nickName;
      item.userInfo = {
        name: name,
        avatarUrl: avatar,
      }

      let message = this.data.mode ? '发布' : '保存';
      wx.showLoading({
        title: message + '中',
      });

      (async () => {
        // await this.uploadImagesToCloud();

        if (this.data.cloudImagesPath.length == 0) {
          wx.hideLoading();
          Toast({
            context: this,
            selector: '#t-toast',
            message: message + '失败',
            icon: 'close',
            duration: 1000,
          });
          return
        } else {
          item.images = this.data.cloudImagesPath;
          item.priImg = this.data.cloudImagesPath[0];

          // upload to cloud
          const db = wx.cloud.database();
          if (this.data.mode) {
            await db.collection('goods').add({
              data: {
                time: db.serverDate(),
                goodInfo: item
              }
            })
          } else {
            await db.collection('goods').doc(this.data.id)
            .update({
              data: {
                time: db.serverDate(),
                goodInfo: item
              }
            })
          }
        
          wx.hideLoading();
          Toast({
            context: this,
            selector: '#t-toast',
            message: message + '成功',
            icon: 'check',
            duration: 1000,
          });
          wx.navigateBack({ delta: 1 });
        }
      })();
    }
  },

  itemValid: function(item) {
    if (this.data.cloudImagesPath.length < 1) {
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
