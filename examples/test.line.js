const ChartJs = require('..')
const cjs = new ChartJs(200, 40)

const opn = require('opn')
const util = require('util')

const lineConfig = {
    type: 'line',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [{
        backgroundColor: 'transparent',
        borderColor: 'red',
        label: 'Tasks',
        data: [4,1,55,77,99,11,99],
        fill: false,
        pointRadius: 0,
        cubicInterpolationMode: 'monotone',
        borderCapStyle: 'round'
      }]
    },
    options: {
      plugins: [{
        beforeUpdate: function (chartInstance) {
          const ctx = chartInstance.chart.ctx

          const width = chartInstance.chart.width
          const height = chartInstance.chart.height

          const dataset = chartInstance.data.datasets[0]

          const gradient = ctx.createLinearGradient(0, height, width, 0)
          gradient.addColorStop(0, '#FF7978')
          gradient.addColorStop(1, '#FFA278')
          dataset.borderColor = gradient

          console.log('dataset', dataset)
        }
      }],
      layout: {
        padding: 10,
        lineHeight: 1
      },
      legend: {
        display: false
      },
      linearGradientLine: true,
      scales: {
        yAxes: [{
          display: false,
          ticks: {
            display: false
          }
        }],
        xAxes: [{
          display: false
        }]
      }
    }
}

cjs.makeChart(lineConfig)
.then(res => {
  cjs.drawChart()

  cjs.toFile('test.line.png')
    .then(_ => {
      opn('test.line.png')
    })
})