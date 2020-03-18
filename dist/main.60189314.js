// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
//舞台容器的创建
var stage = new createjs.Stage("canvas");
var container = new createjs.Container();
container.x = 60;
container.y = 60;
stage.addChild(container); //设置画面连续刷新，一秒刷新60次

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);
var currentCat; //当前猫

var nextCat; //猫将要移动的位置

var type; //绘制圆形的颜色类型

var indexX = 0,
    indexY = 0; //圆形对象里的圆形的坐标

var circleArray = [[], [], [], [], [], [], [], [], []]; //圆形放置的数组

var randomX, randomY; //随机生成的坐标位置

var count = 5; //开始的时候随机生成5个障碍物

var rodeArry = [0, 0, 0, 0, 0, 0]; //每条路径出口数量

var borderArry = [0, 0, 0, 0, 0, 0]; //记录每条路是否有到边界
//圆形对象函数

function Circle() {
  createjs.Shape.call(this);
  this.indexX = indexX;
  this.indexY = indexY; //根据传入的type值设置不同的颜色

  this.setCircleType = function (type) {
    this.type = type;

    switch (type) {
      case 1:
        return this.CreateCircle("#ccc");
        break;

      case 2:
        return this.CreateCircle("#f18f47");
        break;

      case 3:
        return this.CreateCircle("#5eaaeb");
        break;
    }
  }; //获得圆形对象的颜色类型


  this.getCircleType = function () {
    return this.type;
  }; //根据颜色创建圆形


  this.CreateCircle = function (color) {
    this.graphics.beginFill(color).drawCircle(0, 0, 25).endFill();
  }; //默认创建灰色圆形


  return this.setCircleType(1);
} //设置圆函数的原型为形状


Circle.prototype = new createjs.Shape(); //添加全部圆形到界面

function addCircle() {
  //添加9x9个圆形
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var obj = new Circle();
      obj.x = j % 2 == 0 ? i * 55 : i * 55 + 25;
      obj.y = j * 55;
      obj.indexX = i;
      obj.indexY = j;
      obj.addEventListener("click", onclicked);

      if (i == 4 && j == 4) {
        obj.setCircleType(3);
        currentCat = obj;
      }

      circleArray[i][j] = obj;
      container.addChild(obj);
    }
  } //一开始的时候随机出现5个障碍物


  while (count) {
    randomX = Math.floor(Math.random() * 9);
    randomY = Math.floor(Math.random() * 9);
    var temp = circleArray[randomX][randomY];

    if (temp != currentCat && temp.getCircleType != 2) {
      circleArray[randomX][randomY].setCircleType(2);
      count--;
    }
  }
} //添加事件监听响应函数


function onclicked(e) {
  //当点击的是灰色圆形时才进行处理
  if (e.target.getCircleType() == 1) {
    //首先将点击的圆形设置成橙色障碍物
    e.target.setCircleType(2); //开始进行移动猫的操作
    //找到当前猫所有出口方向的可以走的灰色圆形数量，并存到路径数组中

    var mayCat = currentCat;

    for (var i = 0; i < 6; i++) {
      //每次点击路径数组都清零重新记录
      rodeArry[i] = 0;
      borderArry[i] = 0; //找到每个方向的出口路径数量放到对应数组中

      while (1) {
        if (chose(mayCat, i) != mayCat && chose(mayCat, i).getCircleType() != 2) {
          rodeArry[i]++;
          mayCat = chose(mayCat, i);
        } else {
          if (chose(mayCat, i) == mayCat) {
            borderArry[i] = 1;
          }

          mayCat = currentCat;
          break;
        }
      }
    }
    /*for(var m = 0; m < 6; m++){
        alert(selectArry[m]);
    }*/
    //猫要走的方向


    var direction = rodeMax(rodeArry, borderArry);
    nextCat = chose(currentCat, direction);

    if (nextCat.getCircleType() != 2) {
      nextCat.setCircleType(3);
      currentCat.setCircleType(1);
      currentCat = nextCat;
    } else {
      stage.update();
      alert("真棒，神经猫被你抓住了");
    }

    if (currentCat.indexX == 0 || currentCat.indexX == 8 || currentCat.indexY == 0 || currentCat.indexY == 8) {
      stage.update();
      alert("神经猫逃走了！");
    }
  }
} //根据给的当前猫的位置找到旁边的所有出口


function chose(mayCat, directiontype) {
  //获得当前猫的坐标位置
  var row = mayCat.indexX;
  var column = mayCat.indexY; //如果当前猫坐标到了边界，则不再往上找了

  if (row == 0 || column == 0 || row == 8 || column == 8) return mayCat; //右上

  var righttop = column % 2 == 0 ? circleArray[row][column - 1] : circleArray[row + 1][column - 1]; //右边

  var right = circleArray[row + 1][column]; //右下

  var rightbottom = column % 2 == 0 ? circleArray[row][column + 1] : circleArray[row + 1][column + 1]; //左下

  var leftbottom = column % 2 == 0 ? circleArray[row - 1][column + 1] : circleArray[row][column + 1]; //左边

  var left = circleArray[row - 1][column]; //左上

  var lefttop = column % 2 == 0 ? circleArray[row - 1][column - 1] : circleArray[row][column - 1]; //根据传的方向值返回该方向的对象

  switch (directiontype) {
    case 0:
      return righttop;
      break;

    case 1:
      return right;
      break;

    case 2:
      return rightbottom;
      break;

    case 3:
      return leftbottom;
      break;

    case 4:
      return left;
      break;

    case 5:
      return lefttop;
      break;
  }
} //找出路径数组中出口最多的方向


function rodeMax(rodearray, borderarry) {
  var flag = false; //标志判断路径方向是否到边界

  var direction = 0; //最终的方向初始为0
  //找到是否存在有边界的出口

  for (var j = 0; j < 6; j++) {
    if (borderarry[j]) flag = true;else rodearray[j] += 100;
  } //如果有边界的出口就取最短路径


  if (flag) {
    for (var i = 0; i < 6; i++) {
      if (rodearray[i] < rodearray[direction]) direction = i;
    }
  } //如果该路径都没边界出口则选择路径长的挣扎下
  else {
      for (var i = 0; i < 6; i++) {
        if (rodearray[i] > rodearray[direction]) direction = i;
      }
    }

  return direction;
} //初始化游戏


addCircle();
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.60189314.js.map