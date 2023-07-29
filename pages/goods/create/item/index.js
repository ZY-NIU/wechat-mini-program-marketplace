import Toast from 'tdesign-miniprogram/toast/index';

const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
const labelsOptions = [
  { id: 0, name: '家' },
  { id: 1, name: '公司' },
];

Page({

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
  uploadFiles: function(e) {
    wx.showLoading({
        title: "上传中"
    });
    wx.uploadFile({
      url:url,
      filePath: e,//图片路径
      name: "user_avatar",
      formData: {
        token: a.globalData.token,
        user_avatar: "filePath"
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function(a) {
        wx.hideLoading();
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 3000
        });
      },
      fail: function(a) {
        wx.hideLoading();
        wx.showToast({
          title: "上传失败",
          icon: "none",
          duration: 3000
        });
      }
    });
  },

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
  changeLocation(e) {

  },

  // options: {
  //   multipleSlots: true,
  // },
  // externalClasses: ['theme-wrapper-class'],

  data: {
    imagesPath: [
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
      'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
    ],
    addImages: true,
    titleFocus: false,
    priceFocus: false,
    descriptionFocus: false,
    priceSignIndex: 0,
    priceSignArray: ['CAD$', 'CNY¥'],
    condIndex: 4,
    condArray: ['全新', '二手 - 99新', '二手 - 微瑕', '二手 - 良好', '二手'],
    location: "Waterloo",



    locationState: {
      labelIndex: null,
      addressId: '',
      addressTag: '',
      cityCode: '',
      cityName: '',
      countryCode: '',
      countryName: '',
      detailAddress: '',
      districtCode: '',
      districtName: '',
      isDefault: false,
      name: '',
      phone: '',
      provinceCode: '',
      provinceName: '',
      isEdit: false,
      isOrderDetail: false,
      isOrderSure: false,
    },
    labels: labelsOptions,
    areaPickerVisible: false,
    submitActive: true,
    visible: false,
    labelValue: '',
    columns: 3,
  },
  privateData: {
    verifyTips: '',
  },
  onLoad(options) {
    const { id } = options;
    this.init(id);
  },

  onUnload() {
    if (!this.hasSava) {
      rejectAddress();
    }
  },

  hasSava: false,

  init() {
  },
  getAddressDetail(id) {
    fetchDeliveryAddress(id).then((detail) => {
      this.setData({ locationState: detail }, () => {
        const { isLegal, tips } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
        });
        this.privateData.verifyTips = tips;
      });
    });
  },
  onInputValue(e) {
    const { item } = e.currentTarget.dataset;
    if (item === 'address') {
      const { selectedOptions = [] } = e.detail;
      this.setData(
        {
          'locationState.provinceCode': selectedOptions[0].value,
          'locationState.provinceName': selectedOptions[0].label,
          'locationState.cityName': selectedOptions[1].label,
          'locationState.cityCode': selectedOptions[1].value,
          'locationState.districtCode': selectedOptions[2].value,
          'locationState.districtName': selectedOptions[2].label,
          areaPickerVisible: false,
        },
        () => {
          const { isLegal, tips } = this.onVerifyInputLegal();
          this.setData({
            submitActive: isLegal,
          });
          this.privateData.verifyTips = tips;
        },
      );
    } else {
      const { value = '' } = e.detail;
      this.setData(
        {
          [`locationState.${item}`]: value,
        },
        () => {
          const { isLegal, tips } = this.onVerifyInputLegal();
          this.setData({
            submitActive: isLegal,
          });
          this.privateData.verifyTips = tips;
        },
      );
    }
  },
  onPickArea() {
    this.setData({ areaPickerVisible: true });
  },
  onPickLabels(e) {
    const { item } = e.currentTarget.dataset;
    const {
      locationState: { labelIndex = undefined },
      labels = [],
    } = this.data;
    let payload = {
      labelIndex: item,
      addressTag: labels[item].name,
    };
    if (item === labelIndex) {
      payload = { labelIndex: null, addressTag: '' };
    }
    this.setData({
      'locationState.labelIndex': payload.labelIndex,
    });
    this.triggerEvent('triggerUpdateValue', payload);
  },
  addLabels() {
    this.setData({
      visible: true,
    });
  },
  confirmHandle() {
    const { labels, labelValue } = this.data;
    this.setData({
      visible: false,
      labels: [...labels, { id: labels[labels.length - 1].id + 1, name: labelValue }],
      labelValue: '',
    });
  },
  cancelHandle() {
    this.setData({
      visible: false,
      labelValue: '',
    });
  },
  onCheckDefaultAddress({ detail }) {
    const { value } = detail;
    this.setData({
      'locationState.isDefault': value,
    });
  },

  onVerifyInputLegal() {
    const { name, phone, detailAddress, districtName } = this.data.locationState;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);

    if (!name || !name.trim()) {
      return {
        isLegal: false,
        tips: '请填写收货人',
      };
    }
    if (!nameRegExp.test(name)) {
      return {
        isLegal: false,
        tips: '收货人仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phone || !phone.trim()) {
      return {
        isLegal: false,
        tips: '请填写手机号',
      };
    }
    if (!phoneRegExp.test(phone)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }
    if (!districtName || !districtName.trim()) {
      return {
        isLegal: false,
        tips: '请选择省市区信息',
      };
    }
    if (!detailAddress || !detailAddress.trim()) {
      return {
        isLegal: false,
        tips: '请完善详细地址',
      };
    }
    if (detailAddress && detailAddress.trim().length > 50) {
      return {
        isLegal: false,
        tips: '详细地址不能超过50个字符',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },

  builtInSearch({ code, name }) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting[code] === false) {
            wx.showModal({
              title: `获取${name}失败`,
              content: `获取${name}失败，请在【右上角】-小程序【设置】项中，将【${name}】开启。`,
              confirmText: '去设置',
              confirmColor: '#FA550F',
              cancelColor: '取消',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(settinRes) {
                      if (settinRes.authSetting[code] === true) {
                        resolve();
                      } else {
                        console.warn('用户未打开权限', name, code);
                        reject();
                      }
                    },
                  });
                } else {
                  reject();
                }
              },
              fail() {
                reject();
              },
            });
          } else {
            resolve();
          }
        },
        fail() {
          reject();
        },
      });
    });
  },

  onSearchAddress() {
    this.builtInSearch({ code: 'scope.userLocation', name: '地址位置' }).then(() => {
      wx.chooseLocation({
        success: (res) => {
          if (res.name) {
            this.triggerEvent('addressParse', {
              address: res.address,
              name: res.name,
              latitude: res.latitude,
              longitude: res.longitude,
            });
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '地点为空，请重新选择',
              icon: '',
              duration: 1000,
            });
          }
        },
        fail: function (res) {
          console.warn(`wx.chooseLocation fail: ${JSON.stringify(res)}`);
          if (res.errMsg !== 'chooseLocation:fail cancel') {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '地点错误，请重新选择',
              icon: '',
              duration: 1000,
            });
          }
        },
      });
    });
  },
  formSubmit() {
    const { submitActive } = this.data;
    if (!submitActive) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: this.privateData.verifyTips,
        icon: '',
        duration: 1000,
      });
      return;
    }
    const { locationState } = this.data;

    this.hasSava = true;

    resolveAddress({
      saasId: '88888888',
      uid: `88888888205500`,
      authToken: null,
      id: locationState.addressId,
      addressId: locationState.addressId,
      phone: locationState.phone,
      name: locationState.name,
      countryName: locationState.countryName,
      countryCode: locationState.countryCode,
      provinceName: locationState.provinceName,
      provinceCode: locationState.provinceCode,
      cityName: locationState.cityName,
      cityCode: locationState.cityCode,
      districtName: locationState.districtName,
      districtCode: locationState.districtCode,
      detailAddress: locationState.detailAddress,
      isDefault: locationState.isDefault === 1 ? 1 : 0,
      addressTag: locationState.addressTag,
      latitude: locationState.latitude,
      longitude: locationState.longitude,
      storeId: null,
    });

    wx.navigateBack({ delta: 1 });
  },

  getWeixinAddress(e) {
    const { locationState } = this.data;
    const weixinAddress = e.detail;
    this.setData(
      {
        locationState: { ...locationState, ...weixinAddress },
      },
      () => {
        const { isLegal, tips } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
        });
        this.privateData.verifyTips = tips;
      },
    );
  },
});
