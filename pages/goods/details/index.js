// pages/goods/details/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "Zeyu",
    userHeadUrl: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132',
    details: {
      id: 1,
      personId: 1,
      title: '白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣',
      price: 34,
      originPrice: 35,
      priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
      images: [
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
      ],
      video: null,
      attributes: [
        {
          attribute: "商品成色",
          value: "二手 · 99新",
        },
        {
          attribute: "品牌",
          value: "nike",
        },
        {
          attribute: "大小",
          value: "US · 8码",
        },
      ],
      description: "白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙白色短袖连衣裙白色短袖连衣裙白\
        色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣白色短袖连衣裙白色短袖连衣裙白色短袖连\
        衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖\
        连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短\
        \n白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣\
        白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣\
        白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣爽优雅连衣裙白色短袖连衣裙白色短袖连衣裙白\
        色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣白色短袖连衣裙白色短袖连衣裙白色短袖连\
        衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖\
        连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短\
        \n白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣\
        白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣白色短袖连衣\
        白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短袖连衣裙白色短",
      location: 'N2L',
      availability: 1,
      meetup: {
        public: true,
        pickup: true,
        deliver: true,
      },
    },

    isValidityLinePrice: true,

    currency: "$",

    navigation: { type: 'fraction' },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,

    goodsList: [
      {
        id: 1,
        personId: 1,
        title: '白色短袖连衣裙',
        price: 34,
        originPrice: 35,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        images: [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
        ],
        video: null,
        condition: 1,
        description: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
        location: 'N2L',
        availability: 1,
        meetup: 3,
      },
      {
        id: 2,
        personId: 2,
        title: '短袖',
        price: 3456,
        originPrice: 9999,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        images: [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
        ],
        video: null,
        condition: 2,
        description: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
        location: 'N2L',
        availability: 2,
        meetup: 2,
      },
      {
        id: 3,
        personId: 1,
        title: '棋',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
        images: [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
        ],
        video: null,
        condition: 3,
        description: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
        location: 'N2L',
        availability: 1,
        meetup: 1,
      },
      {
        id: 4,
        personId: 1,
        title: '5个碗，6个锅',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-17a.png',
        images: [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
        ],
        video: null,
        condition: 4,
        description: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
        location: 'N2L',
        availability: 1,
        meetup: 3,
      },
      {
        id: 5,
        personId: 2,
        title: '电脑',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        images: [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
        ],
        video: null,
        condition: 1,
        description: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
        location: 'N2L',
        availability: 2,
        meetup: 2,
      },
      {
        id: 6,
        personId: 3,
        title: '洗衣机，烘干机，衣服，裤子',
        price: 4,
        originPrice: 3,
        priImg: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        images: [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png'
        ],
        video: null,
        condition: 1,
        description: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
        location: 'N2L',
        availability: 2,
        meetup: 1,
      },
    ]
  },

  toChat() {

  },

  toShare() {

  },

  toSave(e) {

  },
})