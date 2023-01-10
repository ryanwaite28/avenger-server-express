import { Router } from 'express';
import { NoticeRequestHandler } from '../request-handlers/notice.handler';



export const NoticeRouter: Router = Router({ mergeParams: true });