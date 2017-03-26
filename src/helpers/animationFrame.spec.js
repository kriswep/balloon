/* globals test jest expect */
import requestAnimFrame from './animationFrame';

test('animationFrame should shim the best available frame function', (done) => {
  let calls = 0;

  // function should be called several times per second
  // up to 10, since we stop there
  const mockedFn = () => {
    if (calls < 10) {
      calls += 1;
      requestAnimFrame(mockedFn);
    } else {
      expect(calls).toBe(10);
      done();
    }
  };

  // start it
  requestAnimFrame(mockedFn);
});
