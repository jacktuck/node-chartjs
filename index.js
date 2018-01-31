const jsdom = require('jsdom')
const Canvas = require('canvas-prebuilt')
const pify = require('pify')
const config = require('./config')

const eval = pify(jsdom.env)

jsdom.defaultDocumentFeatures = {
  FetchExternalResources: ['script'],
  ProcessExternalResources: true
}

;(async function (exports) {
  const chart = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.js'

  const html = `<html>
    <body>
      <div id="chart-div" style="font-size:12; width:400; height:400;">
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    </body>

  </html>`

  try {
    const window = await eval(html, [chart])

    window._canvas = window.document.getElementById('myChart')
    window.ctx = window._canvas.getContext('2d')
  
    window.config = config
     
    window.CanvasRenderingContext2D = Canvas.Context2d
  
    window.Chart(window.ctx, window.config)

    window._chart = new window.Chart(window.ctx, window.config)

    window._canvas.toBlob(function (blob, err) { // no error
      console.log('BLOB', blob) // never reached
    }, 'image/png')

    window._canvas.toBlob(function (blob, err) { // Empty JPEG image (DNL not supported)
      console.log('BLOB', blob) // never reached
    }, 'image/jpg')
  } catch (e) {
    console.log('ERR', e)
  }
})(module.exports)
