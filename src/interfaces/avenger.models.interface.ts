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
  created_at: string,
  updated_at: string,
  deleted_at: string,
}









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



/** user models */

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
  notifications_last_opened: string,
}




export interface IUserField extends ICommonModel {
  user_id: number,
  fieldname: string,
  fieldvalue: string,
}



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
  device_type: string,
  device_platform: string,
}




export interface IUserDevice extends ICommonModel {
  user_id: number,
  token: string,
  device_info: string | null,
  device_id: string,
  device_type: string,
  device_platform: string,
}




export interface IUserResetPasswordRequest extends ICommonModel {
  user_id: number,
  completed: boolean,
  unique_value: string,
}




export interface IUserFollow extends ICommonModel {
  user_id: number,
  follow_id: number,
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




export interface IUserRating extends ICommonModel {
  user_id: number,
  writer_id: number,
  aspect: string | null,
  rating: number,
  title: string,
  summary: string,
  tags: string,
  image_link: string | null,
  image_id: string | null,
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




export interface IMessagePhoto extends ICommonModel {
  message_id: number,
  photo_link: string,
  photo_id: string,
}





/** stripe models */

export interface IStripeAction extends ICommonModel {
  action_event: string, // charge, refund, transfer
  action_id: string,
  action_metadata: string | null,
  target_type: string | null,
  target_id: number | null,
  target_metadata: string | null,
  status: string,
}


export interface IUserPaymentIntent extends ICommonModel {
  user_id: number,
  payment_intent_id: string,
  payment_intent_event: string,
  target_type: string | null,
  target_id: number | null,
  status: string,
}




export interface IUserCharge extends ICommonModel {
  user_id: number,
  charge_id: string,
  charge_event: string,
  
  target_type: string | null,
  target_id: number | null,
  status: string,
}




export interface IUserTransfer extends ICommonModel {
  user_id: number,
  transfer_id: string,
  transfer_event: string,
  
  target_type: string | null,
  target_id: number | null,
  status: string,
}




export interface IUserRefund extends ICommonModel {
  user_id: number,
  refund_id: string,
  refund_event: string,
  
  target_type: string | null,
  target_id: number | null,
  status: string,
}





/** skill models */

export interface ISkill extends ICommonModel {
  name: string,
  status: string,
}



export interface IUserSkill extends ICommonModel {
  skill_id: number,
  user_id: number,
  submitter_id: number | null,
}




export interface IUserSkillRating extends ICommonModel {
  skill_id: number,
  writer_id: number,
  aspect: string | null,
  rating: number,
  title: string,
  summary: string,
  tags: string,
  image_link: string,
  image_id: string,
}





/** interview models */

export interface IInterview extends ICommonModel {
  interviewer_id: number | null,
  interviewee_id: number | null,
  title: string,
  body: string,
  industry: string | null,
  tags: string,
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

// skills pertaining to interview
export interface IInterviewSkill extends ICommonModel {
  interview_id: number,
  skill_id: number,
}




export interface IInterviewerRating extends ICommonModel {
  interview_id: number,
  writer_id: number,
  rating: number,
  title: string,
  summary: string,
  image_link: string,
  image_id: string,
}




export interface IIntervieweeRating extends ICommonModel {
  interview_id: number,
  writer_id: number,
  rating: number,
  title: string,
  summary: string,
  image_link: string,
  image_id: string,
}






export interface IInterviewReaction extends ICommonModel {
  user_id: number,
  interview_id: number,
  type: string,
}





export interface IInterviewComment extends ICommonModel {
  user_id: number,
  interview_id: number,
  body: string,
}




export interface IInterviewCommentReaction extends ICommonModel {
  user_id: number,
  comment_id: number,
  type: string,
}




export interface IInterviewCommentReply extends ICommonModel {
  user_id: number,
  comment_id: number,
  body: string,
}




export interface IInterviewCommentReplyReaction extends ICommonModel {
  user_id: number,
  reply_id: number,
  type: string,
}







/** question models */

export interface IAssessment extends ICommonModel {
  owner_id: number,
  title: string,
  summary: string,
  image_link: string | null,
  image_id: string | null,
}




export interface IQuestion extends ICommonModel {
  owner_id: number,
  assessment_id: number | null,
  difficulty: string | null,
  title: string,
  summary: string,
  image_link: string | null,
  image_id: string | null,
}

// skills pertaining to question
export interface IQuestionSkill extends ICommonModel {
  question_id: number,
  skill_id: number,
}




export interface IAnswer extends ICommonModel {
  owner_id: number,
  question_id: number,
  title: string,
  summary: string,
  video_link: string | null,
  video_id: string | null,
}




export interface IAnswerReaction extends ICommonModel {
  user_id: number,
  answer_id: number,
  type: string,
}





export interface IAnswerComment extends ICommonModel {
  user_id: number,
  answer_id: number,
  body: string,
}




export interface IAnswerCommentReaction extends ICommonModel {
  user_id: number,
  comment_id: number,
  type: string,
}




export interface IAnswerCommentReply extends ICommonModel {
  user_id: number,
  comment_id: number,
  body: string,
}




export interface IAnswerCommentReplyReaction extends ICommonModel {
  user_id: number,
  reply_id: number,
  type: string,
}



export interface IAnswerRating extends ICommonModel {
  answer_id: number,
  writer_id: number,
  rating: number,
  title: string,
  summary: string,
  tags: string,
  image_link: string | null,
  image_id: string | null,
}





export interface ISiteFeedback extends ICommonModel {
  user_id: number,
  rating: number,
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
  requests_count: number,
}




export interface INewsDataCache extends ICommonModel {
  name: string,
  json_data: string,
}