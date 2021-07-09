require('module-alias/register')
import BaseService from "@root/base/BaseService";
import { AppConfig } from "@root/config";
import Bcrypt from 'bcrypt';
const saltRounds = 10;
import Lodash from 'lodash';
import JsonWebToken from 'jsonwebtoken';
import AuthConfig, { AuthConfigGuardType, AuthConfigInterface, AuthConfigProviderType } from "@root/config/AuthConfig";
import { BaseModelInterface } from "@root/base/BaseModel";
import DeviceService from "@root/app/main/services/DeviceService";

export interface AuthInterface extends BaseComputeInterface{
  expiredConst : number
  expiredRefreshToken : number
  timestampToDatetime : {(unix_timestamp:number):Promise<string>}
  generatePassword : {(val:string, err?: Function):Promise<string>}
  checkPassword : {(val:string,val2:string):Promise<boolean>}
  getCurrentGuest : {(props:any):Promise<any>}
  splitToken : {(token:string):string}
  checkToken : {(key:string,token:string):Promise<string>}
  generateFastToken : {(data:any):Promise<string>}
  generateToken : {(authConfig : AuthConfigGuardType,data : any):object}
  _auth : AuthConfigInterface
  _select_auth : string
  getSelectAuth : {(authName : string, req : any):Promise<BaseModelInterface>}
  _getGuard : {(authName : string,req:any):Promise<BaseModelInterface>}
  setDefaultGuard : {(guardName:string,req:any):void}
  _req : any
  getAuth : {():Promise<BaseModelInterface>}
  _getProvider : {(providerName:string,props?:any):any}
  _device : any
  setDefaultRequest : {(req:any):void}
  getDevice : {():Promise<any>}
  getDeviceID : {():Promise<any>}
  setDeviceID : {(req:any):Promise<any>}
  _generateDeviceID : {(req:any):Promise<any>}
  _generateUniqueID : {():string}
}

const Auth = BaseService.extend<AuthInterface>({
  _req : null,
  expiredConst : (1 * 24 * 60 * 60 * 1000),
  expiredRefreshToken : (7 * 24 * 60 * 60 * 1000),
  timestampToDatetime : function(unix_timestamp) {
    return new Promise(function(resolve, rejected) {
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(unix_timestamp);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();
      // Will display time in 10:30:23 format
      var formattedTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
      resolve(formattedTime);
    });
  },
  generatePassword : function(val, err) {
    return new Promise(function(resolve,reject) {
      Bcrypt.hash(val, saltRounds).then(function(hash) {
        // Store hash in your password DB.
        resolve(hash);
      }).catch(function(err) {
        reject(err);
      });
    })
  },
  checkPassword : function(val, val2) {
    return new Promise(function(resolve) {
      Bcrypt.compare(val, val2).then(function(res) {
        if (res == true) {
          return resolve(true);
        }
        resolve(false);
      });
    });
  },
  getCurrentGuest : function(props) {
    return new Promise(function(resolve:any) {}.bind(this))
  },
  // ------------------------------------
  // Fungsi ini digunakan untuk remove
  // string Barrier nya terlelbih dahulu
  // Jika menggunakan header autorization barrier
  // --------------------------------------------
  splitToken : function(token) {
    if (Lodash.includes(token, 'Bearer')) {
      var header = token.split(' ');
      token = header[1];
    }
    return token;
  },
  checkToken : function(key,token) {
    let self = this;
    return new Promise(function(resolve,reject) {
      token = self.splitToken(token);
      if (token == null) {
        return reject('Token is required!');
      }

      // ----------------------------
      // Decrypte tokennya terlebih dahulu
      // --------------------------------------
      JsonWebToken.verify(token, key, function(err, decoded:any) {
        if (err!=null) {
          return reject(global.CustomError("error.token_invalid",err.message));
        }
        resolve(decoded);
      });
    });
  },
  generateFastToken : async function(data) {
    let self = this;
    try{
      let now = new Date();
      let newExpired = 14400000;
      let newDateTime = (await self.timestampToDatetime(newExpired)) + "";
      //Object.assign({}, data)
      //TODO: masukan data yang benar ke JsonWebToken sign dan cek token yang dibuat pada saat registrasi
      let token = JsonWebToken.sign(data, AppConfig.APP_SECRET, {
        expiresIn: (newExpired / 1000) + "s"
      });
      return token;
    }catch(ex){
      throw ex;
    }
  },
  generateToken : function(authConfig,data) {
    let self = this;
    return new Promise(async function(resolve,reject) {
      let now = new Date();
      let newExpired = now.getTime() + self.expiredConst;
      let newDateTime = (await self.timestampToDatetime(newExpired)) + "";
      // Object.assign({}, data)
      //TODO: masukan data yang benar ke JWT sign dan cek token yang dibuat pada saat registrasi
      let token = JsonWebToken.sign(data, authConfig.key, {
        expiresIn: (self.expiredConst / 1000) + "s"
      });
      let encrypteToken = await self.generatePassword(token,function(err : any){
        if(err != null) return reject(err);
      })
      // console.log('expiredConst',encrypteToken);
      let refresh_token = JsonWebToken.sign({
        token : token,
      }, AppConfig.APP_SECRET, {
        expiresIn: (self.expiredRefreshToken / 1000) + "s"
      })
      resolve({
        encrypteToken : encrypteToken,
        token: token,
        refresh_token: refresh_token,
        expired_at: newDateTime
      });
    })
  },
  /* Authentication like laravel  */
  _auth : Object.freeze(AuthConfig),
  _select_auth : null,
  getSelectAuth : async function(authName,req){
    let self = this;
    try{
      let user = await self._getGuard(authName,req);
      return user;
    }catch(ex){
      throw ex;
    }
  },
  setDefaultGuard : function(guardName,req){
    this._select_auth = guardName;
    this._req = req;
  },
  getAuth : async function(){
    let self = this;
    try{
      if(self._select_auth == null) {
        throw global.CustomError("error.select_auth_exception",'Please set default auth first');
      }
      let user = await self._getGuard(self._select_auth,self._req);
      return user;
    }catch(ex){
      throw ex;
    }
  },
  _getGuard : async function(guardName,req){
    try{
      let self = this;
      let guard = self._auth.guard[guardName];
      let provider = null;
      if(guard == null){
        throw global.CustomError('error.guard_not_found_exception','This guard '+guardName+' is not defined!');
      }
      switch(guard.driver){
        case 'session':
          provider = await self._getProvider(guard.provider);
          break;
        case 'jwt':
          let token : any = await self.checkToken(guard.key,req.headers.authorization);
          provider = await self._getProvider(guard.provider,{
            id : token.id,
            email : token.email
          });
          return provider;
        case 'token':
          provider = await self._getProvider(guard.provider);
          break;
      }
    }catch(ex){
      throw ex;
    }
  },
  _getProvider : async function(providerName,props){
    try{
      // staticType(props,[Object]);
      let self = this;
      let provider = self._auth.provider[providerName];
      let user : any = null;
      if(provider == null){
        throw global.CustomError('error.provider_not_found_exception','This provider '+providerName+' is not defined')
      }
      switch(provider.driver){
        case 'sequelize':
          // staticType(props.id,[Number]);
          // staticType(props.email,[String]);
          user = provider.model;
          user = user.create();
          user = await user.first({
            where : { id : props.id, email : props.email }
          })
          return user;
        case 'mongodb':
          break;
        default:
          break;
      }
    }catch(ex){
      throw ex;
    }
  },
  /* 
    Get Device ID
  */
  _device : null,
  setDefaultRequest : function(req){
    let self = this;
    self._req = req;
  },
  getDevice : async function(){
    let self = this;
    return await (async function(){
      let device = DeviceService.create();
      let resData = await device.getDeviceByDeviceID(self._req.headers.device_id);
      if(resData == null){
        return null;
      }
      self._device = resData;
      return self._device;
    })()
  },
  getDeviceID : async function(){
    let self = this;
    return await (async function(){
      let device = DeviceService.create();
      console.log('self._req.headers.device_id',self._req.headers.device_id)
      let resData = await device.getDeviceByDeviceID(self._req.headers.device_id);
      if(resData == null){
        return null;
      }
      self._device = resData;
      return self._device.device_id;
    })()
  },
  setDeviceID : async function(req){
    let self = this;
    self._req = req;
    return await self._generateDeviceID(self._req);
  },
  _generateUniqueID : function(){
    return '_' + Math.random().toString(36).substr(2, 9);
  },
  _generateDeviceID : async function(req){
    let self = this;
    let device = DeviceService.create();
    let resData = await (async function(){
      let resData = null;
      if(req.headers.device_id != null && req.headers.device_id != ''){
        resData = await device.getDeviceByDeviceID(req.headers.device_id);
      }
      return resData;
    })()
    
    if(resData == null){
      resData = await device.addDevice({
        browser_type : req.headers['user-agent'],
        ip_address : req.header('x-forwarded-for') || req.connection.remoteAddress,
        status : device.status.NEW,
        device_id : self._generateUniqueID()
      })
    }
    self._device = resData;
    return resData;
  },
})

export default Auth;