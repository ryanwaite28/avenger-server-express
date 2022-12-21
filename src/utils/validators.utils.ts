import { UploadedFile } from "express-fileupload";
import { HttpStatusCode } from "../enums/http-codes.enum";
import { IModelValidator, PlainObject, ServiceMethodAsyncResults, ServiceMethodResults } from "../interfaces/common.interface";
import { IStoreImage, store_base64_image, store_image } from "./cloudinary-manager.utils";
import { allowedImages } from "./constants.utils";

export function validatePassword(password: string) {
  if (!password) { return false; }
  if (password.constructor !== String) { return false; }

  const hasMoreThanSixCharacters = password.length > 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  return (
    hasMoreThanSixCharacters
    && (hasUpperCase || hasLowerCase)
    // && hasNumbers
  );
}

export function validateEmail(email: string) {
  if (!email) { return false; }
  if (email.constructor !== String) { return false; }
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function validatePhone(phone?: string) {
  // https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  if (!phone) { return false; }
  if (typeof(phone) !== 'string') { return false; }
  const re = /^[\d]+$/;
  return re.test(phone.toLowerCase()) && (phone.length === 10 || phone.length === 11);
}

export function validateUsername(value: string): boolean {
  if (!value) { return false; }
  if (value.constructor !== String) { return false; }
  const re = /^[a-zA-Z0-9\-\_\.]{2,50}$/;
  return re.test(value.toLowerCase());
}

export function validateDisplayname(value: any): boolean {
  if (!value) { return false; }
  if (typeof (value) !== 'string') { return false; }
  return value.length > 1;
}

export function validateURL(value: any): boolean {
  if (!value) { return false; }
  if (value.constructor !== String) { return false; }
  const re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  return re.test(value.toLowerCase());
}

export function validatePersonName(value: any): boolean {
  if (!value) { return false; }
  if (value.constructor !== String) { return false; }
  const re = /^[a-zA-Z\s\'\-\_\.]{2,50}$/;
  return re.test(value.toLowerCase());
}

export function validateName(arg: string) {
  if (!arg) { return false; }
  if (arg.constructor !== String || typeof(arg) !== 'string') { return false; }
  const re = /^[a-zA-Z\'\-']{2,100}$/;
  const results = re.test(arg.toLowerCase());
  return results;
}




export const optionalValidatorCheck = (arg: any, fn: (arg: any) => boolean) => !arg || fn(arg);
export const requiredValidatorCheck = (arg: any, fn: (arg: any) => boolean) => !!arg && fn(arg);



export const genericTextValidator = (arg: any) => !!arg && typeof(arg) === 'string' && (/^[a-zA-Z0-9\s\'\-\_\.\@\$\#]{1,250}/).test(arg);
export const genericTextValidatorOptional = (arg: any) => !arg || genericTextValidator(arg);
export const phoneValidator = (arg: any) => (/^[0-9]{10,15}$/).test(arg);
export const stringValidator = (arg: any) => typeof(arg) === 'string';
export const numberValidator = (arg: any) => typeof(arg) === 'number';
export const booleanValidator = (arg: any) => typeof(arg) === 'boolean';
export const dateObjValidator = (arg: any) => typeof(arg) === 'object' && arg.constructor === Date;
export const notNullValidator = (arg: any) => arg !== null;



export const optional_textValidator = (arg: any) => {
  console.log({ arg });
  return optionalValidatorCheck(arg, genericTextValidator);
};
export const required_textValidator = (arg: any) => requiredValidatorCheck(arg, genericTextValidator);

export const optional_emailValidator = (arg: any) => optionalValidatorCheck(arg, validateEmail);
export const required_emailValidator = (arg: any) => requiredValidatorCheck(arg, validateEmail);

export const optional_phoneValidator = (arg: any) => optionalValidatorCheck(arg, phoneValidator);
export const required_phoneValidator = (arg: any) => requiredValidatorCheck(arg, phoneValidator);

export const optional_stringValidator = (arg: any) => optionalValidatorCheck(arg, stringValidator);
export const required_stringValidator = (arg: any) => requiredValidatorCheck(arg, stringValidator);

export const optional_numberValidator = (arg: any) => optionalValidatorCheck(arg, numberValidator);
export const required_numberValidator = (arg: any) => requiredValidatorCheck(arg, numberValidator);

export const optional_booleanValidator = (arg: any) => optionalValidatorCheck(arg, booleanValidator);
export const required_booleanValidator = (arg: any) => requiredValidatorCheck(arg, booleanValidator);

export const optional_notNullValidator = (arg: any) => optionalValidatorCheck(arg, notNullValidator);
export const required_notNullValidator = (arg: any) => requiredValidatorCheck(arg, notNullValidator);



export const STRIPE_CUSTOMER_ID_VALIDATOR = (arg: any) => !!arg && typeof(arg) === 'string' && (/^cus_[a-zA-Z0-9]{19,35}/).test(arg);
export const STRIPE_PAYMENT_METHOD_ID_VALIDATOR = (arg: any) => !!arg && typeof(arg) === 'string' && (/^pm_[a-zA-Z0-9]{19,35}/).test(arg);




export const createGenericServiceMethodError = (message: string, status?: HttpStatusCode, error?: any): ServiceMethodResults => {
  const serviceMethodResults: ServiceMethodResults = {
    status: status || HttpStatusCode.BAD_REQUEST,
    error: true,
    info: {
      message,
      error,
    }
  };
  return serviceMethodResults;
};

export const createGenericServiceMethodSuccess = <T = any> (message?: string, data?: T): ServiceMethodResults => {
  const serviceMethodResults: ServiceMethodResults<T> = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      message,
      data,
    }
  };
  return serviceMethodResults;
};



export const validateData = (options: {
  data: any,
  validators: IModelValidator[],
  mutateObj?: any
}): ServiceMethodResults => {
  const { data, validators, mutateObj } = options;
  const dataObj: any = {};

  for (const prop of validators) {
    if (!data.hasOwnProperty(prop.field)) {
      if (prop.optional) {
        if (prop.defaultValue) {
          dataObj[prop.field] = prop.defaultValue;
        }
        continue;
      }

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `${prop.name} is missing but is required.`
        }
      };
      return serviceMethodResults;
    }

    const isValid: boolean = prop.validator(data[prop.field]);
    if (!isValid) {
      const errorMessage: string = prop.errorMessage ? `${prop.name} ${prop.errorMessage}` : `${prop.name} is invalid.`;
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: errorMessage
        }
      };
      return serviceMethodResults;
    }
    
    dataObj[prop.field] = data[prop.field];
  }

  if (mutateObj) {
    Object.assign(mutateObj, dataObj);
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      message: `validation passed.`,
      data: dataObj,
    }
  };
  return serviceMethodResults;
}

export const validateAndUploadImageFile = async (
  image_file: string | UploadedFile | undefined,
  options?: {
    treatNotFoundAsError: boolean,

    mutateObj?: PlainObject,
    id_prop?: string,
    link_prop?: string;
  }
): ServiceMethodAsyncResults => {
  if (!image_file) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: options && options.hasOwnProperty('treatNotFoundAsError') ? options.treatNotFoundAsError : true,
      info: {
        message: `No image file found/given`
      }
    };
    return serviceMethodResults;
  }



  let image_results: IStoreImage;
  
  if (typeof image_file === 'string') {
    // base64 string provided; attempt parsing...
    image_results = await store_base64_image(image_file);
  }
  else {
    const type = (<UploadedFile> image_file).mimetype.split('/')[1];
    const isInvalidType = !allowedImages.includes(type);
    if (isInvalidType) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'Invalid file type: jpg, jpeg or png required...'
        }
      };
      return serviceMethodResults;
    }
    image_results = await store_image(image_file);
  }

  if (!image_results.result) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      error: true,
      info: {
        message: 'Could not upload file...',
        data: image_results
      }
    };
    return serviceMethodResults;
  }

  if (options && options.mutateObj && options.id_prop && options.link_prop) {
    options.mutateObj[options.id_prop] = image_results.result.public_id;
    options.mutateObj[options.link_prop] = image_results.result.secure_url;
  }

  const serviceMethodResults: ServiceMethodResults<{
    image_results: any,
    image_id: string,
    image_link: string,
  }> = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: {
        image_results,
        image_id: image_results.result.public_id,
        image_link: image_results.result.secure_url
      }
    }
  };
  return serviceMethodResults;
};