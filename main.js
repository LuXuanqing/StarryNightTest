'use strict'
var cell = {
  cell: $('.cell'),
  target: $('#target'),
  distractor: $('#distractor'),
  distractorVisible: undefined,
  init: function(){
    var x = Math.random() * parseInt(this.cell.css('width'))
    var y = Math.random() * parseInt(this.cell.css('height'))
    console.info('x: '+ x + '; y: ' + y)
    this.distractor.css('top',y)
    this.distractor.css('left',x)
  },
}
var timeout1 = undefined
$('#start').on('click', function(){
  start()
})
$('#cancel').on('click', function(){
  clearTimeout(timeout1)
})
function start() {
  var delay = Math.random() * 1400 + 700 //randomly 700~2100
  timeout1 = setTimeout(function(){
    cell.target.css('visibility', 'visible')
  }, delay)
}
$('.cell').on('click', function() {
  hit()
})
function hit() {
  console.info('hit!')
  cell.target.css('visibility', 'hidden')
  start()
}
