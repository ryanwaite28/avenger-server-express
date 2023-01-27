import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../enums/http-codes.enum';



export function IdsAreDifferentCurry(param_name_1: string, param_name_2: string, error_message?: string) {
  return function IdsAreDifferentCurryInner(request: Request, response: Response, next: NextFunction) {
    const id_1 = parseInt(request.params[param_name_1], 10);
    const id_2 = parseInt(request.params[param_name_2], 10);

    if (id_1 === id_2) {
      return response.status(HttpStatusCode.FORBIDDEN).json({
        message: error_message || `id params cannot be the same`
      });
    }

    return next();
  }
}