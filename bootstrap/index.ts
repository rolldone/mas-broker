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

const task = [
  StartNodeIdentity,
  StartSerializeError,
  StartPubSub,
  StartMasterData,
  StartConfig,
  StartRedisPubSub,
  StartExpress,
  StartSocketIO,
  StartRedisClient
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