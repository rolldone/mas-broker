
import BaseService from '@root/base/BaseService';
import { Validator } from '@root/tool';
import Device, { DeviceModelInterface } from '../models/Device';

export interface DeviceServiceInterface extends BaseServiceInterface{
  returnDeviceApp : {():DeviceModelInterface}
  status : any
  getDevices : {(props:any):Promise<any>}
  getDeviceByDeviceID : {(device_id:string):Promise<any>}
  getDevice : {(props:any):Promise<any>}
  addDevice : {(props:any):Promise<any>}
  updateDevice : {(props:any):Promise<any>}
  deleteDevices : {(ids:Array<string>):Promise<any>}
  op : any
}

export default BaseService.extend<DeviceServiceInterface>({
  op : null,
  status : Object.freeze({
    NEW : 1,
    TO_BE_MEMBER : 2,
    BACK_AGAIN : 3,
    EXPIRED : 4,
    BLOCKED : 5,
  }),
  returnDeviceApp : function(){
    return Device.create();
  },
  getDevices : async function(props : any){
    let self = this;
    try{
      let validator = self.returnValidator(props,{});
      switch(await validator.check()){
        case validator.passes:
          let device = this.returnDeviceApp();
          let resData = await device.get({
            where : {}
          });
          return resData;
        case validator.fails:
          throw global.CustomError("error.validation",JSON.stringify(validator.errors.all()));
      }
    }catch(ex){
      throw ex;
    }
  },
  getDeviceByDeviceID : async function(device_id : any){
    let self = this;
    try{
      let validator = self.returnValidator({
        device_id : device_id
      },{
        device_id : 'required'
      });
      switch(await validator.check()){
        case validator.passes:
          return this.getDevice({
            device_id : device_id
          })
        case validator.fails:
          throw global.CustomError("error.validation",JSON.stringify(validator.errors.all()));
      }
    }catch(ex){
      throw ex;
    }
  },
  getDevice : async function(props:any){
    let self = this;
    try{
      let validator = self.returnValidator(props,{});
      switch(await validator.check()){
        case validator.passes:
          let device = self.returnDeviceApp();
          let resData = await device.first({
            where : props
          });
          return resData;
        case validator.fails:
          throw global.CustomError("error.validation",JSON.stringify(validator.errors.all()));
      }
    }catch(ex){
      throw ex;
    }
  },
  addDevice : async function(props){
    let self = this;
    try{
      let validator = self.returnValidator(props,{
        device_id : 'required',
        ip_address : 'required',
        browser_type : 'required',
        status : 'required'
      });
      switch(await validator.check()){
        case validator.passes:
          let device = this.returnDeviceApp();
          let resData = await device.save(props);
          return resData;
        case validator.fails:
          throw global.CustomError("error.validation",JSON.stringify(validator.errors.all()));
      }
    }catch(ex){
      throw ex;
    }
  },
  updateDevice : async function(props){
    let self = this;
    try{
      let validator = self.returnValidator(props,{
        id : 'required'
      });
      switch(await validator.check()){
        case validator.passes:
          let device = this.returnDeviceApp();
          let resData = await device.update(props);
          return resData;
        case validator.fails:
          throw global.CustomError("error.validation",JSON.stringify(validator.errors.all()));
      }
    }catch(ex){
      throw ex;
    }
  },
  deleteDevices : async function(ids){
    let self = this;
    try{
      let validator = self.returnValidator({
        ids : ids
      },{
        ids : 'required'
      })
      switch(await validator.check()){
        case validator.passes:
          let device = this.returnDeviceApp();
          let resData = await device.delete({
            where : {
              id : {
                [self.op.in] : ids
              }
            }
          });
          return resData;
        case validator.fails:
          throw global.CustomError("error.validation",JSON.stringify(validator.errors.all()));
      }
    }catch(ex){
      throw ex;
    }
  }
})