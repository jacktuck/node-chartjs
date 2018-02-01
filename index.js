const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')

const jsdom = require('jsdom')
const Canvas = require('canvas-prebuilt')
const pify = require('pify')

const env = pify(jsdom.env)

// resolve peer dependancy
const chartJSPath = path.dirname(require.resolve('chart.js'))
const chartJSSrc = fs.readFileSync(`${chartJSPath}/../dist/Chart.min.js`, 'utf-8')

class ChartJs extends EventEmitter {
  constructor (width = 1000, height = 1000) {
    super()
    this.height = height
    this.width = width
  }

  async makeChart (chartConfig) {
    const html = `<html>
      <body>
        <div id='chart-div' style='font-size:12; width:${this.width}; height:${this.height};'>
          <canvas id='myChart' width=${this.width} height=${this.height}></canvas>
        </div>
      </body>
      <script>${chartJSSrc}</script>
    </html>`

    this.window = await env(html, null, {
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
        SkipExternalResources: false
      }
    })

    this.window.CanvasRenderingContext2D = Canvas.Context2d

    chartConfig.options = chartConfig.options || {}
    chartConfig.options.responsive = false
    chartConfig.options.width = 400
    chartConfig.options.height = 400
    chartConfig.options.animation = false

    this.chartConfig = chartConfig
    this.canvas = this.window.document.getElementById('myChart')
    this.ctx = this.canvas.getContext('2d')

    return this
  }

  drawChart () {
    this.emit('beforeDraw', this.window.Chart)

    if (this.chartConfig.options.plugins) {
      console.log('registering plugins...')
      this.window.Chart.pluginService.register(this.chartConfig.options.plugins)
    }

    if (this.chartConfig.options.charts) {
      for (const chart of this.chartConfig.options.charts) {
        this.window.Chart.defaults[chart.type] = chart.defaults || {}
        if (chart.baseType) {
          this.window.Chart.controllers[chart.type] = this.window.Chart.controllers[chart.baseType].extend(chart.controller)
        } else {
          this.window.Chart.controllers[chart.type] = this.window.Chart.DatasetController.extend(chart.controller)
        }
      }
    }

    this.window.Chart(this.ctx, this.chartConfig)

    return this
  }

  toBlob (mime) {
    return pify((mime, cb) => this.canvas.toBlob(cb, mime), { errorFirst: false })(mime)
  }

  toBuffer (mime = 'image/png') {
    return this.toBlob(mime)
      .then(jsdom.blobToBuffer)
  }

  toFile (path, mime = 'image/png') {
    return this.toBuffer(mime)
      .then(blob => pify(fs.writeFile)(path, blob, 'binary'))
  }
}


module.exports = ChartJs
