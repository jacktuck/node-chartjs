const fs = require('fs')
const jsdom = require('jsdom')
const Canvas = require('canvas-prebuilt')
const pify = require('pify')
const config = require('./config')
const opn = require('opn')

const env = pify(jsdom.env)

// resolve peer dependancy
const chartpath = require.resolve('chart.js')
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

  console.log('window.Chart', window.Chart)

  const canvas = window.document.getElementById('myChart')
  const ctx = canvas.getContext('2d')

  new window.Chart(ctx, config)

  // rearg and promisify canvas toBlob
  const toBlob = (mime = 'image/png') => pify((mime, cb) => canvas.toBlob(cb, mime), { errorFirst: false })(mime)

  const blob = await toBlob()

  const out = fs.createWriteStream(__dirname + '/test.png')
  out.write(jsdom.blobToBuffer(blob))

  opn('file://' + __dirname + '/test.png')


})(module.exports).catch(console.log)
