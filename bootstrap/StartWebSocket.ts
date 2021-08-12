import { Server as ServerInterface } from "http";
import url from 'url';
import { MasterDataInterface } from "./StartMasterData";
const WebSocket = require('ws');

declare var masterData: MasterDataInterface
declare var Server: ServerInterface;

export default function StartWebSocket(next: Function) {
  // const server = new MultipathServer({ port : 3000 });
  Server.on('upgrade', function (req: any, socket: any, head: any) {
    const pathname = url.parse(req.url).pathname;
    let socketCollections: {
      [key: string]: any
    } = masterData.getData('websocket_server.collections', {}) as any;
    if (socketCollections[pathname] != null) {
      socketCollections[pathname].handleUpgrade(req, socket, head, function done(ws: any) {
        socketCollections[pathname].emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });
  global.WebSocket = WebSocket;
  return next(null);
}