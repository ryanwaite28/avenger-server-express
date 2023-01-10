import { Router } from 'express';
import { QuestionRequestHandler } from '../request-handlers/question.handler';



export const QuestionRouter: Router = Router({ mergeParams: true });