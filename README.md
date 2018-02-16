# node-chartjs

Chart.js on the server in Node.js 8.x.x or later

Based on previous work by https://github.com/vmpowerio/chartjs-node

*With a few improvements we think:*

- Uses the newer ~9.x.x~ 11.x.x version of JSDOM
- Does not pollute node's global namespace

> Note that we strongly advise against trying to "execute scripts" by mashing together the jsdom and Node global environments (e.g. by doing global.window = dom.window), and then executing scripts or test code inside the Node global environment. Instead, you should treat jsdom like you would a browser, and run all scripts and tests that need access to a DOM inside the jsdom environment, using window.eval or runScripts: "dangerously". This might require, for example, creating a browserify bundle to execute as a <script> element—just like you would in a browser.

## 💖 Made possibly by:

- [node-canvas](https://github.com/Automattic/node-canvas) - a Cairo backed Canvas implementation for NodeJS. See [installation wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Ubuntu-and-other-Debian-based-systems)

- [jsdom](https://github.com/jsdom/jsdom) - a implementation of the WHATWG DOM and HTML standards for use with node.js


## Getting Started

### Peer Dependencies

You'll need to `npm install chart.js` as it is a peer dependency of node-chartjs. Tested with `chart.js@2.4.x` any later and we have artifacts there are some issues open upstream, we anticipate fixes in 2.8.x*

Also make sure you have installed canvas' dependencies ([see installation wiki](https://github.com/Automattic/node-canvas/wiki/_pages))

```
npm install node-chartjs
```

## Usage

```js
const Chart = require('node-chartjs')
const chart = new Chart(200, 200) // 1000 x 1000 is default

chart.makeChart({ ... })
.then(res => {
  chart.drawChart()

  chart.toFile('test.line.png')
    .then(_ => {
      // file is written
    })
})
```

See examples folder for more
