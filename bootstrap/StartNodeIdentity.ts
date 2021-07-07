const theIo = require('socket.io')
const base64id = require('base64id');

export default function StartNodeIdentity(next : Function){
  global.node_identity = "";//base64id.generateId();  
  return next(null);
}