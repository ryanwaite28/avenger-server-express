import validator from 'validator';

import { ExpressMiddlewareFn, IModelValidator } from "../interfaces/common.interface";
import { ValidateRequestBody } from "../middlewares/validator.middleware";
import { genericTextValidator, validateDisplayname, validatePassword, validateUsername } from "../utils/validators.utils";




export const user_signup_validation: IModelValidator[] = [
  { field: `username`, name: `Username`, errorMessage: `must be 2-50 characters, alphanumeric, dashes, underscores, periods`, validator: validateUsername },
  { field: `displayname`, name: `Display Name`, errorMessage: `must be at least 2 characters`, validator: validateDisplayname },
  { field: `email`, name: `Email`, errorMessage: `must be a valid email`, validator: validator.isEmail },
  { field: `password`, name: `Password`, errorMessage: `must be at least 7 characters, upper and/or lower case alphanumeric`, validator: validatePassword },
];
export const ValidateUserSignUpGuard: ExpressMiddlewareFn = ValidateRequestBody(user_signup_validation);


export const user_signin_validation: IModelValidator[] = [
  { field: `username_email`, name: `Username or Email`, validator: genericTextValidator },
  { field: `password`, name: `Password`, validator: genericTextValidator },
];
export const ValidateUserSignInGuard: ExpressMiddlewareFn = ValidateRequestBody(user_signin_validation);