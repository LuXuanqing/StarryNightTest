


var processedResults = []
for (var i = 0; i < grid.rows; i++) {
  processedResults.push([])
  for (var j = 0; j < grid.cols; j++) {
    processedResults[i].push({
      row: i+1,
      col: j+1,
      total: 0,
      hits: 0,
      misses: 0,
      falsAlarms: 0,
      acc: undefined,
      totalRT: 0,
      avrRt: undefined,
      calc: function() {
        this.total = this.hits + this.misses + this.falsAlarms
        this.acc = this.hits / this.total
        this.avrRt = this.totalRT / (this.hits+this.misses)
      }
    })
  }
}

var points = []
var max = 0
var data = {}


function process() {
  results.forEach(
    function(val){
      // 根据results生成processedResults
      var obj = processedResults[val.row-1][val.col-1]
      if (val.status == 'hit') {
        processedResults[val.row-1][val.col-1].hits++
        processedResults[val.row-1][val.col-1].totalRT += val.reactionTime
      } else if (val.status == 'miss') {
        processedResults[val.row-1][val.col-1].misses++
        processedResults[val.row-1][val.col-1].totalRT += val.reactionTime
      } else if (val.status == 'falseAlarm') {
        processedResults[val.row-1][val.col-1].falsAlarms++
      }
      processedResults[val.row-1][val.col-1].calc()
    }
  )
  // 根据processedResults生成points
  processedResults.forEach(
    // 每一行
    function(val) {
      // 一行中的每个元素
      val.forEach(
        function(val) {
          if (val.hits || val.misses) {
            var factor = -5*val.acc+6
            var obj = {
              row: val.row,
              col: val.col,
              acc: val.acc,
              x: Math.floor(val.col*grid.cellWidth - grid.cellWidth/2),
              y: Math.floor(val.row*grid.cellHeight - grid.cellHeight/2),
              value: Math.floor(val.avrRt * factor)
            }
            points.push(obj)
            max = Math.max(max, obj.value)
          }
        }
      )
    }
  )
  // 生成heatmap
  // minimal heatmap instance configuration
  $('.progressbar').before('<div class="heatmap"></div>')
  var heatmapInstance = h337.create({
    container: document.querySelector('.heatmap'),
    radius: 320,
    blur: 1,
  })
  data = {
    max: max,
    data: points
  }
  heatmapInstance.setData(data)
  // 插入play again按钮
  $('.heatmap').prepend('<div class="btn" id="again">Play again</div>')
  $('#again').on('click', function() {
    location.reload()
  })
}
