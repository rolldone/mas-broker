import BaseService from "./BaseService";

export interface AuthServiceInterface extends BaseServiceInterface {}

const AuthService = BaseService.extend<AuthServiceInterface>({});

export default AuthService;