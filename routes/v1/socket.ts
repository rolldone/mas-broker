import BaseRoute from "../../base/BaseRoute";
const base64id = require('base64id');
const queryString = require('query-string');
const url = require('url');

export default BaseRoute.extend({
  baseRoute : '',
  onready(){
    const PROCESS_IS_RUNNING = 'PROCESS_IS_RUNNING';
    const io = global.io;
    io.engine.generateId = (req : any) => {
      let parseUrl = url.parse(req.url);
      let parseQuery = queryString.parse(parseUrl.query);
      // let dataTokenUser = await self.appuser.fetchUserByToken(room);
      // console.log(socket.handshake.query.name);
      return (parseQuery.prefix || '') + base64id.generateId();
    }

    io.on("connection", (socket: any) => {
      console.log('Socket is alive!');  
      socket.on('gate', async function(tokenChannel : string) {
        let userIs = null;
        /* Create filter is admin or client */
        switch(userIs){
          case 'server':
            break;
          case 'member':
            break;
          default:
            socket.join(tokenChannel);
            console.log('user come is join channel -> ',tokenChannel);
            break;
        }
      })
      
      /**
      ----------------------------------------------
      Check prefix process running agar mencegah user melakukan
      2 kali process atau lebih terhadap system, dan rencana bisa di gunakan prefix jika 
      ingin custom check process dan ini manual check dari client
      ----------------------------------------------------- **/
      socket.on(PROCESS_IS_RUNNING, function(message : any) {
        let currentRoom = io.sockets.adapter.sids[socket.id];
        delete currentRoom[socket.id];
        let process_is_running = false;
        for (var currKy in currentRoom) {
          for (var key in io.sockets.adapter.rooms) {
            if (key == currKy) {
              let prefxId = io.sockets.adapter.rooms[key].sockets;
              for (var keyPRx in prefxId) {
                if(keyPRx.includes('SYSTEM_')) {
                  process_is_running = true;
                  break;
                }
              }
            }
          }
        }
        if(process_is_running){
          socket.emit(PROCESS_IS_RUNNING, {
            status: 'success',
            status_code: 200,
            data: {
              message : "process is running"
            }
          })
        }
      });

      /* This is for client to client way */
      const PUBLISH_MAIN_WAY = 'publish-main-way';
      socket.on(PUBLISH_MAIN_WAY,function(res : any){
        socket.to(res.to).emit(res.key,res.return);
      });
      /* Define route event here */
    });
    
  }
} as BaseRouteInterface)