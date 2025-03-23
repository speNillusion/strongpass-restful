export interface IUser {
  tokenSecretKey?: any;
  id?: string;
  name: string;
  email: string;
  pass: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  statusCode: number;
  message: string;
  acessToken?: string;
  data?: any;
  errors?: string[];
}

export interface ILoginResponse extends IUserResponse {
  accessToken?: string;
  refreshToken: string;
  valid: boolean;
}