var runner = require('./src/runner.js').runner;
var folder = process.argv[2] || './specs';
runner(folder);