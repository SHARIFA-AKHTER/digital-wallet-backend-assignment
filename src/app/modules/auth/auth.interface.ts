export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IResetPassword {
  oldPassword: string;
  newPassword: string;
}
