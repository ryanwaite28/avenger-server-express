import {
  CookieOptions,
  Request,
  Response,
} from 'express';
import { generateJWT } from '../utils/helpers.utils';
import axios from 'axios';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { ServiceMethodResults, ServiceMethodAsyncResults, IPositionStackLocationData } from '../interfaces/common.interface';



const cookieOptions: CookieOptions = {
  httpOnly: false,
  path: `/`,
  // domain: process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? 'https://rmw-modern-client.herokuapp.com' : undefined,
  sameSite: 'none',
  secure: true,
  // expires: 
};



const positionstack_api: string = `http://api.positionstack.com/v1`;



export class UtilsService {
  static set_xsrf_token(response: Response): ServiceMethodResults {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `new xsrf-token cookie sent.`,
      }
    };
    return serviceMethodResults;
  }

  static get_google_maps_key(): ServiceMethodResults {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!key) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.SERVICE_UNAVAILABLE,
        error: true,
        info: {
          message: `Google maps instance/service is not available on this app right now; please try again later.`
        }
      };
      return serviceMethodResults;
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          key,
        }
      }
    };
    return serviceMethodResults;
  }

  static get_stripe_public_key(): ServiceMethodResults {
    const key = process.env.STRIPE_PK;
    
    if (!key) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.SERVICE_UNAVAILABLE,
        error: true,
        info: {
          message: `Could not get stripe public key...`
        }
      };
      return serviceMethodResults;
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          key,
        }
      }
    };
    return serviceMethodResults;
  }

  static async get_location_via_coordinates(lat: string,lng: string): ServiceMethodAsyncResults<IPositionStackLocationData> {
    console.log(`get_location_via_coordinates:`, { lat, lng });
    if (!lat) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Latitude is missing`
        }
      };
      return serviceMethodResults;
    }
    if (!lng) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Longiture is missing`
        }
      };
      return serviceMethodResults;
    }

    const endpoint: string = `${positionstack_api}/reverse?access_key=${process.env.POSITIONSTACK_APIKEY}&query=${lat},${lng}&limit=1&output=json`;
    
    try {
      const response = await axios.request({
        url: endpoint,
        method: `GET`,
      });

      console.log(response.data.data);
      
      const data: IPositionStackLocationData = response.data.data.results ? response.data.data.results[0] : response.data.data[0];
  
      const serviceMethodResults: ServiceMethodResults<IPositionStackLocationData> = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          data
        }
      };
      return serviceMethodResults;
    }
    catch (error) {
      console.log({ error });
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: `Could not process request...`,
          error
        }
      };
      return serviceMethodResults;
    }
  }
}