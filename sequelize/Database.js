import DotEnv from "../tool/DotEnv";

module.exports = {
  main : {
    username: DotEnv.DB_USERNAME,
    password: DotEnv.DB_PASSWORD,
    database: DotEnv.DB_NAME,
    host: DotEnv.DB_HOST,
    port: DotEnv.DB_PORT,
    dialect: DotEnv.DB_DIALECT
  },
  // test: {
  //   username: process.env.CI_DB_USERNAME,
  //   password: process.env.CI_DB_PASSWORD,
  //   database: process.env.CI_DB_NAME,
  //   host: '127.0.0.1',
  //   port: 3306,
  //   dialect: 'mysql',
  //   dialectOptions: {
  //     bigNumberStrings: true
  //   }
  // },
  // production: {
  //   username: process.env.PROD_DB_USERNAME,
  //   password: process.env.PROD_DB_PASSWORD,
  //   database: process.env.PROD_DB_NAME,
  //   host: process.env.PROD_DB_HOSTNAME,
  //   port: process.env.PROD_DB_PORT,
  //   dialect: 'mysql',
  //   dialectOptions: {
  //     bigNumberStrings: true,
  //     ssl: {
  //       ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
  //     }
  //   }
  // }
};