import { Request, Response, NextFunction } from "express";
import { ApiKey, ApiKeyRequest } from "../models/avenger.model";
import { HttpStatusCode } from "../enums/http-codes.enum";


export async function ValidateApiRequest (request: Request, response: Response, next: NextFunction) {
  // check if key was provided
  const key: string = request.get(`API-KEY`);
  if (!key) {
    return response.status(HttpStatusCode.UNAUTHORIZED).json({
      message: `API-KEY header is missing or had no value`
    });
  }

  // check if api key exists
  const apiKeyModel = await ApiKey.findOne({ where: { key } });
  if (!apiKeyModel) {
    return response.status(HttpStatusCode.UNAUTHORIZED).json({
      message: `API-KEY is invalid`
    });
  }

  console.log(`Api Key:`, apiKeyModel.dataValues);

  // log the api request
  const logEntryOptions = {
    api_key_id: apiKeyModel.dataValues.id,

    url: request.url,
    method: request.method,
    headers: JSON.stringify(request.headers),
    cookies: JSON.stringify(request.cookies),
    body: JSON.stringify(request.body),
    files: request.files?.length || 0
  };
  const newRequestLog = await ApiKeyRequest.create(logEntryOptions);

  console.log(`Api Key Request:`, newRequestLog.dataValues);

  // continue through with request
  return next();
}