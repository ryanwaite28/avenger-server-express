import { Router } from 'express';
import { InterviewRequestHandler } from '../request-handlers/interview.handler';



export const InterviewRouter: Router = Router({ mergeParams: true });