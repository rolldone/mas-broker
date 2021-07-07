const theIo = require('socket.io')

export default function StartSocketIO(next : Function){
  console.log('Bootstrap -> Start Socket IO');
  const io = theIo(global.Server, {
    path: "/socket",
    transports : ['websocket']
  });
  global.io = io;
  return next(null);
}