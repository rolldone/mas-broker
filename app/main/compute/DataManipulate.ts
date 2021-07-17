import BaseCompute from "@root/base/BaseCompute";
import Crypto from 'crypto';

export interface DataManipulateInterface extends BaseComputeInterface{
  generateMd5?:{(text:string):string}
  getExistData ?: {(props:object):object};
}

export default BaseCompute.extend<DataManipulateInterface>({
  generateMd5: function(text){
    let hmac = Crypto.createHmac('md5',text)
    //passing the data to be hashed
    let resData = hmac.update('nodejsera');
    //Creating the hmac in the required format
    resData = (resData.digest('hex') as any);
    return resData+"";
  },
  getExistData : function(props){
    return props;
  }
});

