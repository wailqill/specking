var runner = require('./src/specking.js').runner;
var folder = process.argv[2] || './specs';
runner(folder);