import cors, { CorsOptions } from "cors";



export const specialCaracters = ['!', '@', '#', '$', '%', '&', '+', ')', ']', '}', ':', ';', '?'];
export const codeCharacters = ['!', '@', '#', '$', '%', '&', '|', '*', ':', '-', '_', '+'];
export const allowedImages = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
export const isAppEnvSet: boolean = ('APP_ENV' in process.env);
export const isDevEnv: boolean = isAppEnvSet && process.env.APP_ENV === "DEV";
export const isProd: boolean = (process.env.NODE_ENV === 'production') && !isDevEnv;
export const WHITELIST_DOMAINS = process.env[`CORS_WHITELIST_ORIGINS`] ? process.env[`CORS_WHITELIST_ORIGINS`].split(',') : [];
export const VALID_RATINGS = new Set([1, 2, 3, 4, 5]);


export const user_attrs_slim = [
  'id',
  'username',
  'displayname',
  'public',
  'can_message',
  'can_converse',
  'stripe_customer_account_id',
  'stripe_account_id',
  'stripe_account_verified',
  'platform_subscription_id',
  'can_converse',
  'email',
  'phone',
  'bio',
  'headline',
  'icon_link',
  'uuid',
  'created_at',
  'updated_at',
  'deleted_at',
];


export const corsOptions: CorsOptions = {
  // https://expressjs.com/en/resources/middleware/cors.html
  credentials: true,
  optionsSuccessStatus: 200,
  origin(origin: string | undefined, callback: any) {
    const useOrigin = (origin || '');
    const originIsAllowed = WHITELIST_DOMAINS.includes(useOrigin);
    // console.log({
    //   origin,
    //   callback,
    //   originIsAllowed,
    //   whitelist_domains,
    // });

    if (originIsAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin "${origin}" Not allowed by CORS`));
    }
  }
};

export const corsMobileOptions: CorsOptions = {
  // https://expressjs.com/en/resources/middleware/cors.html
  credentials: true,
  optionsSuccessStatus: 200,
  origin(origin: string | undefined, callback: any) {
    // console.log(`mobile request:`, { origin });
    const useOrigin = (origin || '');
    const originIsAllowed = !useOrigin || WHITELIST_DOMAINS.includes(useOrigin);
    // console.log({
    //   origin,
    //   callback,
    //   originIsAllowed,
    //   whitelist_domains,
    // });

    if (originIsAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Mobile Origin "${origin}" Not allowed by CORS`));
    }
  }
};

export const corsApiOptions: CorsOptions = {
  // https://expressjs.com/en/resources/middleware/cors.html
  credentials: true,
  optionsSuccessStatus: 200,
  origin(origin: string | undefined, callback: any) {
    // console.log(`mobile request:`, { origin });
    const useOrigin = (origin || '');
    const originIsAllowed = !useOrigin || WHITELIST_DOMAINS.includes(useOrigin);
    // console.log({
    //   origin,
    //   callback,
    //   originIsAllowed,
    //   whitelist_domains,
    // });

    if (originIsAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`API Origin "${origin}" Not allowed by CORS`));
    }
  }
};

export const corsWebMiddleware = cors(corsOptions);
export const corsMobileMiddleware = cors(corsMobileOptions);
export const corsApiMiddleware = cors(corsApiOptions);
