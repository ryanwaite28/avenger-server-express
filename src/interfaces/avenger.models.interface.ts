import { PlainObject } from './common.interface';






export interface IUserSubscriptionInfo {
  status: string,
  active: boolean,
  current_period_start: number,
  current_period_end: number,
}

export interface ICommonModel extends PlainObject {
  id: number,
  uuid: string,
  metadata: string,
  created_at: string,
  updated_at: string,
  deleted_at: string,
}

export interface ICoreModel extends ICommonModel {
  
}


export interface INoticeStats {
  replies_count: number,
  quotes_count: number,
  shares_count: number,
  reactions: PlainObject<number>,
  reactions_count: number,
  analytics_count: number,
  seen_count: number,
  details_expanded_count: number,
}

export interface INoticeUserAnalyticInfo {
  seen: IAnalytic,
  details_expanded: IAnalytic,
  replied: INotice,
  quoted: INotice,
  shared: INotice,
  reacted: IReaction,
}




export interface IInterviewStats {
  skills_count: number,
  interviewer_rating: {
    avg: number,
    count: number
  },
  interviewee_rating: {
    avg: number,
    count: number
  },
  comments_count: number,
  reactions: PlainObject<number>,
  reactions_count: number,
  analytics_count: number,
}

export interface IInterviewUserAnalyticInfo {
  seen: IAnalytic,
  details_expanded: IAnalytic,
  reacted: IReaction,
  commented: IReaction,
}



/** Base/Common Tables */

export interface IAnalytic extends ICoreModel {
  user_id: number,
  event: string | null,
}

export interface IMention extends ICoreModel {
  user_id: number,
  mentioned_id: number,
}

export interface IReaction extends ICoreModel {
  user_id: number,
  reaction_type: string,
}

export interface IComment extends ICoreModel {
  owner_id: number,
  body: string,
}

export interface IReply extends ICoreModel {
// reply depends on comment; no need for   owner_id: number,
  comment_id: number,
  body: string,
}

export interface IRating extends ICoreModel {
  writer_id: number,
  aspect: string | null,
  rating: number,
  title: string,
  summary: string,
  image_link: string | null,
  image_id: string | null,
}

export interface IContentSkill extends ICoreModel {
  skill_id: number,
}

export interface IPhoto extends ICoreModel {
  photo_id: string | null,
  photo_link: string | null,
  photo_bucket: string | null,
  photo_key: string | null,
}

export interface IVideo extends ICoreModel {
  video_id: string | null,
  video_link: string | null,
  video_bucket: string | null,
  video_key: string | null,
}

export interface IAudio extends ICoreModel {
  audio_id: string | null,
  audio_link: string | null,
  audio_bucket: string | null,
  audio_key: string | null,
}

export interface IField extends ICoreModel {
  fieldname: string,
  fieldvalue: string,
}

export interface IActionRequest extends ICoreModel {
  from_id: number,
  to_id: number,
  action: string,
  status: string,
}

export interface IFollow extends ICoreModel {
  user_id: number,
}



/** END Base/Common Tables */







/** admin models */

export interface IAdmin extends ICommonModel {
  firstname: string,
  middlename: string,
  lastname: string,
  icon_link: string | null,
  icon_id: string | null,
  email: string,
  password: string,
  phone: string | null,
  role: string,
  active: boolean,
}


/** END admin models */



/** user model */

export interface IUser extends ICommonModel {
  username: string,
  displayname: string,
  email: string,
  password: string,
  
  phone: string | null,
  temp_phone: string | null,
  stripe_customer_account_id: string | null,
  stripe_account_id: string | null,
  stripe_account_verified: boolean,
  platform_subscription_id: string | null,

  headline: string,
  bio: string,
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
  location_json: string | null,
  zipcode: string | null,
  city: string | null,
  state: string | null,
  county: string | null,
  country: string | null,

  public: boolean,
  online: boolean,
  cerified: boolean,
  person_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
  can_message: boolean,
  can_converse: boolean,
  allow_skill_submissions: boolean,
  notifications_last_opened: string,
}

export interface ISkill extends ICommonModel {
  name: string,
  status: string,
}

export interface ITag extends ICommonModel {
  name: string,
  status: string,
}


/** END user model */










export interface IUserEmailVerification extends ICommonModel {
  user_id: number,
  email: string,
  verification_code: string,
  verified: boolean,
}




export interface IUserPhoneVerification extends ICommonModel {
  user_id: number,
  request_id: string,
  phone: string,
  verification_code: string,
  verified: boolean,
}




export interface IUserExpoDevice extends ICommonModel {
  user_id: number,
  token: string,
  device_info: string | null,
  device_id: string,
  device_reaction_type: string,
  device_platform: string,
}




export interface IUserDevice extends ICommonModel {
  user_id: number,
  token: string,
  device_info: string | null,
  device_id: string,
  device_reaction_type: string,
  device_platform: string,
}




export interface IUserResetPasswordRequest extends ICommonModel {
  user_id: number,
  completed: boolean,
  unique_value: string,
}



export interface IUserNotification extends ICommonModel {
  from_id: number,
  to_id: number,
  event: string,
  target_type: string,
  target_id: number,
  read: boolean,
  image_link: string | null,
  image_id: string | null,
}




export interface IUserUserNotificationLastOpened extends ICommonModel {
  user_id: number,
  notifications_last_opened: string,
}




export interface IUserAccountHold extends ICommonModel {
  user_id: number,
  status: string,
  reason: string,
}




export interface IMessagingRequest extends ICommonModel {
  user_id: number,
  sender_id: number,
}




export interface IMessaging extends ICommonModel {
  user_id: number,
  sender_id: number,
}



export interface IMessage extends ICommonModel {
  from_id: number,
  to_id: number,
  body: string,
  opened: boolean,
}




/** stripe models */

export interface IStripeAction extends ICommonModel {
  user_id: number | null,
  action_event: string, // charge, refund, transfer
  action_id: string,
  action_metadata: string | null,
  target_reaction_type: string | null,
  target_id: number | null,
  target_metadata: string | null,
  status: string,
}






/** user notices (tweets) */

export interface INotice extends ICommonModel {
  owner_id: number,

  pinned_reply_id: number | null,
  parent_notice_id: number | null, // if this notice is a reply to another
  quoting_notice_id: number | null, // if this notice is quoting another
  share_notice_id: number | null, // if this notice is a share of another

  body: string | null,

  is_explicit: boolean,
  is_private: boolean,
  visibility: string,
}











/** interview models */

export interface IInterview extends ICommonModel {
  owner_id: number,
  interviewer_id: number | null,
  interviewee_id: number | null,
  title: string,
  description: string,
  industry: string | null,
  skills_accessed: string,
  view_state: string,
  is_private: boolean,
  private_access_fee: number | null,
  
  photo_id: string | null,
  photo_link: string | null,
  photo_bucket: string | null,
  photo_key: string | null,

  video_id: string | null,
  video_link: string | null,
  video_bucket: string | null,
  video_key: string | null,
}











/** question models */

// used for grouping question models
export interface IAssessment extends ICommonModel {
  owner_id: number,
  title: string,
  description: string,
  image_link: string | null,
  image_id: string | null,
}




export interface IQuestion extends ICommonModel {
  owner_id: number,
  assessment_id: number | null,
  difficulty: string | null,
  title: string,
  description: string,
  image_link: string | null,
  image_id: string | null,
}



export interface IAnswer extends ICommonModel {
  owner_id: number,
  question_id: number,
  title: string,
  description: string,
  video_link: string | null,
  video_id: string | null,
}






/** Misc */


export interface ISiteFeedback extends ICommonModel {
  user_id: number,
  rating: number,
  title: string,
  summary: string,
}




export interface IContentReported extends ICommonModel {
  user_id: number,
  target_user_id: number,
  target_type: string,
  target_id: number,
  category: string,
  title: string,
  summary: string,
}




export interface IApiKey extends ICommonModel {
  key: string,
  firstname: string,
  middlename: string | null,
  lastname: string,
  email: string,
  phone: string,
  website: string,
  verified: boolean,
}

export interface IApiKeyRequest extends ICommonModel {
  api_key_id: number,
  url: string,
  method: string | null,
  headers: string,
  cookie: string,
  body: string,
  files: number,
}




export interface INewsDataCache extends ICommonModel {
  name: string,
  json_data: string,
}

