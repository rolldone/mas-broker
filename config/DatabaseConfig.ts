import DotEnv from "@root/tool/DotEnv";

export interface AppConfigInterface {
  username: string,
  password: string,
  database: string,
  host: string,
  port: string,
  dialect: string,
}

export default {
  username: DotEnv.DB_USERNAME,
  password: DotEnv.DB_PASSWORD,
  database: DotEnv.DB_NAME,
  host: DotEnv.DB_HOST,
  port: DotEnv.DB_PORT,
  dialect: DotEnv.DB_DIALECT,
};