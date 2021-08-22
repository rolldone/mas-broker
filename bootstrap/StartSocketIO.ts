const theIo = require('socket.io')

export default function StartSocketIO(next: Function) {
  console.log('Bootstrap -> Start Socket IO------------------------------------------------');
  global.io = theIo(global.Server, {
    path: "/tester-tool-socket-io",
    // transports: ['websocket']
  });
  return next(null);
}