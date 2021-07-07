import { AppConfig } from "@root/config";
import { Express} from "../tool";

var multer = require('multer');
var upload = multer();
var BodyParser = require("body-parser");

export default function(next : Function){
  try{
    console.log('Bootstrap -> Start Express');
    const app = Express;
    /* Request Type  */
    /* application/json */
    app.use(BodyParser.json());
    /* application-x-www-form-urlencoded */
    app.use(BodyParser.urlencoded({
      extended: true
    }));
    /* Multipart/form-data */
    app.use(upload.any());
    global.app = app;
    /* Note / Catatan */
    /* Perbedaan antara  global.Server.listen dan global.app.Listen
     - global.Server.listen -> Ini bisa di integrasikan dengan modul lain seperti socket io
     - global.app.listen -> Ini hanya untuk express saja */
    global.Server = require('http').createServer(app);
    global.Server.listen(AppConfig.PORT, () => {
      console.log(`Example app listening}`)
    });
    return next(null);
  }catch(ex){
    throw ex;
  }
}