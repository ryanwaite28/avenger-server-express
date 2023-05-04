import { Request, Response, NextFunction, CookieOptions } from "express";
import moment from "moment";
import { HttpStatusCode } from "../enums/http-codes.enum";
import { v1 as uuidv1 } from "uuid";



const CSRF_COOKIE = `CSRF-TOKEN`;
const CSRF_HEADER = `X-CSRF-TOKEN`;
const CSRF_SAFE_METHODS = ['GET', 'OPTIONS', 'HEAD'];


const cookieOptions: CookieOptions = {
  httpOnly: false,
  path: `/`,
  // domain: process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? 'https://rmw-modern-client.herokuapp.com' : undefined,
  sameSite: 'none',
  secure: true,
  // expires: moment().add(1, 'hour').toDate()
};

export function CsrfSetCookieMiddle(request: Request, response: Response, next: NextFunction) {
  const uuid = uuidv1();
  response.cookie(CSRF_COOKIE, uuid, cookieOptions);
  next();
}

export function CsrfAuthGuard(request: Request, response: Response, next: NextFunction) {
  const csrf_token_cookie = request.cookies[CSRF_COOKIE] || request.cookies[CSRF_COOKIE.toLowerCase()] || request.cookies[CSRF_COOKIE.toUpperCase()];
  const csrf_token_header = request.headers[CSRF_HEADER] || request.headers[CSRF_HEADER.toLowerCase()] || request.headers[CSRF_HEADER.toUpperCase()];

  const valid = csrf_token_header === csrf_token_cookie;
  const isSafeMethod = CSRF_SAFE_METHODS.includes(request.method.toUpperCase());
  
  console.log(`CSRF Validating:`, { isSafeMethod, csrf_token_cookie, csrf_token_header, valid, url: request.url, method: request.method });
  
  if (isSafeMethod) {
    return next();
  }
  if (!csrf_token_cookie) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `${CSRF_COOKIE} cookie not found on request.`
    });
  }
  if (!csrf_token_header) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `${CSRF_HEADER} header not found on request.`
    });
  }
  if (!valid) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `CSRF validation failed.`
    });
  }

  console.log(`CSRF Validation Successful; continuing request...`);

  next();
}