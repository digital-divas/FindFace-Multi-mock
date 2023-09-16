const spec = require('mocha/lib/reporters/spec');
const mocha_junit_reporter = require('mocha-junit-reporter');

module.exports = function reporter(runner, opts) {
    new spec(runner, opts);
    new mocha_junit_reporter(runner, opts);
};
