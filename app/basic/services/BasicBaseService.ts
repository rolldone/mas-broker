import BaseBaseService from '@root/base/BaseService';
const md5 = require('md5');

export interface BasicBaseServiceInterface extends BaseServiceInterface{
  generateMd5 ?: {(DataSring : string) : string}
}
const BasicBaseService : BasicBaseServiceInterface = BaseBaseService.extend(<BasicBaseServiceInterface>{
  generateMd5(DataSring){
    return md5(DataSring);
  }
});

export default BasicBaseService;