import AdapterEventEmitter from "@root/app/adapter/routes/eventEmitter";
import RedisEventEmitter from "@root/app/redisclient/routes/eventEmitter";
import SocketIOEventEmitter from "@root/app/socketio/routes/eventEmitter";
import WebSocketEventEmit from "@root/app/websocket/routes/eventEmitter";
import BaseRoute from "@root/base/BaseRoute";
import { MasterDataInterface } from "@root/bootstrap/StartMasterData";

declare var masterData : MasterDataInterface

export default BaseRoute.extend<BaseRouteInterface>({
  baseRoute : '',
  onready(){
    /* Register adapter event emitter route */
    WebSocketEventEmit.create(this);
    AdapterEventEmitter.create(this);
    RedisEventEmitter.create(this);
    SocketIOEventEmitter.create(this);
    
  }
});