/**
 *  @package esched
 *  @author 吴迪 - 同济大学软件学院，学号：1253021
 */

(function(window) {
  var ELT_CAPACITY = 10     // 电梯容量限制
    , STY_CNT = 20           // 楼层数
    ;

  var elts = []             // Elevator实例集合，为所有电梯对象
    , reqTbl = { 
        up: new RequestTable(), 
        down: new RequestTable()
      }
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
    this.tbl = initArray(STY_CNT, false); // 接管请求表    
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

  /*****************************************************************
   *  @class RequestTable
   *  @description 全局请求表
   */
  function RequestTable() {
    this.data = initArray(STY_CNT, 0);
  }

  /*
      addRequest
      请求表中，楼层sty添加cnt个新请求
   */
  RequestTable.prototype.addRequest = function(sty, cnt) {
    this.data[sty - 1]++;
  }

  /*
      resolveRequest
      请求表中，楼层sty移除cnt个请求
   */
  RequestTable.prototype.resolveRequest = function(sty, cnt) {
    this.data[sty - 1]--;
  }

  /*
      count
      获取请求表中，楼层sty中的请求个数
   */
  RequestTable.prototype.count = function(sty) {
    return this.data[sty - 1];
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

  }
  /*
      addRequest
      添加一个请求，从styFrom楼到styTo楼
   */
  Core.addRequest = function(styFrom, styTo) {
    
  }
  /*
      dispatchRequest
      根据目前全局请求表分配请求
   */
  Core.dispatchRequest = function() {

  }

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
      ret[i] = initValue;
    }
    return ret;
  };

  /*****************************************************************
   *  @class Debug
   *  @description 调试API
   */
  window.esched = { debug : Debug };

})(window);