export interface UserSignUpDto {
  username: string,
  displayname: string,
  email: string,
  password: string,
}

export interface UserSignInDto {
  username_email: string,
  password: string,
}