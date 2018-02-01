const fs = require('fs')
const jsdom = require('jsdom')
const Canvas = require('canvas-prebuilt')
const pify = require('pify')
const config = require('./config')
const opn = require('opn')

const env = pify(jsdom.env)
const chartjs = fs.readFileSync('./node_modules/chart.js/dist/Chart.min.js', 'utf-8')

;(async function (exports) {

  const html = `<html>
    <body>
      <div id='chart-div' style='font-size:12; width:400; height:400;'>
        <canvas id='myChart' width=400 height=400></canvas>
      </div>
    </body>
    <script>${chartjs}</script>

  </html>`

  try {
    const window = await env(html, null, {
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
      const out = fs.createWriteStream(__dirname + '/test.png')
      out.write(jsdom.blobToBuffer(blob))

      opn('file://' + __dirname + '/test.png')
    }, 'image/png')
  } catch (e) {
    console.log('ERR', e)
  }
})(module.exports)
