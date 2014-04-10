/**
 *  @package esched
 *  @author 吴迪 - 同济大学软件学院，学号：1253021
 */

(function(window) {
  var ELT_CAPACITY = 10     // 电梯容量限制
    , STY_CNT = 20          // 楼层数（课程要求20）
    , ELT_CNT = 5           // 电梯数（课程要求5）
    ;

  var elts = initArray(ELT_CNT, Elevator)  // Elevator实例集合，为所有电梯对象
    , reqTbl = { 
        up: new ReqTbl(), 
        down: new ReqTbl()
      }
    , pendQueues = initArray(STY_CNT, []); // 每一层正在等待的人
    ;

  // Static class
  var Core = {}
    , Tool = {}
    , Debug = {};

  /*****************************************************************
   *  @class Elevator 
   *  @description 电梯类
   */
  function Elevator(index) {
    this.id = index; 
    this.load = 0;    // 电梯中的人数初始化为0
    this.sty = 1;     // 当前楼层，一开始为1楼
    this.tbl = new CurReqTbl(this); // 接管请求表 
    this.people = []; // 当前在这个电梯里面的所有人
    this.status = Elevator.status.WAIT; // 电梯状态，默认为等待   
  }
  // 电梯的三种状态
  Elevator.status = {
    'WAIT'    : 0,    // 等待
    'GO_UP'   : 1,    // 上行
    'GO_DOWN' : 2     // 下行
  };

  /*
      lastStyReq
      获取当前要去的楼层中最后一个楼层
      比如在下行的时候，当前电梯要前往9楼，7楼，4楼，则返回4
   */
  Elevator.prototype.lastStyReq = function() {
    var i;
    for (i = 0; i < STY_CNT;i ++) {
      if (this.tbl[i]) {
        return i + 1;
      }
    }
    return null;
  };
  /*
      step
      单步运行一次
   */
  Elevator.prototype.step = function() {
    this.fetchOuterRequest(); 
  };

  /*****************************************************************
   *  @class CurReqTbl
   *  @description 接管请求表
   */
  function CurReqTbl(elt) {
    this.data = initArray(STY_CNT, false);
    this.elt = elt;
  }
  /*
      isEmpty
      接管请求表是否为空
   */
  CurReqTbl.prototype.isEmpty = function() {
    var i;
    for (i = 0; i < STY_CNT; i ++) {
      if (this.data[i]) {
        return false;
      }
    }
    return true;
  }
  /*
      getClosestReq
      获得与当前楼层最近的请求表内的楼层数
      当上行时，只返回高层楼层；当下行时，只返回低层楼层；当暂停时，优先返回上行楼层
   */
  CurReqTbl.prototype.getClosestReq = function() {
    if (this.elt.status === Elevator.status.WAIT) {
      if (!!this._getClostestReqUp()) {
        return this._getClostestReqUp();
      }
      else {
        return this._getClostestReqDown();
      }
    }
    else if (this.elt.status === Elevator.status.GO_UP) {
      return this._getClostestReqUp();
    }
    else {
      return this._getClostestReqDown();
    }
  }
  CurReqTbl.prototype._getClostestReqUp = function() {
    var i;
    for (i = (this.elt.sty - 1) + 1; i < STY_CNT; i ++) {
      if (this.data[i]) {
        return i;
      }
    }
    return null;
  }
  CurReqTbl.prototype._getClostestReqDown = function() {
    var i;
    for (i = (this.elt.sty - 1) - 1; i > 0; i --) {
      if (this.data[i]) {
        return i;
      }
    }
    return null;
  }

  /*****************************************************************
   *  @class ReqTbl
   *  @description 全局请求表
   */
  function ReqTbl() {
    this.data = initArray(STY_CNT, 0);
  }

  /*
      addRequest
      请求表中，楼层sty添加cnt个新请求
   */
  ReqTbl.prototype.addRequest = function(sty, cnt) {
    this.data[sty - 1]++;
  };

  /*
      resolveRequest
      请求表中，楼层sty移除cnt个请求
   */
  ReqTbl.prototype.resolveRequest = function(sty, cnt) {
    this.data[sty - 1]--;
  };

  /*
      count
      获取请求表中，楼层sty中的请求个数
   */
  ReqTbl.prototype.count = function(sty) {
    return this.data[sty - 1];
  };
  /*
      hasRequest
      获取请求表中，楼层sty是否有请求
   */
  ReqTbl.prototype.hasRequest = function(sty) {
    return this.data[sty - 1] === 0;
  };

  /*****************************************************************
   *  @class People
   *  @description 活生生的人
   */
  function People(styFrom, styTo) {
    this.from = styFrom;
    this.to   = styTo;
  }

  /*****************************************************************
   *  @class Core
   *  @description 核心API
   */
  /*
      step
      一个单位时间流逝
   */
  Core.step = function() {
    var i;
    for (i = 0; i < ELT_CNT; i ++) {
      elts[i].step();
    }
  };
  /*
      addRequest
      添加一个外部请求，从styFrom楼到styTo楼
   */
  Core.addRequest = function(styFrom, styTo) {
    // 往等待队列中先添加此请求
    pendQueues[styFrom - 1].push(new People(styFrom, styTo));
    // 往全局请求表中添加此请求
    if (styTo > styFrom) {
      reqTbl.up.addRequest(styFrom, 1);
    }
    else {
      reqTbl.down.addRequest(styFrom, 1);
    }
  };

  /*****************************************************************
   *  @class Tool 
   *  @description 工具函数库
   */
  /*
      initArray
      返回一个初始化完毕的数组，长度为length，初始值为initValue
   */
  Tool.initArray = function(length, initValue) {
    var ret = []
      , i;
    for (i = 0; i < length; i ++) {
      if (typeof initValue === 'function') {
        ret[i] = new initValue();
      }
      else {
        ret[i] = initValue;
      }
    }
    return ret;
  };

  /*****************************************************************
   *  @class Debug
   *  @description 调试API
   */
  
  if (!!window.__karma__) {
    window.esched = { debug : Debug };
  }

})(window);