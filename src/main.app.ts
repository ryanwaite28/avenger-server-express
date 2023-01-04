import * as dotenv from 'dotenv';
dotenv.config();



import express, { Request, Response } from 'express';
import { join } from 'path';
import { Server as io_server } from "socket.io";
import { ExpressPeerServer } from 'peer';
import { createServer, Server } from 'http';
import express_device from 'express-device';
import express_fileupload from 'express-fileupload';
import { json, urlencoded, raw } from 'body-parser';
import * as cookie_parser from 'cookie-parser';

import { SocketsService } from './services/sockets.service';
import { isProd, WHITELIST_DOMAINS } from './utils/constants.utils';
import { uniqueValue } from './utils/helpers.utils';
import { StripeService } from './services/stripe.service';
import { StripeWebhookEventsRequestHandler } from './services/stripe-webhook-events.service';
import { GatewayRouter } from './routers/_app.router';
import { avenger_db_init } from './models/_def.model';
import { installTemplatesExpressApp } from './utils/template-engine.utils';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';




/*

  Setup 

*/

const PORT: string | number = process.env.PORT || 80;
const app: express.Application = express();
app.set('trust proxy', true);


// install nunjucks templates on app instance
installTemplatesExpressApp(app);



// utility middlewares
app.use(express_fileupload({ debug: !isProd, safeFileNames: true, preserveExtension: true }));
app.use(express_device.capture());
app.use(cookie_parser.default());
app.use(json());
app.use(urlencoded({ extended: false }));



// request logger/analytics middleware
app.use(RequestLoggerMiddleware);



/** Static file declaration */
const publicPath = join(__dirname, '../_public');
const expressStaticPublicPath = express.static(publicPath);
app.use(expressStaticPublicPath);



// const peerServer = ExpressPeerServer(appServer, {
//   // debug: true,
//   path: '/modern-peer'
// });
// app.use('/peerjs', peerServer);
  
  

// setup socket io on app instance
const appServer = createServer(app);
const io: io_server = new io_server(appServer, {
  cors: { origin: WHITELIST_DOMAINS },

  allowRequest: (req, callback) => {
    console.log(`socket req origin: ${req.headers.origin}`);
    const useOrigin = (req.headers.origin || '');
    const originIsAllowed = !isProd || WHITELIST_DOMAINS.includes(useOrigin);
    console.log({ originIsAllowed });
    callback(null, originIsAllowed);
  }
});
io.engine.generateId = (req: any) => {
  return uniqueValue(); // must be unique across all Socket.IO servers
};

SocketsService.handle_io_connections(io);




// listen to stripe events via web-hook
app.post('/stripe-webhook', raw({ type: 'application/json' }), async (request: Request, response: Response) => {
  console.log(`-------stripe webhook request:-------`, request.body, request.headers);
  const stripe_signature = request.get('stripe-signature') ?? '';
  let event;
  
  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks/signatures for more information.
  try {
    event = StripeService.stripe.webhooks.constructEvent(request.body, stripe_signature, process.env.STRIPE_WEBHOOK_SIG!);
  }
  catch (err) {
    const errMsg = `Webhook Error: ${(<any> err).message}`;
    console.log(errMsg);
    return response.status(400).send(errMsg);
  }
  
  console.log(`stripe webhook event:`, { event });
  return StripeWebhookEventsRequestHandler.handleEvent(event, request, response);
});



// mount main gateway router to app instance
app.use(GatewayRouter);



/** init database */
console.log(`PORT = ${PORT}\n`);
console.log(`Connecting to database...\n`);
try {
  avenger_db_init().then(() => {
    console.log(`app db ready; starting app.`);
  
    /** Start Server */
    appServer.listen(PORT);
    console.log(`Listening on port ${PORT}...\n\n`);
  });  
} catch (error) {
  console.log(`db_init error...`, { error });
  throw error;
}
