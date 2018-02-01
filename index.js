const fs = require('fs')
const jsdom = require('jsdom')
const Canvas = require('canvas-prebuilt')
const pify = require('pify')
let config = require('./config')
const opn = require('opn')

const env = pify(jsdom.env)

// resolve peer dependancy
require.resolve('chart.js')
const chartjs = fs.readFileSync('./node_modules/chart.js/dist/Chart.min.js', 'utf-8')

;(async function (module) {
  const html = `<html>
    <body>
      <div id='chart-div' style='font-size:12; width:400; height:400;'>
        <canvas id='myChart' width=400 height=400></canvas>
      </div>
    </body>
    <script>${chartjs}</script>
  </html>`


  const window = await env(html, null, {
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script'],
      SkipExternalResources: false
    }
  })

  window.CanvasRenderingContext2D = Canvas.Context2d

  const fixConfig = config => Object.assign({}, config, {
    options: {
      responsive: false,
      width: 400,
      height: 400,
      animation: false
    }
  }) 

  // temp
  config = Object.assign({}, config, {
    options: {
      responsive: false,
      width: 400,
      height: 400,
      animation: false
    }
  })

  const canvas = window.document.getElementById('myChart')
  const ctx = canvas.getContext('2d')

  const draw = new window.Chart(ctx, config)

  // rearg and promisify canvas toBlob
  const toBlob = pify((mime, cb) => canvas.toBlob(cb, mime), { errorFirst: false })

  const toBuffer = (mime = 'image/png') => toBlob(mime).then(jsdom.blobToBuffer)
  const toFile = (path, mime = 'image/png') => toBuffer(mime).then(blob => pify(fs.writeFile)(path, blob, 'binary'))

  // const blob = await toBlob()
// console.log('blobx', blob)


  // const out = fs.createWriteStream(__dirname + '/test.png')
  // out.write(jsdom.blobToBuffer(blob))
  await toFile('test.png')
console.log(4343)

  opn('file://' + __dirname + '/test.png')

  module.toBuffer = toBuffer
  module.toFile = toFile

  module.canvas = canvas
  module.ctx = ctx
})(module.exports).catch(console.log)
