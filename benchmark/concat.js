const Benchmark = require('benchmark');
const bu = require('..');

const suite = new Benchmark.Suite();

const b1 = Buffer.from('“Avengers: Endgame” has its sights set on world domination');
const b2 = Buffer.from('“Avengers: Endgame” has its sights set on world domination');

// add tests
suite
  .add('bufferutil#concat', function () {
    bu.concat([b1, b2]);
  })
  .add('Buffer#concat', function () {
    Buffer.concat([b1, b2]);
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({async: true});
