import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { IUser } from '../interfaces/avenger.models.interface';
import { ExpressResponse, ServiceMethodResults, PlainObject } from '../interfaces/common.interface';
import { CatchRequestHandlerError } from '../decorators/service-method-error-handler.decorator';



export class QuestionRequestHandler {}