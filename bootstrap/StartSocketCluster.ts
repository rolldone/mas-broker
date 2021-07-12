var socketClusterServer = require('socketcluster-server');

export default function StartSocketCluster(next : Function){
  return next(null);
  console.log('Bootstrap -> Start Socket Cluster');
  const scServer  = socketClusterServer.attach(global.Server,{
    path : '/test',
    protocolVersion: 1
  });
  global.scServer  = scServer;
  scServer.on('connection', function (socket : any) {
    // ... Handle new socket connections here
    console.log('scServer -> ','connected');
  });
  return next(null);
}