import * as fs from 'fs';
import path from "path";
var theConfig :{
  [key:string] : any
}= {};
var basename = path.basename(__filename);
fs.readdirSync(__dirname).filter(file => {
  return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
}).forEach(file => {
  var config = (path.join(__dirname, file));
  let name = config;
  name = name.replace(/^.*[\\\/]/, '');
  name = (name.substr(name.lastIndexOf('/') + 1)).replace('.js', '');
  theConfig[name] = require(config).default;
});

export default theConfig;