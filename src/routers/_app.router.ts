
import { Router } from 'express';
import { corsMiddleware, corsMobileMiddleware } from '../utils/constants.utils';
import { UsersRouter } from './users.router';
import { CommonRouter } from './common.router';


export const AppRouter: Router = Router({ mergeParams: true });
export const WebRouter: Router = Router({ mergeParams: true });
export const MobileRouter: Router = Router({ mergeParams: true });

const enable_web_cors = (process.env.APP_ENV !== `LOCAL`);
console.log({ enable_web_cors });



/* 
  Web router
*/
if (true) {
  WebRouter.options(`*`, corsMiddleware);
  WebRouter.use(corsMiddleware);
}
WebRouter.use('/users', UsersRouter);
// WebRouter.use('/deliveries', DeliveriesRouter);
WebRouter.use('/common', CommonRouter);


/* 
  Mobile router
*/
MobileRouter.use(corsMobileMiddleware);
MobileRouter.use('/users', UsersRouter);
// MobileRouter.use('/deliveries', DeliveriesRouter);
MobileRouter.use('/common', CommonRouter);




AppRouter.use(`/web`, WebRouter);
AppRouter.use(`/mobile`, MobileRouter);
