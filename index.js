var fs = require('fs')
var jsdom = require('jsdom')
var Canvas = require('canvas-prebuilt')
var pify = require('pify')
var config = require('./config')
var opn = require('opn')

var env = pify(jsdom.env)

;(async function (exports) {
  var chart = 'https://cdn.jsdelivr.net/npm/chart.js@2.4/dist/Chart.min.js'

  var html = `<html>
    <body>
      <div id='chart-div' style='font-size:12; width:400; height:400;'>
        <canvas id='myChart' width=400 height=400></canvas>
      </div>
    </body>

  </html>`

  try {
    var window = await env(html, [chart], {
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
        SkipExternalResources: false
      }
    })

    window.CanvasRenderingContext2D = Canvas.Context2d

    config.options = {
      responsive: false,
      width: 400,
      height: 400,
      animation: false
    }
    config.animation = false
    config.width = 400
    config.height = 400

    // console.log('canvas', _canvas)
    // console.log('ctx', _ctx)
    console.log('window.Chart', window.Chart)

    const _canvas = window.document.getElementById('myChart')
    const _ctx = _canvas.getContext('2d')

    // If I just draw a circle it is rendered fine
    // _ctx.beginPath()
    // _ctx.arc(95,50,40,0,2*Math.PI)
    // _ctx.stroke()

    new window.Chart(_ctx, config)

    _canvas.toBlob(function (blob, err) {
      console.log('ERR', err)
      var out = fs.createWriteStream(__dirname + '/test.png')
      out.write(jsdom.blobToBuffer(blob))

      opn('file://' + __dirname + '/test.png')
    }, 'image/png')
  } catch (e) {
    console.log('ERR', e)
  }
})(module.exports)
