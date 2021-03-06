//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
Page({

  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    diaryList: [],
    modifyDiarys: false,

    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '无脊柱动物'
        },
        {
          id: 1,
          name: '脊柱动物'
        }
      ], [
        {
          id: 0,
          name: '扁性动物'
        },
        {
          id: 1,
          name: '线形动物'
        },
        {
          id: 2,
          name: '环节动物'
        },
        {
          id: 3,
          name: '软体动物'
        },
        {
          id: 3,
          name: '节肢动物'
        }
      ], [
        {
          id: 0,
          name: '猪肉绦虫'
        },
        {
          id: 1,
          name: '吸血虫'
        }
      ]
    ],
    multiIndex: [0, 0, 0],
    date: '2016-09-01',
    time: '12:01',
    region: ['广东省', '广州市', '海珠区']
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
        console.log('成功', res)

        wx.getShareInfo({
          shareTicket: res.shareTickets,
          success(res) {


            //内部调用云端代码
            var currentUser = Bmob.User.current();
            var data = {
              "objectId": currentUser.id, "encryptedData": res.encryptedData, "iv": res.iv
            };
            console.log(data);

            // console.log(data);
            Bmob.Cloud.run('getOpenGId', data).then(function (obj) {
              // var res = JSON.parse(obj)
              console.log(obj)
            }, function (err) {
              console.log(err)
            });

            data = { "objectId": currentUser.id, "encryptedData": "Q3h+kMwbKZ52BsxgNT4GS5LTYeLLGIXnA/BZrg/9iMJBD5Qv3Fs5H66xe9ml7iNIsOBEtaeUG0InAxbZOhn1qEeAJ2aC3wYpjARR4pCYA1v87+bj9khaUDY6pvaKX5/4TFHrofKAmA0gTT6bSaHyiw==", "iv": "YHoSkWomdfiyvAWHoYvKiQ==" };
            console.log(data);
            Bmob.Cloud.run('getOpenGId', data).then(function (obj) {
              // var res = JSON.parse(obj)
              console.log(obj)
            }, function (err) {
              console.log(err)
            });

          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {
    that = this;

    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })




    //批量更新数据
    // var query = new Bmob.Query('diary');
    // query.find().then(function (todos) {
    //   todos.forEach(function (todo) {
    //     todo.set('title', "无需后端编程");
    //   });
    //   return Bmob.Object.saveAll(todos);
    // }).then(function (todos) {
    //   // 更新成功
    // }, function (error) {
    //   // 异常处理
    // });


  },
  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    getList(this);
    console.log("11111");
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    //this.onShow()
  },
  toAddDiary: function () {
    console.log("111111111111111111");






    that.setData({
      writeDiary: true
    })
  },
  addDiary: function (event) {
    var title = event.detail.value.title;
    var content = event.detail.value.content;
    var formId = event.detail.formId;
    console.log("event", event)
    if (!title) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!content) {
      common.showTip("内容不能为空", "loading");
    }
    else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();

      var User = Bmob.Object.extend("_User");
      var UserModel = new User();

      // var post = Bmob.Object.createWithoutData("_User", "594fdde53c");

      //增加日记
      var Diary = Bmob.Object.extend("diary");
      var diary = new Diary();
      diary.set("title", title);
      diary.set("formId", formId);//保存formId
      diary.set("content", content);
      if (currentUser) {
        UserModel.id = currentUser.id;
        diary.set("own", UserModel);
      }
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          common.showTip('添加日记成功');
          that.setData({
            writeDiary: false,
            loading: false
          })

          var currentUser = Bmob.User.current();




          that.onShow()
        },
        error: function (result, error) {
          // 添加失败
          common.showTip('添加日记失败，请重新发布', 'loading');

        }
      });
    }

  },
  closeLayer: function () {
    that.setData({
      writeDiary: false
    })
  },
  deleteDiary: function (event) {






    var objectId = event.target.dataset.id;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除要日记？',
      success: function (res) {
        if (res.confirm) {
          //删除日记
          var Diary = Bmob.Object.extend("diary");



          var query = new Bmob.Query('diary');
          query.find().then(function (todos) {
            return Bmob.Object.destroyAll(todos);
          }).then(function (todos) {
            console.log(todos);
            // 更新成功
          }, function (error) {
            // 异常处理
          });

          //创建查询对象，入口参数是对象类的实例
          // var query = new Bmob.Query(Diary);
          // query.equalTo("objectId", objectId);
          // query.destroyAll({
          //   success: function () {
          //     common.showTip('删除日记成功');
          //     that.onShow();
          //   },
          //   error: function (err) {
          //     common.showTip('删除日记失败', 'loading');
          //   }
          // });
        }
      }
    })
  },
  toModifyDiary: function (event) {
    //var nowTile = event.target.dataset.title;
    //var nowContent = event.target.dataset.content;
    //var nowId = event.target.dataset.id;

    var nowName = event.target.dataset.name;
    var nowDate = event.target.dataset.date;

    var t1 = event.target.dataset.timeA;
    console.log(event.target.dataset );
    console.log(t1);

    that.setData({
      writeDiary: true,
      nowDate: nowDate,
      nowName: nowName,

      t1: event.target.dataset.timea,
      t2: event.target.dataset.timeb,
      t3: event.target.dataset.timec
    })
  },
  modifyDiary: function (e) {
    var t = this;
    modify(t, e)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
    console.log("22222");
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getList(this);
    console.log("33333");
  },
  inputTyping: function (e) {
    //搜索数据
    getListByKey(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  }

})


/*
* 获取数据
*/
function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("data");
  var query = new Bmob.Query(Diary);
  var query1 = new Bmob.Query(Diary);

  //会员模糊查询
  if (k) {
    query.equalTo("name", { "$regex": "" + k + ".*" });
    //query1.equalTo("content", { "$regex": "" + k + ".*" });
  }

  //普通会员匹配查询
  // query.equalTo("title", k);
  
  //query.descending('createdAt');
  //query.include("own")
  // 查询所有数据
  query.limit(that.data.limit);
  query1.ascending("date");
  var mainQuery = Bmob.Query.or(query, query1);
  mainQuery.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        diaryList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getListByKey(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("data");
  var query = new Bmob.Query(Diary);
  var query1 = new Bmob.Query(Diary);

  //会员模糊查询
  //if (k) {
  //  query.equalTo("title", { "$regex": "" + k + ".*" });
  //  query1.equalTo("content", { "$regex": "" + k + ".*" });
  //}

  //普通会员匹配查询
  query.equalTo("name", k);

  query.ascending("date");
  //query.include("own")
  // 查询所有数据
  //query.limit(that.data.limit);

  //var mainQuery = Bmob.Query.or(query, query1);
  //mainQuery.find({
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        diaryList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function modify(t, e) {
  var that = t;
  //修改日记
  var modyTitle = e.detail.value.title;
  var modyContent = e.detail.value.content;
  var objectId = e.detail.value.content;
  var thatTitle = that.data.nowTitle;
  var thatContent = that.data.nowContent;
  if ((modyTitle != thatTitle || modyContent != thatContent)) {
    if (modyTitle == "" || modyContent == "") {
      common.showTip('标题或内容不能为空', 'loading');
    }
    else {
      console.log(modyContent)
      var Diary = Bmob.Object.extend("diary");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function (result) {

          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('title', modyTitle);
          result.set('content', modyContent);
          result.save();
          common.showTip('日记修改成功', 'success', function () {
            that.onShow();
            that.setData({
              modifyDiarys: false
            })
          });

          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  }
  else if (modyTitle == "" || modyContent == "") {
    common.showTip('标题或内容不能为空', 'loading');
  }
  else {
    that.setData({
      modifyDiarys: false
    })
    common.showTip('修改成功', 'loading');
  }
}