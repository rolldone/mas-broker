import Admin from "@root/app/main/models/Admin"
import User from "@root/app/main/models/User"
import { BaseModelInterface } from "@root/base/BaseModel"

export interface AuthConfigInterface {
  guard : {
    [key : string] : AuthConfigGuardType
  }
  provider : {
    [key : string] : AuthConfigProviderType
  }
}

export type AuthConfigGuardType = {
  driver : string
  provider : string
  key ?: string
}

export type AuthConfigProviderType = {
  driver : string
  model : BaseModelInterface
}

export default <AuthConfigInterface>{
  guard: {
    web: {
      driver: 'session',
      provider: 'users'
    },
    api: {
      driver: 'jwt',
      provider: 'users',
      key: 'apakah ini untuk member?'
    },
    admin_api: {
      driver: 'jwt',
      provider: 'admins',
      key: 'apakah ini untuk admin?'
    },
    app: {
      driver: 'jwt',
      provider: 'apps',
      key: 'apakah ini untuk app?'
    }
  },
  provider: {
    users: {
      driver: 'sequelize',
      model: User
    },
    admins: {
      driver: 'sequelize',
      model: Admin
    },
    apps: {
      driver: 'sequelize',
      model: null
    }
  }
}