import { NextFunction, Request, Response } from "express";
import { validateData } from "../utils/validators.utils";
import { ExpressMiddlewareFn, IModelValidator, ServiceMethodResults } from "../interfaces/common.interface";




export function ValidateRequestBody(validators: IModelValidator[]): ExpressMiddlewareFn {

  return (request: Request, response: Response, next: NextFunction) => {
    const results: ServiceMethodResults<any> = validateData({ data: request.body, validators });

    if (results.error) {
      return response.status(results.status).json(results.info);
    }

    response.locals['validated_data'] = results.info.data;
    return next();
  };

}