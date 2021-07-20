import { MasterDataInterface } from "@root/bootstrap/StartMasterData";
import * as fs from 'fs';
import path from "path";

declare var masterData: MasterDataInterface

export default function (asyncDone: Function) {

  /* Get only folder classes */
  var folderClassess: {
    [key: string]: any
  } = {};
  let file = fs.readdirSync(__dirname).filter(file => {
    /* Get only folder with have middleware classess */
    if (file.indexOf(".") === -1) {
      switch (file) {
        /* Exclude folders */
        case 'models':
        case 'sequelize':
          return false;
        default:
          return true;
      }
    }
    return false;
  });

  /* Collecting data from filter readdirSync and save it  */
  for (var a = 0; a < file.length; a++) {
    var config = (path.join(__dirname, file[a]));
    let name = config;
    name = name.replace(/^.*[\\\/]/, '');
    /* Set key name to upperCase for easy compare on access_name */
    folderClassess[name.toUpperCase()] = require(config).default;
  }

  /* Middleware receivers */
  let middlewareReceivers: {
    [key: string]: any
  } = masterData.getData('gateway.middleware.receivers', {}) as any;

  /* Get the object */
  for (var key in folderClassess) {
    if (middlewareReceivers[key] == null) {
      middlewareReceivers[key] = {};
    }
    /* Get the sub object */
    for (var key2 in folderClassess[key]) {
      /* If key match receiver catch it */
      if (key2.toLowerCase().match('receiver') != null) {
        middlewareReceivers[key][key2] = folderClassess[key][key2];
      }
    }
  }

  /* And middlewareReceivers save it */
  masterData.saveData('gateway.middleware.receivers', middlewareReceivers);

  /* Middleware senders */
  let middlewareSenders: {
    [key: string]: any
  } = masterData.getData('gateway.middleware.senders', {}) as any;

  /* Get the object */
  for (var key in folderClassess) {
    if (middlewareSenders[key] == null) {
      middlewareSenders[key] = {};
    }
    /* Get the sub object */
    for (var key2 in folderClassess[key]) {
      /* If key match sender catch it */
      if (key2.toLowerCase().match('sender') != null) {
        middlewareSenders[key][key2] = folderClassess[key][key2];
      }
    }
  }

  /* And middlewareSenders save it */
  masterData.saveData('gateway.middleware.senders', middlewareSenders);

  console.log('middlewareReceivers',middlewareReceivers);
  console.log('middlewareSenders',middlewareSenders);
  
  /* Next process */
  asyncDone(null);

}