import { Moment, Validator } from "@root/tool";
import BaseProto from "./BaseProto";

export default BaseProto.extend({
  returnValidator(form_data,form_rule){
    return new Validator(form_data,form_rule);
  },
  returnMoment(){
    return Moment();
  }
} as BaseServiceInterface);