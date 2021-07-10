import MainAuthService, { AuthServiceInterface } from "@root/app/main/services/AuthService";

const AuthService = MainAuthService.extend<AuthServiceInterface>({});

export default AuthService;