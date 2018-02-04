# node-chartjs

Based on previous work by https://github.com/vmpowerio/chartjs-node

With a few improvements we think:

- Uses prebuilt canvas binaries for faster npm installs
- Uses the newer ~9.x.x~ 11.x.x version of JSDOM
- Does not pollute node's global namespace

> Note that we strongly advise against trying to "execute scripts" by mashing together the jsdom and Node global environments (e.g. by doing global.window = dom.window), and then executing scripts or test code inside the Node global environment. Instead, you should treat jsdom like you would a browser, and run all scripts and tests that need access to a DOM inside the jsdom environment, using window.eval or runScripts: "dangerously". This might require, for example, creating a browserify bundle to execute as a <script> element—just like you would in a browser.


[canvas-prebuilt](https://github.com/node-gfx/node-canvas-prebuilt) - prebuilt node-canvas binaries published to NPM. Speeds up install time 🚀

[node-canvas](https://github.com/Automattic/node-canvas) - a Cairo backed Canvas implementation for NodeJS. [installation](https://github.com/Automattic/node-canvas/wiki/_pages).

[jsdom](https://github.com/jsdom/jsdom) - a implementation of the WHATWG DOM and HTML standards for use with node.js