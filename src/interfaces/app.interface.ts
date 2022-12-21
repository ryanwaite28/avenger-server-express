import { BuildOptions } from 'sequelize';
import { Model } from 'sequelize';
import { PlainObject } from './common.interface';







export interface IUserSubscriptionInfo {
  status: string,
  active: boolean,
  current_period_start: number,
  current_period_end: number,
}

export interface ICommonModel extends PlainObject {
  id:                      number,
  uuid:                    string,
  created_at:              string,
  updated_at:              string,
  deleted_at:              string,
}


export interface IUserExpoDevice extends ICommonModel {
  user_id:              number,
  token:                string,
  device_info:          string,
  device_id:            string,
  device_type:          string,
  device_platform:      string,
}


export interface IUser extends ICommonModel {
  username: string,
  displayname: string,
  email: string,
  password: string,
  phone: string | null,

  stripe_customer_account_id: string | null,
  stripe_account_id: string | null,
  stripe_account_verified: boolean,
  platform_subscription_id: string | null,

  headline: string,
  bio: string,
  tags: string,
  icon_link: string | null,
  icon_id: string | null,

  id_card_front_link: string | null,
  id_card_front_id: string | null,
  id_card_back_link: string | null,
  id_card_back_id: string | null,

  photo_id_link: string | null,
  photo_id_id: string | null,
  wallpaper_link: string | null,
  wallpaper_id: string | null,
  
  allow_messaging: boolean,
  allow_conversations: boolean,
  
  location: string | null,
  location_id: string | null,
  location_json: string,
  zipcode: string | null,
  city: string | null,
  state: string | null,
  county: string | null,
  country: string | null,
  lat: number | null,
  lng: number | null,

  public: boolean,
  online: boolean,
  cerified: boolean,
  person_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
  can_message: boolean,
  can_converse: boolean,
  notifications_last_opened: string,

  expo_devices?: IUserExpoDevice[],
}

export interface IUserNotificationsLastOpened extends ICommonModel {
  user_id:                             number,
  notifications_last_opened:           string,
}

export interface IUserField extends ICommonModel {
  user_id:              number,
  fieldname:            string,
  fieldtype:            string,
  fieldvalue:           string,
}

export interface IUsersEmailVerification extends ICommonModel {
  user_id:                 number,
  email:                   string,
  verification_code:       string,
  verified:                boolean,
}

export interface IUsersPhoneVerification extends ICommonModel {
  user_id:                 number,
  request_id:              string,
  phone:                   string,
  verification_code:       string,
}

export interface IResetPasswordRequest extends ICommonModel {
  user_id:             number,
  completed:           boolean,
  unique_value:        string,
}

export interface IAccountReported extends ICommonModel {
  user_id:             number,
  reporting_id:        number,
  issue_type:          string,
  details:             string,
}

export interface ISiteFeedback extends ICommonModel {
  user_id:             number,
  rating:              number,
  title:               string,
  summary:             string,
}

export interface IResetPasswordRequest extends ICommonModel {
  user_id:                 number,
  completed:               boolean,
  unique_value:            string,
}

export interface INotification extends ICommonModel {
  from_id:                 number,
  to_id:                   number,
  event:                   string,
  target_type:             string,
  target_id:               number,
  read:                    boolean,
  image_link:              string,
  image_id:                string,
  
  message?:                string,
  link?:                   string,
  [key:string]:            any;
}

export interface IUserExpressDevice extends ICommonModel {
  user_id:              number,
  token:                string,
  device_info:          string,
  device_id:            string,
  device_type:          string,
  device_platform:      string,
}

export interface IToken extends ICommonModel {
  user_id:                 number,
  device:                  string,
  token:                   string,
  ip_address:              string,
  user_agent:              string,
  date_last_used:          string,
}

export interface IApiKey extends ICommonModel {
  user_id:             number | null,
  key:                 string,
  firstname:           string,
  middlename:          string,
  lastname:            string,
  email:               string,
  phone:               string,
  website:             string,
  subscription_plan:   string,

  user?: IUser;
}

export interface ApiKeyInvoice extends ICommonModel {
  key_id:              number,
  invoice_id:          number,
  status:              string,
}

export interface IApiKeyAllowedOrigin extends ICommonModel {
  key_id:              number,
  origin:              string,
}

export interface IApiKeyRequest extends ICommonModel {
  key_id:              number,
  request_url:         string,
  request_headers:     string,
  request_body:        string,
  resource:            string,
  response:            number,
  results:             string,
}

