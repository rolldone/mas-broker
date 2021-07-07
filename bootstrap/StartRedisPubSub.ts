import { RedisPubSub } from "../tool";
import Redis from 'redis';
import RedisConfig from "@root/config/RedisConfig";

export default function StartRedisPubSub(next : Function){
  const redisPub = Redis.createClient({
    port: RedisConfig.port,
    host: RedisConfig.host,
    // auth: Env.REDIS_AUTH,
    no_ready_check: true,
    db : 0,
  });
  redisPub.auth(RedisConfig.auth);
  const redisSub = Redis.createClient({
    port: RedisConfig.port,
    host: RedisConfig.host,
    // auth: Env.REDIS_AUTH,
    no_ready_check: true,
    db : 0,
    // return_buffers: true
  });
  redisSub.auth(RedisConfig.auth);
  let nrpConfig = {
    emitter: redisPub,
    receiver: redisSub,
    scope : 'artywiz-broadcast-service'
  };
  let nrp = RedisPubSub(nrpConfig);
  global.nrp = <RedisPubSubListener>{
    emit : function(whatKey : string,whatObject : any){
      if(whatObject instanceof Error){
        whatObject = global.serializeError(whatObject);
      }
      return nrp.emit(whatKey,whatObject);
    },
    on : function(whatKey : string, callback : Function){
      let unsubscribe = nrp.on(whatKey,function(props : any){
        let testError = global.deserializeError(props.toString());
        if(testError.toString().indexOf('NonError:',0) == 0){
          callback(null,props);
          return;
        }
        callback(testError,null);
      });
      return unsubscribe;
    }
  }
  return next(null);
}