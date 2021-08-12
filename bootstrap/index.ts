import { AsyncJs } from "../tool";
import StartConfig from "./StartConfig";
import StartExpress from "./StartExpress";
import StartMasterData from "./StartMasterData";
import StartPubSub from "./StartPubSub";
import StartRedisPubSub from "./StartRedisPubSub";
import StartRedisClient from '@root/bootstrap/StartRedisClient';
import StartSerializeError from './StartSerializeError';
import StartSocketIO from "./StartSocketIO";
import StartNodeIdentity from "./StartNodeIdentity";
import StartSocketCluster from "./StartSocketCluster";
import StartWebSocket from "./StartWebSocket";

const task = [
  StartNodeIdentity,
  StartSerializeError,
  StartPubSub,
  StartMasterData,
  StartConfig,
  /* Because this app dynamic redis connection turn off StartRedisPubSub */
  // StartRedisPubSub,
  StartExpress,
  StartSocketIO,
  // StartSocketCluster,
  /* Because this app dynamic redis connection turn off StartRedisClient */
  // StartRedisClient,
  StartWebSocket
  /* Other bootstrap ? */
];

export default function(asyncDone : Function){
  AsyncJs.series(task,function(err,result){
    if(err){
      return console.error(err);
    }
    console.log('Initialize Bootstrap Is Done!');
    asyncDone(null);
  })
}