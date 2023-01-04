import { IUser } from "../interfaces/avenger.models.interface";
import { Model } from 'sequelize';
import {
  sign as jwt_sign,
  verify as jwt_verify
} from 'jsonwebtoken';
import {
  Request,
} from 'express';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { ServiceMethodResults } from '../interfaces/common.interface';
import { SKILL_NAME_REGEX } from "../regex/skill.regex";
import { AUTH_BEARER_HEADER_REGEX } from "../regex/common.regex";
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';



export const formatSkillName = (name: string): string => {
  const newName = name
    .replace(/[\s]{1,}/, ' ')
    .trim();
  console.log({ name, newName });
  return newName;
};

export const checkSkillName = (skill_name: string) => {
  if (!skill_name) {
    throw new Error(`No arg given...`);
  }

  const newSkillName: string = formatSkillName(skill_name);
  console.log(`transforming ${skill_name} to ${newSkillName}`);
  const invalidSkillName: boolean = !SKILL_NAME_REGEX.test(newSkillName);
  if (invalidSkillName) {
    throw new Error(`${newSkillName} did not pass regex...`);
  }

  return newSkillName;
};


export function uniqueValue() {
  return String(Date.now()) + '_' +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34);
}

export function uniqueApiKey () {
  const value = `${uuidv1()}_${uuidv4()}`;
  return 
}

export function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length < 2) {
    return str.toUpperCase();
  }
  const Str = str.toLowerCase();
  const capitalized = Str.charAt(0).toUpperCase() + Str.slice(1);
  return capitalized;
}

export function getRandomIndex(array: any[]) {
  const badInput = !array || !array.length;
  if (badInput) {
    return null;
  }
  const indexList = array.map((item, index) => index);
  const randomIndex = Math.floor(Math.random() * indexList.length);
  const item = indexList[randomIndex];
  return item;
}

export function getRandomItem(array: any[]) {
  const badInput = !array || !array.length;
  if (badInput) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  const item = array[randomIndex];
  return item;
}




export const check_model_args = async (options: {
  model_id?: number,
  model?: Model,
  model_name?: string,
  get_model_fn: (id: number) => Promise<Model | null>
}) => {
  const { model_id, model, model_name, get_model_fn } = options;
  const useName = model_name || 'model';

  if (!model_id && !model) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `${useName} id or model instance is required.`
      }
    };
    return serviceMethodResults;
  }
  const model_model: Model | null = model || await get_model_fn(model_id!);
  if (!model_model) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.NOT_FOUND,
      error: true,
      info: {
        message: `${useName} not found...`,
      }
    };
    return serviceMethodResults;
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: model_model,
    }
  };
  return serviceMethodResults;
};





export const convertModel = <T> (model: Model | null): T | null => {
  return model ? (<any> model.toJSON()) as T : null;
}

export const convertModels = <T> (models: Model[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}

export const convertModelCurry = <T> () => (model: Model | null): T | null => {
  return model ? (model.toJSON()) as T : null;
}

export const convertModelsCurry = <T> () => (models: Model[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}


export function generateJWT(data: any, secret?: string) {
  // console.log(`generateJWT:`, { data });
  try {
    const jwt_token = jwt_sign(data, secret || (<string> process.env.JWT_SECRET));
    return jwt_token || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function decodeJWT(token: any, secret?: string) {
  try {
    const data = jwt_verify(token, secret || (<string> process.env.JWT_SECRET));
    // console.log(`decodeJWT:`, { data });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function AuthorizeJWT(
  request: Request,
  checkUrlYouIdMatch: boolean = true,
  secret?: string,
): {
  error: boolean;
  status: HttpStatusCode;
  message: string;
  you?: IUser;
} {
  try {
    /* First, check Authorization header */
    const auth = request.get('Authorization');
    if (!auth) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: missing Authorization header`
      };
    }
    const isNotBearerFormat = !AUTH_BEARER_HEADER_REGEX.test(auth);
    if (isNotBearerFormat) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: Authorization header must be Bearer format`
      };
    }

    /* Check token validity */
    const token = auth.split(' ')[1];
    let you;
    try {
      you = decodeJWT(token, secret) || null;
    } catch (e) {
      console.log(e);
      you = null;
    }
    if (!you) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: invalid token`
      };
    }

    /* Check if user id match the `you_id` path param IF checkUrlIdMatch = true */
    if (checkUrlYouIdMatch) {
      const you_id: number = parseInt(request.params.you_id, 10);
      const notYou: boolean = you_id !== (<IUser> you).id;
      if (notYou) {
        return {
          error: true,
          status: HttpStatusCode.UNAUTHORIZED,
          message: `Request not authorized: You are not permitted to complete this action`
        };
      }
    }

    /* Request is okay */
    return {
      error: false,
      status: HttpStatusCode.OK,
      message: `user authorized`,
      you: (<IUser> you),
    };
  } catch (error) {
    console.log(`auth jwt error:`, error);
    return {
      error: true,
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: `Request auth failed...`
    };
  }
}
