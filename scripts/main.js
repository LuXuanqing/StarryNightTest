'use strict'
// 网格尺寸
var grid = {
  rows: 7,
  cols: 7,
  cellWidth: undefined,
  cellHeight: undefined,
  dTarget: undefined,
  dDistractor: undefined,
  resize: function() {
    this.cellWidth = $('.cell').width()
    this.cellHeight = $('.cell').height()
    this.dTarget = Math.min(this.cellWidth, this.cellHeight) * 0.4
    this.dDistractor = this.dTarget / 2
    $('.target').width(this.dTarget)
    $('.target').height(this.dTarget)
    $('.distractor').width(this.dDistractor)
    $('.distractor').height(this.dDistractor)
  }
}
// 初始化
grid.resize()
// 改变窗口大小时自动调整
$(window).resize(function(){
  grid.resize()
})


// 定义Cell构造函数及prototype
function Cell(row, col) {
  this.row = row+1
  this.col = col+1
  this.el = $('.row:nth-child('+this.row+') .cell:nth-child('+this.col+')')
  this.target = this.el.children('.target')
  this.distractor = this.el.children('.distractor')
}
Cell.prototype.randPos = function() {
  var x = (grid.cellWidth - grid.dDistractor) * Math.random()
  var y = (grid.cellHeight - grid.dDistractor) * Math.random()
  this.distractor.css({'top': y, 'left': x})
}

// 创建Cell的实例并装进数组
var cells = []
for (var r = 0; r < grid.rows; r++) {
  cells.push([])
  for (var c = 0; c < grid.cols; c++) {
    cells[r].push(new Cell(r, c))
  }
}
// 初始化distractor和target
function initDistractors() {
  $('.distractor').hide()
  $('.target').hide()
  for (var i = 0; i < grid.rows; i++) {
    for (var j = 0; j < grid.cols; j++) {
      // 50%概率，随机执行
      if (getRandomInt(0,1)) {
        cells[i][j].randPos()
        cells[i][j].distractor.show()
      }
    }
  }
}
initDistractors()
// starry背景distractor
function starry() {
  // 随机选择一个distractor进行toggle
  randCell().randPos()
  randCell().distractor.toggle()
}
function randCell() {
  var row = getRandomInt(0,6)
  var col = getRandomInt(0,6)
  return cells[row][col]
}
// 每过50~250ms进行一次starry
var starryLoop
function loop() {
  var randomInterval = getRandomInt(50,250)
  starryLoop = setTimeout(function() {
    starry()
    loop()
  },randomInterval)
}
loop()

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 进度
var progress = {
  count: 0,
  max: 2,
  updateUI: function() {
    this.count++
    var progress = this.count / this.max
    var percent = progress * 100 + '%'
    $('.innerbar').width(percent)
  }
}
// 记录trail结果
var count = 0
var results = []
function hit(time) {
  var obj = {
    row: curCell.row,
    col: curCell.col,
    status: 'hit',
    reactionTime: time,
  }
  progress.updateUI()
  results.push(obj)
  console.info('Hit!@row'+obj.row+',col'+obj.col+' (' + time + ' ms)')
}
function miss() {
  var obj = {
    row: curCell.row,
    col: curCell.col,
    status: 'miss',
    reactionTime: 3000,
  }
  progress.updateUI()
  results.push(obj)
  console.info('Miss!@row'+obj.row+',col'+obj.col+' (3s elapsed)')
}
function falseAlarm() {
  var obj = {
    row: curCell.row,
    col: curCell.col,
    status: 'falseAlarm',
    reactionTime: undefined,
  }
  results.push(obj)
  progress.updateUI()
  console.info('False Alarm!@row'+obj.row+',col'+obj.col)
}

//开始测试
var trailTimer, missTimer, startTime, endTime, curCell
function startTrail() {
  if (progress.count < progress.max) {
    var delay = getRandomInt(700, 2100)
    // 700~2100ms后出现target
    trailTimer = setTimeout(function(){
      curCell = randCell()
      curCell.target.show()
      startTime = new Date()
      // 三秒超时定时器
      missTimer = setTimeout(function(){
        miss()
        curCell.target.hide()
        startTrail()
      }, 3000)
    }, delay)
  } else {
    endTrail()
  }
}
startTrail()
// 结束测试
function endTrail() {
  clearTimeout(trailTimer)
  clearTimeout(missTimer)
  clearTimeout(starryLoop)
  $('.distractor').hide()
  alert('Good job! You finished all trails.')
}

// 用户响应
var reactionTime
function react() {
  clearTimeout(missTimer)
  endTime = new Date()
  reactionTime = endTime - startTime
  if (reactionTime < 100 || $('.target:visible').length !== 1) {
    falseAlarm()
  } else {
    hit(reactionTime)
  }
  // 如果target可见，则hide()
  if (curCell.target.css('display') != 'none') {
    curCell.target.hide()
  }
  // 开始下一次测试
  clearTimeout(trailTimer)
  startTrail()
}
$('.container').on('click', function() {
  react()
})
