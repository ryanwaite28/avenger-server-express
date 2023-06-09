import { Request } from 'express';
import Stripe from 'stripe';
import { Expo } from 'expo-server-sdk';
import { UploadedFile } from 'express-fileupload';
import {
  hashSync,
  compareSync
} from 'bcrypt-nodejs';
import {
  Op
} from 'sequelize';

import { TokensService } from './tokens.service';
import { AuthorizeJWT, uniqueValue } from '../utils/helpers.utils';
import { IUser, IUserSubscriptionInfo } from '../interfaces/avenger.models.interface';
import { ExpoPushUserNotificationsService } from './expo-notifications.service';
import { StripeService } from './stripe.service';
import { isProd } from '../utils/constants.utils';
import { validateAndUploadImageFile, validateEmail, validatePassword } from '../utils/validators.utils';
import { API_KEY_SUBSCRIPTION_PLAN } from '../enums/common.enum';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { ServiceMethodAsyncResults, ServiceMethodResults, PlainObject } from '../interfaces/common.interface';
import { delete_cloudinary_image } from '../utils/cloudinary-manager.utils';
import { send_email } from '../utils/email-client.utils';
import { send_verify_sms_request, cancel_verify_sms_request, check_verify_sms_request } from '../utils/sms-client.utils';
import { SignedUp_EMAIL, PasswordReset_EMAIL, PasswordResetSuccess_EMAIL, VerifyEmail_EMAIL } from '../utils/template-engine.utils';
import { UserResetPasswordRequest, SiteFeedback, User } from '../models/avenger.model';
import { UserSignUpDto } from '../dto/user.dto';
import {
  check_user_follow,
  create_user,
  create_user_api_key,
  create_user_follow,
  delete_user_follow,
  get_random_users,
  get_users_by_like_query,
  get_user_api_key, 
  get_user_by_email, 
  get_user_by_id, 
  get_user_by_phone, 
  get_user_by_stripe_customer_account_id, 
  get_user_by_uuid, 
  get_user_expo_devices, 
  get_user_expo_device_by_token, 
  register_expo_device_and_push_token, 
  remove_expo_device_from_user, 
  update_user
} from '../repos/users.repo';
import {
  create_email_verification, query_email_verification, update_email_verification
} from '../repos/email-verification.repo';






export class UsersService {

  /** Request Handlers */

  static async sign_up(data: UserSignUpDto, request_origin: string): ServiceMethodAsyncResults {
    const check_email = await get_user_by_email(data.email);
    if (check_email) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'Email already in use'
        }
      };
      return serviceMethodResults;
    }

    const check_username = await get_user_by_email(data.username);
    if (check_username) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'Username already in use'
        }
      };
      return serviceMethodResults;
    }
  
    /* Data Is Valid */
  
    const createInfo = {
      username: (data.username || uniqueValue()).toLowerCase(),
      displayname: data.displayname,
      email: data.email.toLowerCase(),
      password: hashSync(data.password),
    };
    console.log({ createInfo });
    let new_user_model: IUser | null = await create_user(createInfo);
    let new_user = new_user_model!;
    delete new_user.password;

    // create stripe customer account       stripe_customer_account_id
    const customer = await StripeService.stripe.customers.create({
      name: data.displayname,
      description: `Avenger Customer: ${data.displayname}`,
      email: new_user.email,
      metadata: {
        user_id: new_user.id,
      }
    });

    const updateUserResults = await update_user({ stripe_customer_account_id: customer.id }, { id: new_user.id });
    new_user_model = await get_user_by_id(new_user.id);
    new_user = new_user_model!;
  
    try {
      /** Email Sign up and verify */
      const new_email_verf_model = await create_email_verification({
        user_id: new_user.id,
        email: new_user.email
      });
      const new_email_verf: PlainObject = new_email_verf_model.get({ plain: true });

      const verify_link = (<string> request_origin).endsWith('/')
        ? (request_origin + 'verify-email/' + new_email_verf.verification_code)
        : (request_origin + '/verify-email/' + new_email_verf.verification_code);
      const email_subject = `${process.env.APP_NAME} - Signed Up!`;
      const userName = `${new_user.displayname}`;
      const email_html = SignedUp_EMAIL({
        ...new_user,
        name: userName,
        verify_link,
        appName: process.env.APP_NAME
      });

      // don't "await" for email response.
      const send_email_params = {
        to: new_user.email,
        name: userName,
        subject: email_subject,
        html: email_html
      };
      send_email(send_email_params)
        .then((email_results) => {
          console.log(`sign up email sent successfully to:`, data.email);
        })
        .catch((error) => {
          console.log({ email_error: error });
        });
    } catch (e) {
      console.log(`could not sent sign up email:`, e, { new_user });
    }

    // create JWT
    const jwt = TokensService.newUserJwtToken(new_user);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: 'Signed Up!',
        data: {
          online: true,
          you: new_user,
          token: jwt,
        }
      }
    };
    return serviceMethodResults;
  }

  static async sign_in(username_email: string, password: string): ServiceMethodAsyncResults {
    try {
      if (username_email) { username_email = username_email.toLowerCase(); }
      if (!username_email) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: 'Email Address/Username field is required'
          }
        };
        return serviceMethodResults;
      }

      if (!password) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: 'Password field is required'
          }
        };
        return serviceMethodResults;
      }

      const check_account_model = await User.findOne({
        where: {
          [Op.or]: [
            { email: username_email },
            { username: username_email }
          ]
        }
      });
      if (!check_account_model) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.UNAUTHORIZED,
          error: true,
          info: {
            message: 'Invalid credentials.'
          }
        };
        return serviceMethodResults;
      }
      try {
        const checkPassword = <string> check_account_model.get('password');
        const badPassword = compareSync(password, checkPassword!) === false;
        if (badPassword) {
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.UNAUTHORIZED,
            error: true,
            info: {
              message: 'Invalid credentials.'
            }
          };
          return serviceMethodResults;
        }
      } catch (e) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: true,
          info: {
            message: `could not process authentication/credentials, something went wrong...`,
            error: e,
          }
        };
        return serviceMethodResults;
      }

      const you = <IUser> check_account_model.get({ plain: true });
      delete you.password;
      
      // create JWT
      const jwt = TokensService.newUserJwtToken(you);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: 'Signed In!',
          data: {
            online: true,
            you: you,
            token: jwt,
          }
        }
      };
      return serviceMethodResults;
    } catch (e) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: `could not sign in, something went wrong...`,
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async get_users_by_like_query(query: string, exclude_user_id?: number) {
    if (!query) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Query is required`
        }
      };
      return serviceMethodResults;
    }

    const skill: IUser[] = await get_users_by_like_query(query, exclude_user_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skill
      }
    };
    return serviceMethodResults;
  }

  static async check_session(request: Request): ServiceMethodAsyncResults {
    try {
      const auth = AuthorizeJWT(request, false);
      let jwt = null;
      let is_subscription_active: boolean = false;

      console.log({ auth });

      if (!!auth.you) {
        const you_model: IUser = await get_user_by_id(auth.you.id);
        console.log({ you_model });
        auth.you = you_model;
        // jwt = TokensService.newUserJwtToken(auth.you);
        is_subscription_active = (await UsersService.is_subscription_active(auth.you)).info.data as boolean;
        const noCustomerAcct = !auth.you?.stripe_customer_account_id || auth.you?.stripe_customer_account_id === null;
        console.log({ noCustomerAcct });

        if (noCustomerAcct) {
          console.log(`Creating stripe customer account for user ${auth.you.id}...`);
          
          const userDisplayName = auth.you.displayname;

          // create stripe customer account       stripe_customer_account_id
          const customer = await StripeService.stripe.customers.create({
            name: userDisplayName,
            description: `Modern Apps Customer: ${userDisplayName}`,
            email: auth.you.email,
            metadata: {
              user_id: auth.you.id,
            }
          });

          const updateUserResults = await update_user({ stripe_customer_account_id: customer.id }, { id: auth.you.id });
          let new_user_model = await get_user_by_id(auth.you.id);
          let new_user = new_user_model!;
          auth.you = new_user;

          // create JWT
          jwt = TokensService.newUserJwtToken(auth.you);
        }

        // const stripe_acct_status = await StripeService.account_is_complete(auth.you.stripe_account_id);
        // console.log({ stripe_acct_status });
      }

      const serviceMethodResults: ServiceMethodResults = {
        status: auth.status,
        error: false,
        info: {
          message: auth.message,
          data: {
            ...auth,
            is_subscription_active,
            // token: jwt,
          },
        }
      };
      console.log(`check session:`, { serviceMethodResults });
      return serviceMethodResults;
    }
    catch (e) {
      console.log('error: ', e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          error: e,
          message: `could not check session`
        }
      };
      return serviceMethodResults;
    }
  }

  static async get_user_by_id(user_id: number): ServiceMethodAsyncResults {
    const user: IUser | null = await get_user_by_id(user_id);
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: user
      }
    };
    return serviceMethodResults;
  }

  static async get_user_by_phone(phone: string): ServiceMethodAsyncResults {
    const user: IUser | null = await get_user_by_phone(phone);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: user
      }
    };
    return serviceMethodResults;
  }

  static async send_feedback(options: {
    you: IUser,
    rating: number,
    title: string,
    summary: string,
  }): ServiceMethodAsyncResults {
    let { you, rating, title, summary } = options;

    if (!rating) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `rating is required`
        }
      };
      return serviceMethodResults;
    }
    if (!title) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `title is required`
        }
      };
      return serviceMethodResults;
    }
    if (!summary) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `summary is required`
        }
      };
      return serviceMethodResults;
    }

    const new_feedback_model = await SiteFeedback.create({
      rating,
      title,
      summary,
      user_id: you.id
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          message: `Feedback submitted successfully`,
          feedback: new_feedback_model,
          success: true
        }
      }
    };
    return serviceMethodResults;
  }


  static async get_account_info(user: IUser): ServiceMethodAsyncResults {
    try {
      const account: Stripe.Response<Stripe.Account> = await StripeService.stripe.accounts.retrieve({ stripeAccount: user.stripe_account_id });
      const account_balance: Stripe.Response<Stripe.Balance> = await StripeService.stripe.balance.retrieve({ stripeAccount: user.stripe_account_id });
      const is_subscription_active = (await UsersService.is_subscription_active(user)).info.data as boolean;

      const available = account_balance.available.reduce((acc, a) => acc + a.amount, 0);
      const instant_available = account_balance.instant_available?.reduce((acc, a) => acc + a.amount, 0) || 0;
      const pending = account_balance.pending?.reduce((acc, a) => acc + a.amount, 0) || 0;



      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          data: {
            account_balance,
            account,
            is_subscription_active,

            available,
            instant_available,
            pending,
          }
        }
      };
      return serviceMethodResults;
    } catch (e) {
      console.log(`get_account_info error:`, e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async stripe_login(user: IUser): ServiceMethodAsyncResults {
    try {
      const account_login_link = await StripeService.stripe.accounts.createLoginLink(
        user.stripe_account_id
      );

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          data: account_login_link
        }
      };
      return serviceMethodResults;
    } catch (e) {
      console.log(`account_login_link error:`, e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async get_user_api_key(user: IUser): ServiceMethodAsyncResults {
    let api_key = await get_user_api_key(user.id);

    if (!api_key) {
      api_key = await create_user_api_key({
        user_id: user.id,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        email: user.email,
        subscription_plan: API_KEY_SUBSCRIPTION_PLAN.FREE,
        phone: '',
        website: '',
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: api_key
      }
    };
    return serviceMethodResults;
  }

  static async get_user_customer_cards_payment_methods(stripe_customer_id: string): ServiceMethodAsyncResults {
    console.log(`get_user_customer_cards_payment_methods(stripe_customer_id: string)`, { stripe_customer_id });
    const paymentMethods = await StripeService.get_customer_cards_payment_methods(stripe_customer_id);
    console.log(`get_user_customer_cards_payment_methods(stripe_customer_id: string)`, { paymentMethodsData: paymentMethods });

    const serviceMethodResults: ServiceMethodResults<Stripe.PaymentMethod[]> = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: paymentMethods.data || []
      }
    };
    return serviceMethodResults;
  }
  
  static async add_card_payment_method_to_user_customer(stripe_customer_account_id: string, payment_method_id: string): ServiceMethodAsyncResults {
    let payment_method: Stripe.Response<Stripe.PaymentMethod>;
    const user = await get_user_by_stripe_customer_account_id(stripe_customer_account_id);
    if (!user) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `User not found by customer id: ${stripe_customer_account_id}`,
        }
      };
      return serviceMethodResults;
    }

    try {
      payment_method = await StripeService.stripe.paymentMethods.retrieve(payment_method_id);
      if (!payment_method) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Could not retrieve payment method by id: ${payment_method_id}`,
          }
        };
        return serviceMethodResults;
      }
    } catch (e) {
      console.log(e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not retrieve payment method by id: ${payment_method_id}`,
          data: {
            e
          }
        }
      };
      return serviceMethodResults;
    }

    if (payment_method.customer) {
      if (payment_method.customer === stripe_customer_account_id) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Payment method already attached to your customer account`,
          }
        };
        return serviceMethodResults;
      }
      else {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Payment method already attached another customer account`,
          }
        };
        return serviceMethodResults;
      }
    }

    let paymentMethod = await StripeService.stripe.paymentMethods.attach(
      payment_method.id,
      { customer: stripe_customer_account_id }
    );
    paymentMethod = await StripeService.stripe.paymentMethods.update(
      payment_method.id,
      { metadata: { user_id: user.id } }
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Payment method added successfully!`,
        data: paymentMethod
      }
    };
    return serviceMethodResults;
  }

  static async remove_card_payment_method_to_user_customer(stripe_customer_account_id: string, payment_method_id: string): ServiceMethodAsyncResults {
    let payment_method: Stripe.Response<Stripe.PaymentMethod>;

    try {
      payment_method = await StripeService.stripe.paymentMethods.retrieve(payment_method_id);
      if (!payment_method) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Could not retrieve payment method by id: ${payment_method_id}`,
          }
        };
        return serviceMethodResults;
      }
    } catch (e) {
      console.log(e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not retrieve payment method by id: ${payment_method_id}`,
          data: {
            e
          }
        }
      };
      return serviceMethodResults;
    }

    const user_payment_methods = await UsersService.get_user_customer_cards_payment_methods(stripe_customer_account_id);
    const payment_methods = user_payment_methods.info.data! as Stripe.PaymentMethod[];

    for (const pm of payment_methods) {
      if (pm.id === payment_method.id) {
        const paymentMethod = await StripeService.stripe.paymentMethods.detach(
          payment_method.id,
        );
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `Payment method removed successfully!`,
            data: paymentMethod
          }
        };
        return serviceMethodResults;
      }
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `Payment method not attached to customer`,
      }
    };
    return serviceMethodResults;
  }

  static async create_user_api_key(user: IUser): ServiceMethodAsyncResults {
    const api_key = await get_user_api_key(user.id);
    if (api_key) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `API Key already exists for user`,
          data: api_key,
        }
      };
      return serviceMethodResults;
    }

    const new_api_key = await create_user_api_key({
      user_id:             user.id,
      firstname:           user.firstname,
      middlename:          user.middlename,
      lastname:            user.lastname,
      email:               user.email,
      phone:               user.phone,
      website:             '',
      subscription_plan:   '',
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `New API key created`,
        data: new_api_key
      }
    };
    return serviceMethodResults;
  }
  
  static async get_random_users(limit: any): ServiceMethodAsyncResults {
    const limitIsValid = (/[0-9]+/).test(limit);
    const useLimit: number = limitIsValid
      ? parseInt(limit, 10)
      : 10;
    const users: IUser[] = await get_random_users(useLimit);
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: users
      }
    };
    return serviceMethodResults;
  }

  static async send_sms_verification(you: IUser, phone: string): ServiceMethodAsyncResults {
    try {
      if (!phone) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Phone number is required`
          }
        };
        return serviceMethodResults;
      }

      if (phone.toLowerCase() === 'x') {
        const updates = await update_user({ phone: null }, { id: you.id });
        const newYouModel = await get_user_by_id(you.id);
        const newYou = newYouModel!;
        delete newYou.password;

        const jwt = TokensService.newUserJwtToken(newYou);

        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `Phone number cleared successfully`,
            data: {
              updates,
              you: newYou,
              token: jwt,
            }
          }
        };
        return serviceMethodResults;
      }

      const phoneNumberIsOutOfRange = !(/^[0-9]{10,12}$/).test(phone);
      if (phoneNumberIsOutOfRange) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            data: {
              message: `Phone number is out of range; must be between 10-12 digits`,
            }
          }
        };
        return serviceMethodResults;
      }

      // check if there is abother user with phone number
      const check_phone = await get_user_by_phone(phone);
      if (check_phone) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.FORBIDDEN,
          error: true,
          info: {
            data: {
              message: `Phone number is already in use by another user account.`,
            }
          }
        };
        return serviceMethodResults;
      }

      // // check if there is a pending code
      // const check_sms_verf = await PhoneVerfRepo.query_phone_verification({ phone });
      // // if there is a result, delete it and make a new one
      // if (check_sms_verf) {
      //   await check_sms_verf.destroy();
      // }
      
      // send a new verification code
      let sms_results: PlainObject = await send_verify_sms_request(phone);
      console.log('sms_results', sms_results);
      if (sms_results.error_text) {
        try {
          console.log('canceling...', sms_results);
          await cancel_verify_sms_request(sms_results.request_id);

          sms_results = await send_verify_sms_request(phone);

          const updates = await update_user({ phone }, { id: you.id });
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.OK,
            error: false,
            info: {
              message: `SMS verification sent, check your phone!`,
              data: {
                updates,
                sms_results,
                sms_request_id: sms_results.request_id,
              }
            }
          };
          return serviceMethodResults;
        } catch (e) {
          console.log(`could not cancel...`, sms_results, e);
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.BAD_REQUEST,
            error: true,
            info: {
              message: `Could not send sms...`,
              error: e,
              data: {
                sms_results,
              }
            }
          };
          return serviceMethodResults;
        }
      } else {
        // sms sent successfully; store it on the request session
        // (<IRequest> request).session.sms_verification = sms_results;
        // (<IRequest> request).session.sms_phone = phone;

        const updates = await update_user({ temp_phone: phone }, { id: you.id });
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `SMS verification sent, check your phone!`,
            data: {
              // updates,
              sms_results,
              sms_request_id: sms_results.request_id,
            }
          }
        };
        return serviceMethodResults;
      }
    } catch (e) {
      console.log(`send_sms_verification error; something went wrong...`, e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `send_sms_verification error; something went wrong...`,
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async verify_sms_code(options: {
    you: IUser,
    request_id: string,
    code: string,
    phone: string,
  }): ServiceMethodAsyncResults {
    try {
      let { you, request_id, code, phone } = options;
      if (!request_id) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Verification request id is required`
          }
        };
        return serviceMethodResults;
      }
      if (!phone) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Phone number is required`
          }
        };
        return serviceMethodResults;
      }
      if (you.temp_phone !== phone) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Phone number given does not match original number requested`
          }
        };
        return serviceMethodResults;
      }
      if (!code) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Verification code is required`
          }
        };
        return serviceMethodResults;
      }

      // try to verify phone
      const sms_verify_results: PlainObject = await check_verify_sms_request({ request_id, code });
      console.log(sms_verify_results);
      if (sms_verify_results.error_text) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Invalid sms verification code`
          }
        };
        return serviceMethodResults;
      }

      const updates = await update_user({ phone: you.temp_phone, temp_phone: ``, phone_verified: true }, { id: you.id });
      const newYouModel = await get_user_by_id(you.id);
      const newYou = newYouModel!;
      delete newYou.password;

      const jwt = TokensService.newUserJwtToken(newYou);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Phone number verified and updated successfully`,
          data: {
            sms_verify_results,
            updates,
            you: newYou,
            token: jwt,
          }
        }
      };
      return serviceMethodResults;
    } catch (e) {
      console.log(`verify_sms_code error; something went wrong...`, e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `verify_sms_code error; something went wrong...`,
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async submit_reset_password_request(email: string, request_origin: string): ServiceMethodAsyncResults {
    if (!validateEmail(email)) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'Email input is not in valid format'
        }
      };
      return serviceMethodResults;
    }
    
    const user_result = await get_user_by_email(email);
    if (!user_result) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'No account found by that email'
        }
      };
      return serviceMethodResults;
    }

    const user = user_result!;
    const name = user.displayname;

    const email_subject = `${process.env.APP_NAME} - Password reset requested`;
    const link = request_origin.endsWith('/')
      ? (request_origin + 'modern/password-reset') 
      : (request_origin + '/modern/password-reset');

    let password_request_result = await UserResetPasswordRequest.findOne({
      where: {
        user_id: user.id,
        completed: false,
      } 
    });

    if (password_request_result) {
      const unique_value = password_request_result.get('unique_value');      
      const email_data = {
        link,
        unique_value,
        name,
      };
      console.log(`email_data`, email_data);
      let email_html = PasswordReset_EMAIL(email_data);
      const email_result = await send_email({
        to: user.email,
        name: name,
        subject: email_subject,
        html: email_html
      });
      console.log(`email_result`, email_result);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: 'A password reset has already been requested for this email. A copy has been sent.',
        }
      };
      return serviceMethodResults;
    }

    // send reset request email
    const new_reset_request = await UserResetPasswordRequest.create({ user_id: user.id });
    const unique_value = new_reset_request.get('unique_value');
    const email_data = {
      link,
      unique_value,
      name,
    };
    console.log(`email_data`, email_data);
    let email_html = PasswordReset_EMAIL(email_data);
    const email_result = await send_email({
      to: user.email,
      name: name,
      subject: email_subject,
      html: email_html
    });
    console.log(`email_result`, email_result);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: 'A password reset request has been sent to the provided email!',
      }
    };
    return serviceMethodResults;
  }

  static async submit_password_reset_code(code: string, request_origin: string): ServiceMethodAsyncResults {
    if(!code) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'reset code is required'
        }
      };
      return serviceMethodResults;
    }

    const request_result = await UserResetPasswordRequest.findOne({ where: { unique_value: code } });
    if (!request_result) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.NOT_FOUND,
        error: true,
        info: {
          message: 'Invalid code, no reset request found by that value'
        }
      };
      return serviceMethodResults;
    }
    if (request_result.get('completed')) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'Code has already been used.'
        }
      };
      return serviceMethodResults;
    }

    const user_result = await get_user_by_id(request_result.dataValues.user_id);
    if (!user_result) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `error loading user from reset request...`
        }
      };
      return serviceMethodResults;
    }

    const name = user_result?.displayname;
    const password = uniqueValue();
    const hash = hashSync(password);
    console.log({
      name,
      password,
      hash,
    });

    const update_result = await update_user({ password: hash }, { id: user_result.id });
    console.log({
      update_result
    });

    const request_updates = await request_result.update({ completed: true }, { fields: [`completed`] });

    // send new password email
    const link = request_origin.endsWith('/')
      ? (request_origin + 'modern/signin') 
      : (request_origin + '/modern/signin');
    const email_subject = `${process.env.APP_NAME} - Password reset successful!`;
    const email_html = PasswordResetSuccess_EMAIL({
      name,
      password,
      link 
    });

    const email_result = await send_email({
      to: user_result.email,
      name: name,
      subject: email_subject,
      html: email_html
    });
    console.log(`email_result`, email_result);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: 'The Password has been reset! Check your email.'
      }
    };
    return serviceMethodResults;
  }

  static async verify_email(verification_code: string): ServiceMethodAsyncResults {
    const email_verf_model = await query_email_verification({ verification_code });
    if (!email_verf_model) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Invalid verification code.`
        }
      };
      return serviceMethodResults;
    }

    const email_verf: PlainObject = email_verf_model.get({ plain: true });
    const user_model = await get_user_by_id(email_verf.user_id);
    if (!user_model) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Verification code corrupted: could not fetch user from code`
        }
      };
      return serviceMethodResults;
    }

    const user = user_model!;
    if (user.email_verified) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Already verified!`
        }
      };
      return serviceMethodResults;
    }

    const updates = await update_user(
      { email_verified: true },
      { id: email_verf.user_id }
    );
    const email_verf_updates = await update_email_verification(
      { verified: true },
      { verification_code }
    );

    user.email_verified = true;
    const jwt = TokensService.newUserJwtToken(user);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Email successfully verified!`,
        data: {
          updates,
          email_verf_updates,
          token: jwt
        }
      }
    };
    return serviceMethodResults;
  }

  static async update_info(options: {
    you: IUser,
    email: string,
    username: string,
    displayname: string,
    bio: string,
    headline: string,
    tags: string,

    can_message: boolean,
    can_converse: boolean,
    host: string,
  }): ServiceMethodAsyncResults {
    let {
      you,
      email,
      username,
      displayname,
      bio,
      headline,
      tags,

      can_message,
      can_converse,
      host,
    } = options;

    let email_changed = false;
    let paypal_changed = false;

    const updatesObj: PlainObject = {
      can_message,
      can_converse,
      displayname: displayname || '',
      bio: bio || '',
      headline: headline || '',
      tags: tags || '',
    };

    // check request data

    if (email) {
      const emailIsDifferent = you.email !== email;
      if (emailIsDifferent) {
        const check_email = await get_user_by_email(email);
        if (check_email) {
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.FORBIDDEN,
            error: true,
            info: {
              message: `Email is taken`
            }
          };
          return serviceMethodResults;
        } else {
          updatesObj.email = email;
          updatesObj.email_verified = false;
          email_changed = true;
        }
      }
    }

    if (username) {
      const usernameIsDifferent = you.username !== username;
      if (usernameIsDifferent) {
        const check_username = await get_user_by_email(username);
        if (check_username) {
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.FORBIDDEN,
            error: true,
            info: {
              message: 'Username already in use'
            }
          };
          return serviceMethodResults;
        } else {
          updatesObj.username = username;
        }
      }
    } else if (username === '') {
      updatesObj.username = '';
    }

    const updates = await update_user(updatesObj, { id: you.id });
    const newYouModel = await get_user_by_id(you.id);
    const newYou = newYouModel!;
    delete newYou.password;

    // check if phone/email changed

    if (email_changed) {
      const new_email_verf_model = await create_email_verification({
        user_id: newYou.id,
        email: newYou.email
      });
      const new_email_verf: PlainObject = new_email_verf_model.get({ plain: true });
  
      const verify_link = (<string> host).endsWith('/')
        ? (host + 'modern/verify-email/' + new_email_verf.verification_code)
        : (host + '/modern/verify-email/' + new_email_verf.verification_code);
      const email_subject = `${process.env.APP_NAME} - Email Changed`;
      const userName = newYou.firstname;
      const email_html = VerifyEmail_EMAIL({
        ...newYou,
        name: userName,
        verify_link,
        appName: process.env.APP_NAME
      });
  
      // don't "await" for email response.
      const send_email_params = {
        to: newYou.email,
        name: userName,
        subject: email_subject,
        html: email_html
      };
      send_email(send_email_params)
        .then((email_results) => {
          console.log({ email_results: email_results });
        })
        .catch((error) => {
          console.log({ email_error: error });
        }); 
    }

    const jwt = TokensService.newUserJwtToken(newYou);
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Info updated successfully`,
        data: {
          you: newYou,
          updates,
          token: jwt,
          email_changed,
        }
      }
    };
    return serviceMethodResults;
  }

  static async update_phone(options: {
    you: IUser,
    request_id: string,
    code: string,
    phone: string,
    sms_results: PlainObject,
  }): ServiceMethodAsyncResults {
    try {
      let { you, request_id, code, phone, sms_results } = options;

      if (!sms_results) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `no sms verification in progress...`
          }
        };
        return serviceMethodResults;
      }
      if (sms_results.request_id !== request_id) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `sms request_id is invalid...`
          }
        };
        return serviceMethodResults;
      }

      // try to verify phone
      const sms_verify_results: PlainObject = await check_verify_sms_request({ request_id, code });
      console.log(sms_verify_results);
      if (sms_verify_results.error_text) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Invalid sms verification code`,
            data: {
              sms_verify_results
            }
          }
        };
        return serviceMethodResults;
      }

      const updates = await update_user({ phone }, { id: you.id });
      const newYouModel = await get_user_by_id(you.id);
      const newYou = newYouModel!;
      delete newYou.password;

      const jwt = TokensService.newUserJwtToken(newYou);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Phone number updated successfully`,
          data: {
            sms_verify_results,
            updates,
            you: newYou,
            token: jwt,
          }
        }
      };
      return serviceMethodResults;
    } catch (e) {
      console.log('error:', e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: 'Could not update phone...',
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async update_password(options: {
    you: IUser,
    password: string,
    confirmPassword: string,
  }): ServiceMethodAsyncResults {
    try {
      let { you, password, confirmPassword } = options;
      if (!password) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Password field is required.`
          }
        };
        return serviceMethodResults;
      }
      if (!confirmPassword) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Confirm Password field is required.`
          }
        };
        return serviceMethodResults;
      }
      if (!validatePassword(password)) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: 'Password must be: at least 7 characters, upper and/or lower case alphanumeric'
          }
        };
        return serviceMethodResults;
      }
      if (password !== confirmPassword) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: 'Passwords must match'
          }
        };
        return serviceMethodResults;
      }
      // const checkOldPassword = compareSync(oldPassword, youModel!.get('password'));
      // const currentPasswordIsBad = checkOldPassword === false;
      // if (currentPasswordIsBad) {
      //   return response.status(HttpStatusCode.UNAUTHORIZED).json({
      //     error: true,
      //     message: 'Old password is incorrect.'
      //   });
      // }
  
      const hash = hashSync(password);
      const updatesObj = { password: hash };
      const updates = await update_user(updatesObj, { id: you.id });
      Object.assign(you, updatesObj);

      const jwt = TokensService.newUserJwtToken(you);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: 'Password updated successfully',
          data: {
            updates,
            you,
            token: jwt,
          }
        }
      };
      return serviceMethodResults;
    } catch (e) {
      console.log('error:', e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: 'Could not update password...',
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async update_icon(options: {
    you: IUser,
    icon_file: UploadedFile | undefined,
    should_delete: boolean,
  }): ServiceMethodAsyncResults {
    try {
      const { you, icon_file, should_delete } = options;
      const updatesObj = {
        icon_id: '',
        icon_link: ''
      };
      
      if (!icon_file) {
        // clear icon
        if (!should_delete) {
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.BAD_REQUEST,
            error: true,
            info: {
              message: `Picture file is required`,
            }
          };
          return serviceMethodResults;
        }

        const whereClause = { id: you.id };
        const updates = await update_user(updatesObj, whereClause);
        delete_cloudinary_image(you.icon_id);
    
        Object.assign(you, updatesObj);
        const user = { ...you };
        const jwt = TokensService.newUserJwtToken(user);
        delete user.password;

        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: 'Icon cleared successfully.',
            data: {
              you: user,
              updates,
              token: jwt,
            }
          }
        };
        return serviceMethodResults;
      }

      const imageValidation = await validateAndUploadImageFile(icon_file, {
        treatNotFoundAsError: true,
        mutateObj: updatesObj,
        id_prop: 'icon_id',
        link_prop: 'icon_link',
      });
      if (imageValidation.error) {
        return imageValidation;
      }
  
      const updates = await update_user(updatesObj, { id: you.id });
  
      const user = { ...you, ...updatesObj };
      // console.log({ updates, results, user });
      delete user.password;
      const jwt = TokensService.newUserJwtToken(user);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: 'Icon updated successfully.' ,
          data: {
            updates,
            you: user,
            token: jwt,
          }
        }
      };
      return serviceMethodResults;
    } catch (e) {
      console.log('error:', e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: 'Could not update icon...' ,
        }
      };
      return serviceMethodResults;
    }
  }

  static async update_wallpaper(options: {
    you: IUser,
    wallpaper_file: UploadedFile | undefined,
    should_delete: boolean,
  }): ServiceMethodAsyncResults {
    try {
      const { you, wallpaper_file, should_delete } = options;
      const updatesObj = {
        wallpaper_id: '',
        wallpaper_link: ''
      };

      if (!wallpaper_file) {
        // clear wallpaper
        if (!should_delete) {
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.BAD_REQUEST,
            error: true,
            info: {
              message: `Picture file is required`
            }
          };
          return serviceMethodResults;
        }

        const whereClause = { id: you.id };
        const updates = await update_user(updatesObj, whereClause);
        delete_cloudinary_image(you.wallpaper_id);
    
        Object.assign(you, updatesObj);
        const user = { ...you };
        delete user.password;
        const jwt = TokensService.newUserJwtToken(user);

        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: 'Wallpaper cleared successfully.',
            data: {
              updates,
              you: user,
              token: jwt,
            }
          }
        };
        return serviceMethodResults;
      }
  
      const imageValidation = await validateAndUploadImageFile(wallpaper_file, {
        treatNotFoundAsError: true,
        mutateObj: updatesObj,
        id_prop: 'wallpaper_id',
        link_prop: 'wallpaper_link',
      });
      if (imageValidation.error) {
        return imageValidation;
      }
      
      const whereClause = { id: you.id };
      const updates = await update_user(updatesObj, whereClause);
  
      Object.assign(you, updatesObj);
      const user = { ...you };
      delete user.password;
      const jwt = TokensService.newUserJwtToken(user);

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: 'Wallpaper updated successfully.',
          data: {
            updates,
            you: user,
            token: jwt,
          }
        }
      };
      return serviceMethodResults;
    } 
    catch (e) {
      console.log('error:', e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: 'Could not update wallpaper...',
          error: e,
        }
      };
      return serviceMethodResults;
    }
  }

  static async send_push_notification_to_user_expo_devices(params: {
    user_id: number,
    message: string,
  }) {
    const user_expo_devices = await get_user_expo_devices(params.user_id);

    let sent_count: number = 0;
    for (const expo_device of user_expo_devices) {
      //
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Push notification sent!`,
        data: {
          user_expo_devices,
          sent_count
        }
      }
    };
    return serviceMethodResults;
  }

  static async register_expo_device_and_push_token(you_id: number, data: PlainObject) {
    const expo_token: string = data.expo_token;
    const device_info: PlainObject = data.device_info;

    if (!expo_token) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not register device; no push token given`,
        }
      };
      return serviceMethodResults;
    }

    const check_registered = await get_user_expo_device_by_token(expo_token);
    if (check_registered) {
      if (check_registered.user_id === you_id) {
        // device already registered to user
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Push token already registered`,
            data: {
              registered: true,
            }
          }
        };
        return serviceMethodResults;
      }
      else {
        // token registered to another user; delete previous user and assign to this user
        await remove_expo_device_from_user(data.expo_token);
      }
    }

    if (!Expo.isExpoPushToken(expo_token)) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Push token ${expo_token} is not a valid Expo push token;`,
          data: {
            registered: true,
          }
        }
      };
      return serviceMethodResults;
    }

    const createParams = { user_id: you_id, token: expo_token, device_info }
    const new_push_token_registration = await register_expo_device_and_push_token(createParams);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Push notifications registered!`,
        data: new_push_token_registration
      }
    };
    return serviceMethodResults;
  }

  static async remove_expo_device_and_push_token(you_id: number, expo_token: string) {
    if (!expo_token) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not register device; no push token given`,
        }
      };
      return serviceMethodResults;
    }

    const check_registered = await get_user_expo_device_by_token(expo_token);
    if (!check_registered) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Push token not found`,
          data: {
            registered: true,
          }
        }
      };
      return serviceMethodResults;
    }

    const removed = await remove_expo_device_from_user(
      expo_token,
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Device removed`,
        data: removed
      }
    };
    return serviceMethodResults;
  }

  static async create_stripe_account(you_id: number, host: string, refreshUrl?: string, redirectUrl?: string): ServiceMethodAsyncResults {
    const you_model: IUser | null = await get_user_by_id(you_id);
    if (!you_model) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.NOT_FOUND,
        error: true,
        info: {
          message: `User not found`,
        }
      };
      return serviceMethodResults;
    }

    const you = you_model!;

    
    // fallback options
    const useUrl = isProd 
      ? `http://modernapps.ml/verify-stripe-account/${you.uuid}`
      : `http://modernapps.cf/verify-stripe-account/${you.uuid}`;

    const useHost = host?.endsWith('/') ? host.substr(0, host.length - 1) : host;
    const refresh_url = `${useHost}/users/${you.id}/settings`;
    const return_url = `${useHost}/users/${you.id}/verify-stripe-account`;
    
    const check_verified = await UsersService.verify_stripe_account(you, host, false, refreshUrl, redirectUrl);
    if (check_verified.status === HttpStatusCode.OK) {
      return check_verified;
    }

    let account, updates;

    if (!you.stripe_account_id) {
      account = await StripeService.stripe.accounts.create({
        type: 'express',
        email: you.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        }
      });
      updates = await update_user({ stripe_account_id: account.id }, { id: you.id });
    } else {
      account = await StripeService.stripe.accounts.retrieve(you.stripe_account_id);
    }

    // https://stripe.com/docs/connect/collect-then-transfer-guide
    const createOpts = {
      account: account.id,
      refresh_url: useUrl,
      return_url: useUrl,
      type: 'account_onboarding',
    } as any;
    console.log({ createOpts, host, refresh_url, return_url });
    const accountLinks = await StripeService.stripe.accountLinks.create(createOpts);

    const log = { updates, account, accountLinks };

    console.log(log, JSON.stringify(log));

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          onboarding_url: accountLinks.url,
        }
      }
    };
    return serviceMethodResults;
  }

  static async verify_stripe_account(user: IUser, host: string, createLinks: boolean, refreshUrl?: string, redirectUrl?: string): ServiceMethodAsyncResults {
    let you: IUser = { ...user };

    if (!you.stripe_account_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.PRECONDITION_FAILED,
        error: true,
        info: {
          message: `You must create a stripe account first and connect it with Modern Apps.`,
        }
      };
      return serviceMethodResults;
    }

    if (you.stripe_account_verified) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Your stripe account is verified and valid!`
        }
      };
      return serviceMethodResults;
    }

    const results = await StripeService.account_is_complete(you.stripe_account_id);
    console.log({ results });

    let accountLinks: PlainObject = {};

    const useUrl = isProd 
      ? `http://modernapps.ml/verify-stripe-account/${you.uuid}`
      : `http://modernapps.cf/verify-stripe-account/${you.uuid}`;

    if (!results.error) {
      await update_user({ stripe_account_verified: true }, { id: you.id });
      const you_updated = await get_user_by_id(you.id);
      you = you_updated!;
      // create JWT
      const jwt = TokensService.newUserJwtToken(you);
      (<any> results).token = jwt;
      (<any> results).you = you;

      ExpoPushUserNotificationsService.sendUserPushUserNotification({
        user_id: you.id,
        message: `Your stripe account has been verified! If you don't see changes, log out and log back in.`,
      });
    }
    else if (createLinks) {
      const useHost = host?.endsWith('/') ? host.substr(0, host.length - 1) : host;
      const refresh_url = `${useHost}/users/${you.id}/settings`;
      const return_url = `${useHost}/users/${you.id}/verify-stripe-account`;
  
      const createOpts = {
        account: you.stripe_account_id,
        refresh_url: useUrl,
        return_url: useUrl,
        type: 'account_onboarding',
      } as any;
      console.log({ createOpts, host, refresh_url, return_url });
      const accountLinks = await StripeService.stripe.accountLinks.create(createOpts);

      console.log({ accountLinks });
    }


    const serviceMethodResults: ServiceMethodResults = {
      status: results.status,
      error: results.error,
      info: {
        message: results.message,
        data: {
          ...results,
          ...accountLinks,
          onboarding_url: accountLinks.url,
        }
      }
    };
    return serviceMethodResults;
  }

  static async verify_stripe_account_by_uuid(user_uuid: string, host: string, createLinks?: boolean, refreshUrl?: string, redirectUrl?: string): ServiceMethodAsyncResults {
    if (!user_uuid) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Verification code not given`,
        }
      };
      return serviceMethodResults;
    }

    const check_you: IUser | null = await get_user_by_uuid(user_uuid);
    if (!check_you) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Verification code invalid`,
        }
      };
      return serviceMethodResults;
    }
    
    let you: IUser = { ...check_you };

    if (!you.stripe_account_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.PRECONDITION_FAILED,
        error: true,
        info: {
          message: `You must create a stripe account first and connect it with Modern Apps.`,
        }
      };
      return serviceMethodResults;
    }

    if (you.stripe_account_verified) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Your stripe account is verified and valid!`,
          data: {
            verified: true,
          }
        }
      };
      return serviceMethodResults;
    }

    const results = await StripeService.account_is_complete(you.stripe_account_id);
    console.log({ results });

    let accountLinks: PlainObject = {};

    const useUrl = isProd 
      ? `http://modernapps.ml/verify-stripe-account/${you.uuid}`
      : `http://modernapps.cf/verify-stripe-account/${you.uuid}`;

    if (!results.error) {
      await update_user({ stripe_account_verified: true }, { id: you.id });
      const you_updated = await get_user_by_id(you.id);
      you = you_updated!;
      // create JWT
      const jwt = TokensService.newUserJwtToken(you);
      (<any> results).token = jwt;
      (<any> results).you = you;

      ExpoPushUserNotificationsService.sendUserPushUserNotification({
        user_id: you.id,
        message: `Your stripe account has been verified! If you don't see changes, log out and log back in.`,
      });
    }
    else if (createLinks) {
      const useHost = host?.endsWith('/') ? host.substr(0, host.length - 1) : host;
      const refresh_url = `${useHost}/users/${you.id}/settings`;
      const return_url = `${useHost}/users/${you.id}/verify-stripe-account`;
  
      const createOpts = {
        account: you.stripe_account_id,
        refresh_url: useUrl,
        return_url: useUrl,
        type: 'account_onboarding',
      } as any;
      console.log({ createOpts, host, refresh_url, return_url });
      const accountLinks = await StripeService.stripe.accountLinks.create(createOpts);

      console.log({ accountLinks });
    }


    const serviceMethodResults: ServiceMethodResults = {
      status: results.status,
      error: results.error,
      info: {
        message: results.message,
        data: {
          ...results,
          ...accountLinks,
          onboarding_url: accountLinks.url,
        }
      }
    };
    return serviceMethodResults;
  }

  static async verify_customer_has_card_payment_method(user: IUser): ServiceMethodAsyncResults {
    const results = await StripeService.customer_account_has_card_payment_method(user.stripe_customer_account_id);
    console.log({ results });

    const serviceMethodResults: ServiceMethodResults = {
      status: results.status,
      error: results.error,
      info: {
        data: results
      }
    };
    return serviceMethodResults;
  }

  static async is_subscription_active(user: IUser): ServiceMethodAsyncResults<boolean> {
    const is_subscription_active = await StripeService.is_subscription_active(user?.platform_subscription_id);

    const serviceMethodResults: ServiceMethodResults<boolean> = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: is_subscription_active
      }
    };
    return serviceMethodResults;
  }

  static async get_subscription(user: IUser): ServiceMethodAsyncResults {
    const subscription = await StripeService.get_subscription(user?.platform_subscription_id);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: subscription
      }
    };
    return serviceMethodResults;
  }

  static async get_subscription_info(user: IUser): ServiceMethodAsyncResults {
    const subscription = await StripeService.get_subscription(user?.platform_subscription_id);
    const data: IUserSubscriptionInfo | null = subscription && {
      status: subscription.status,
      active: (await UsersService.is_subscription_active(user)).info.data as boolean,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async create_subscription(
    you: IUser,
    payment_method_id: string
  ): ServiceMethodAsyncResults {

    if (you.platform_subscription_id) {
      const is_subscription_active = (await UsersService.is_subscription_active(you)).info.data as boolean;
      if (is_subscription_active) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `User already has active subscription`
          }
        };
        return serviceMethodResults;
      }

    }

    const user_payment_methods = await UsersService.get_user_customer_cards_payment_methods(you?.stripe_customer_account_id);
    const payment_methods = user_payment_methods.info.data! as Stripe.PaymentMethod[];
    let isValid = false;

    for (const pm of payment_methods) {
      if (pm.id === payment_method_id) {
        isValid = true;
        break;
      }
    }
    if (!isValid) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Payment method does not belong to user's customer account`
        }
      };
      return serviceMethodResults;
    }
    
    const new_subscription = await StripeService.create_subscription(you?.stripe_customer_account_id, payment_method_id);
    if (!new_subscription) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not create subscription...`
        }
      };
      return serviceMethodResults;
    }

    const updates = await update_user({ platform_subscription_id: new_subscription.id }, { id: you.id });
  
    const newUYou = { ...you, platform_subscription_id: new_subscription.id };
    // console.log({ updates, results, user });
    delete newUYou.password;
    const jwt = TokensService.newUserJwtToken(newUYou);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          token: jwt,
          subscription: new_subscription,
          you: newUYou
        }
      }
    };
    return serviceMethodResults;
  }

  static async cancel_subscription(
    user: IUser,
  ): ServiceMethodAsyncResults {

    if (!user?.platform_subscription_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `User does not have subscription`
        }
      };
      return serviceMethodResults;
    }
    
    const subscription = await StripeService.cancel_subscription(user?.platform_subscription_id);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: subscription
      }
    };
    return serviceMethodResults;
  }

  static async check_user_follow(user_id: number, follow_id: number) {
    const check = await check_user_follow(user_id, follow_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: check
      }
    };
    return serviceMethodResults;
  }

  static async toggle_user_follow(user_id: number, follow_id: number) {
    if (user_id === follow_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `IDs cannot be the same`
        }
      };
      return serviceMethodResults;
    }

    let check = await check_user_follow(user_id, follow_id);
    let message: string = '';

    if (check) {
      // user is following; unfollow
      const deletes = await delete_user_follow(user_id, follow_id);
      check = null;
      message = `Unfollowed`;
    }
    else {
      // user is not following; follow
      check = await create_user_follow(user_id, follow_id);
      message = `Followed`;
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message,
        data: check
      }
    };
    return serviceMethodResults;
  }
}
