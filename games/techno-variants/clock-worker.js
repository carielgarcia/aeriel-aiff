/* Look-ahead clock for the Techno Variants sequencer.
   Runs in a Worker so tab/background timer throttling on the main thread cannot starve the scheduler. */
let timer = null;
self.onmessage = function (e) {
  if (e.data === 'start') {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { self.postMessage('tick'); }, 25);
  } else if (e.data === 'stop') {
    if (timer) clearInterval(timer);
    timer = null;
  }
};
