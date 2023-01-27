import { NextFunction, Request, Response } from 'express';
import { User } from '../models/avenger.model';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { IUser } from '../interfaces/avenger.models.interface';
import { get_user_by_email, get_user_by_id, get_user_by_username } from '../repos/users.repo';
import { user_attrs_slim } from '../utils/constants.utils';
import { AuthorizeJWT } from '../utils/helpers.utils';
import { ServiceMethodResults } from '../interfaces/common.interface';



/*
  Assume this guard comes after validation guard(s)
*/

export async function EmailNotInUseGuard(request: Request, response: Response, next: NextFunction) {
  const email: string = response.locals['dto'].email;
  
  const check = await get_user_by_email(email);
  if (check) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: 'Email already in use'
      }
    };
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  return next();
}


export async function UsernameNotInUseGuard(request: Request, response: Response, next: NextFunction) {
  const username: string = response.locals['dto'].username;
  
  const check = await get_user_by_username(username);
  if (check) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: 'Username already in use'
      }
    };
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  return next();
}