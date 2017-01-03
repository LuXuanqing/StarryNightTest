// minimal heatmap instance configuration
var heatmapInstance = h337.create({
  container: document.querySelector('.heatmap')
})
// // now generate some random data
// var points = [];
// var max = 0;
// var width = 840;
// var height = 400;
// var len = 200;
//
// while (len--) {
//   var val = Math.floor(Math.random()*100);
//   max = Math.max(max, val);
//   var point = {
//     x: Math.floor(Math.random()*width),
//     y: Math.floor(Math.random()*height),
//     value: val
//   };
//   points.push(point);
// }
// // heatmap data format
// var data = {
//   max: max,
//   data: points
// };
// heatmapInstance.setData(data)
$('.heatmap').hide()

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
      accuracy: undefined,
      totalRT: 0,
      avrRt: undefined,
      calc: function() {
        this.total = this.hits + this.misses + this.falsAlarms
        this.accuracy = this.hits / this.total
        this.avrRt = this.totalRT / (this.hits + this.misses)
      }
    })
  }
}

var points = []
var max = 0
function process() {
  results.forEach(function(val){
    var obj = processedResults[val.row-1][val.col-1]
    if (val.status == 'hit') {
      processedResults[val.row-1][val.col-1].hit++
      processedResults[val.row-1][val.col-1].totalRT += val.reactionTime
    } else if (val.status == 'miss') {
      processedResults[val.row-1][val.col-1].misses++
      processedResults[val.row-1][val.col-1].totalRT += val.reactionTime
    } else if (val.status == 'falseAlarm') {
      processedResults[val.row-1][val.col-1].falsAlarms++
    }
    processedResults[val.row-1][val.col-1].calc()
  })
  processedResults.forEach(function(val){
    val.forEach(function(val){
      if (val.hits || val.misses) {
        max = Math.max(max, Math.floor(val.avrRt))
        points.push({
          x: Math.floor(val.row*grid.cellWidth - grid.cellWidth/2),
          y: Math.floor(val.col*grid.cellHeight - grid.cellHeight/2),
          value: Math.floor(val.avrRt),
        })
      }
    })
  })
  var data = {
    max: max,
    data: points
  }
  heatmapInstance.setData(data)
  $('.heatmap').show()
}
