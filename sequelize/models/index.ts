import Group from "./Group";
import Adapter from "./Adapter";
import AdapterEvent from "./AdapterEvent";
import User from "./User";
import Gateway from "./Gateway";
import TestTool from "./TestTool";


export {
  Gateway,
  Group,
  User,
  Adapter,
  AdapterEvent,
  TestTool
}

export default function (callback: Function) {

  /* User Relation */
  User.hasMany(Group, {
    foreignKey: 'user_id',
    as: 'groups'
  });

  /* Adapter Relation */
  Adapter.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  Adapter.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group'
  })

  Adapter.hasMany(AdapterEvent, {
    foreignKey: 'adapter_id',
    as: 'adapter_events'
  })

  /* AdapterEvent Relation */
  AdapterEvent.belongsTo(Adapter, {
    foreignKey: 'adapter_id',
    as: 'adapter'
  });

  AdapterEvent.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  })

  AdapterEvent.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group'
  })

  /* Gateway Relation */
  Gateway.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  })

  Gateway.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group'
  })

  Gateway.belongsTo(AdapterEvent, {
    foreignKey: 'receiver_id',
    as: 'receiver'
  })

  Gateway.belongsTo(AdapterEvent, {
    foreignKey: 'sender_id',
    as: 'sender'
  })

  /* Test Tool Relation */
  TestTool.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  })

  TestTool.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group'
  })

  TestTool.belongsTo(AdapterEvent, {
    foreignKey: 'from_ad_event_id',
    as: 'from_ad_event'
  })

  TestTool.belongsTo(AdapterEvent, {
    foreignKey: 'to_ad_event_id',
    as: 'to_ad_event'
  })

  console.log('Sequelize Relation initalize!');
  callback();
}