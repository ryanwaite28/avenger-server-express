
import { Router } from 'express';
import {
  corsWebMiddleware,
  corsMobileMiddleware,
  corsApiMiddleware,
  WHITELIST_DOMAINS
} from '../utils/constants.utils';
import { UsersRouter } from './users.router';
import { CommonRouter } from './common.router';
import { InterviewRouter } from './interview.router';
import { AdminRouter } from './admin.router';
import { SkillRouter } from './skill.router';
import { QuestionRouter } from './question.router';
import { AssessmentRouter } from './assessment.router';
import { ValidateApiRequest } from '../middlewares/api-client-validation.middleware';
import { NoticeRouter } from './notice.router';
import { CsrfAuthGuard } from '../middlewares/csrf.middleware';



/**
  Mount app logic routers 
*/

export const AppRouter: Router = Router({ mergeParams: true });

AppRouter.use('/common', CommonRouter);

AppRouter.use('/admins', AdminRouter);
AppRouter.use('/users', UsersRouter);
AppRouter.use('/notices', NoticeRouter);
AppRouter.use('/skills', SkillRouter);
AppRouter.use('/interviews', InterviewRouter);
AppRouter.use('/assessments', AssessmentRouter);
AppRouter.use('/questions', QuestionRouter);







/* 
  Web router
*/
export const WebRouter: Router = Router({ mergeParams: true });
const enable_web_cors = (process.env.APP_ENV !== `LOCAL`);
console.log({ enable_web_cors, WHITELIST_DOMAINS });
if (true) {
  WebRouter.options(`*`, corsWebMiddleware);
  WebRouter.use(corsWebMiddleware);
}
WebRouter.use(`/web`, CsrfAuthGuard, AppRouter);



/* 
  Mobile router
*/
export const MobileRouter: Router = Router({ mergeParams: true });
MobileRouter.options(`*`, corsMobileMiddleware);
MobileRouter.use(corsMobileMiddleware);
MobileRouter.use(`/mobile`, AppRouter);



/* 
  Api router
*/
export const ApiRouter: Router = Router({ mergeParams: true });
MobileRouter.options(`*`, corsApiMiddleware);
MobileRouter.use(corsApiMiddleware);
ApiRouter.use(`/api`, ValidateApiRequest, AppRouter);



/**
  Consolidate all routers to single router
  
  each application instance can/should handle requests from any type of device or client
*/
export const GatewayRouter: Router = Router({ mergeParams: true });
GatewayRouter.use(WebRouter);
GatewayRouter.use(MobileRouter);
GatewayRouter.use(ApiRouter);
