import * as Sequelize from 'sequelize';
import { STATUSES } from '../enums/common.enum';
import { v4 as uuidv4 } from 'uuid';

import { AVENGER_ADMIN_ROLES, AVENGER_SKILL_STATUS, INTERVIEW_VIEW_STATE } from '../enums/avenger.enum';
import { MyModelStatic } from '../interfaces/common.interface';
import {
  common_model_options,
  common_model_fields,
  sequelizeInst as sequelize
} from './_def.model';






/** admin models */

export const Admin = <MyModelStatic> sequelize.define('Admin', {
  ...common_model_fields,

  firstname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  lastname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  icon_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  icon_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  email:               { type: Sequelize.STRING, allowNull: false },
  password:            { type: Sequelize.STRING, allowNull: false },
  phone:               { type: Sequelize.STRING, allowNull: true },
  role:                { type: Sequelize.STRING, allowNull: false, defaultValue: AVENGER_ADMIN_ROLES.ADMINISTRATOR },
  active:              { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
}, common_model_options);












/** user models */

export const User = <MyModelStatic> sequelize.define('User', {
  ...common_model_fields,

  username:                            { type: Sequelize.STRING, allowNull: false },
  displayname:                         { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:                               { type: Sequelize.STRING, allowNull: false },
  password:                            { type: Sequelize.STRING, allowNull: false },
  
  phone:                               { type: Sequelize.STRING, allowNull: true, defaultValue: null },
  temp_phone:                          { type: Sequelize.STRING, allowNull: true, defaultValue: null },
  stripe_customer_account_id:          { type: Sequelize.STRING, allowNull: true, defaultValue: null },
  stripe_account_id:                   { type: Sequelize.STRING, allowNull: true, defaultValue: null },
  stripe_account_verified:             { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  platform_subscription_id:            { type: Sequelize.STRING, allowNull: true, defaultValue: null },

  headline:                            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  bio:                                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  tags:                                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  icon_link:                           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  icon_id:                             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },

  id_card_front_link:                  { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  id_card_front_id:                    { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  id_card_back_link:                   { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  id_card_back_id:                     { type: Sequelize.STRING, allowNull: true, defaultValue: '' },

  photo_id_link:                       { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  photo_id_id:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  wallpaper_link:                      { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  wallpaper_id:                        { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  
  allow_messaging:                     { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  allow_conversations:                 { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  
  location:                            { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  location_id:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  location_json:                       { type: Sequelize.JSON, allowNull: true, defaultValue: '' },
  zipcode:                             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  city:                                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  state:                               { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  county:                              { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  country:                             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },

  public:                              { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  online:                              { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  cerified:                            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  person_verified:                     { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  email_verified:                      { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  phone_verified:                      { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  can_message:                         { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  can_converse:                        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  allow_skill_submissions:             { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  notifications_last_opened:           { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
}, {
  ...common_model_options,
  indexes: [{ unique: true, fields: ['email', 'uuid']} ] 
});




export const UserField = <MyModelStatic> sequelize.define('UserField', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  fieldname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  fieldvalue:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);



export const UserEmailVerification = <MyModelStatic> sequelize.define('UserEmailVerification', {
  ...common_model_fields,

  user_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  email:                   { type: Sequelize.STRING, allowNull: false },
  verification_code:       { type: Sequelize.STRING, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
  verified:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);




export const UserPhoneVerification = <MyModelStatic> sequelize.define('UserPhoneVerification', {
  ...common_model_fields,

  user_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  request_id:              { type: Sequelize.STRING, allowNull: false, unique: true },
  phone:                   { type: Sequelize.STRING, allowNull: false },
  verification_code:       { type: Sequelize.STRING, allowNull: false },
  verified:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);




export const UserExpoDevice = <MyModelStatic> sequelize.define('UserExpoDevice', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: Sequelize.JSON, allowNull: true, defaultValue: null },
  device_id:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_reaction_type:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserDevice = <MyModelStatic> sequelize.define('UserDevice', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: Sequelize.JSON, allowNull: true, defaultValue: null },
  device_id:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_reaction_type:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserResetPasswordRequest = <MyModelStatic> sequelize.define('UserResetPasswordRequest', {
  ...common_model_fields,

  user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  completed:           { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:        { type: Sequelize.STRING, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
}, common_model_options);




export const UserFollow = <MyModelStatic> sequelize.define('UserFollow', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  follow_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
}, common_model_options);




export const UserNotification = <MyModelStatic> sequelize.define('UserNotification', {
  ...common_model_fields,

  from_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:               { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  event:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  target_reaction_type:         { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  target_id:           { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  read:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  image_link:          { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_id:            { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
}, common_model_options);




export const UserUserNotificationLastOpened = <MyModelStatic> sequelize.define('UserUserNotificationLastOpened', {
  ...common_model_fields,

  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  notifications_last_opened:           { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
}, common_model_options);




export const UserAccountHold = <MyModelStatic> sequelize.define('UserAccountHold', {
  ...common_model_fields,

  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  reason:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserRating = <MyModelStatic> sequelize.define('UserRating', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  aspect:               { type: Sequelize.STRING, allowNull: true, defaultValue: true },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  tags:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
}, common_model_options);




export const MessagingRequest = <MyModelStatic> sequelize.define('MessagingRequest', {
  ...common_model_fields,

  user_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  sender_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
}, common_model_options);




export const Messaging = <MyModelStatic> sequelize.define('Messaging', {
  ...common_model_fields,

  user_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  sender_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
}, common_model_options);



export const Message = <MyModelStatic> sequelize.define('Message', {
  ...common_model_fields,

  from_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  body:               { type: Sequelize.TEXT, allowNull: false },
  opened:             { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);




export const MessagePhoto = <MyModelStatic> sequelize.define('MessagePhoto', {
  ...common_model_fields,

  message_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: Message, key: 'id' } },
  photo_link:          { type: Sequelize.STRING, allowNull: false },
  photo_id:            { type: Sequelize.STRING, allowNull: false },
}, common_model_options);











/** user notices (tweets) */

export const Notice = <MyModelStatic> sequelize.define('Notice', {
  ...common_model_fields,

  owner_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },

  parent_notice_id:    { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } }, // if this notice is a reply to another
  quoting_notice_id:   { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } }, // if this notice is quoting another
  share_notice_id:     { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } }, // if this notice is a share of another

  body:                { type: Sequelize.STRING(500), allowNull: true },
  tags:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },

  is_explicit:         { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  is_private:          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  visibility:          { type: Sequelize.STRING(75), allowNull: false, defaultValue: '' },
}, { ...common_model_options, tableName: `Notice`, modelName: `Notice` });

export const NoticePhoto = <MyModelStatic> sequelize.define('NoticePhoto', {
  ...common_model_fields,

  notice_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: Notice, key: 'id' } },

  photo_id:                  { type: Sequelize.TEXT, allowNull: true },
  photo_link:                { type: Sequelize.TEXT, allowNull: true },
  photo_bucket:              { type: Sequelize.TEXT, allowNull: true },
  photo_key:                 { type: Sequelize.TEXT, allowNull: true },
}, common_model_options);

export const NoticeVideo = <MyModelStatic> sequelize.define('NoticeVideo', {
  ...common_model_fields,

  notice_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: Notice, key: 'id' } },

  video_id:                  { type: Sequelize.TEXT, allowNull: true },
  video_link:                { type: Sequelize.TEXT, allowNull: true },
  video_bucket:              { type: Sequelize.TEXT, allowNull: true },
  video_key:                 { type: Sequelize.TEXT, allowNull: true },
}, common_model_options);

export const NoticeAudio = <MyModelStatic> sequelize.define('NoticeAudio', {
  ...common_model_fields,

  notice_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: Notice, key: 'id' } },

  audio_id:                  { type: Sequelize.TEXT, allowNull: true },
  audio_link:                { type: Sequelize.TEXT, allowNull: true },
  audio_bucket:              { type: Sequelize.TEXT, allowNull: true },
  audio_key:                 { type: Sequelize.TEXT, allowNull: true },
}, common_model_options);










/** stripe models */

export const StripeAction = <MyModelStatic> sequelize.define('StripeAction', {
  ...common_model_fields,

  action_event:                        { type: Sequelize.STRING, allowNull: false }, // charge, refund, transfer
  action_id:                           { type: Sequelize.STRING, allowNull: false },
  action_metadata:                     { type: Sequelize.JSON, allowNull: true, defaultValue: '' },
  target_reaction_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  target_metadata:                     { type: Sequelize.JSON, allowNull: true, defaultValue: '' },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);


export const UserPaymentIntent = <MyModelStatic> sequelize.define('UserPaymentIntent', {
  ...common_model_fields,

  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  payment_intent_id:                   { type: Sequelize.STRING, allowNull: false },
  payment_intent_event:                { type: Sequelize.STRING, allowNull: false },
  target_reaction_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserCharge = <MyModelStatic> sequelize.define('UserCharge', {
  ...common_model_fields,

  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  charge_id:                           { type: Sequelize.STRING, allowNull: false },
  charge_event:                        { type: Sequelize.STRING, allowNull: false },
  
  target_reaction_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserTransfer = <MyModelStatic> sequelize.define('UserTransfer', {
  ...common_model_fields,

  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  transfer_id:                         { type: Sequelize.STRING, allowNull: false },
  transfer_event:                      { type: Sequelize.STRING, allowNull: false },
  
  target_reaction_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserRefund = <MyModelStatic> sequelize.define('UserRefund', {
  ...common_model_fields,

  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  refund_id:                           { type: Sequelize.STRING, allowNull: false },
  refund_event:                        { type: Sequelize.STRING, allowNull: false },
  
  target_reaction_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);












/** skill models */

export const Skill = <MyModelStatic> sequelize.define('Skill', {
  ...common_model_fields,

  name:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  status:               { type: Sequelize.STRING, allowNull: false, defaultValue: AVENGER_SKILL_STATUS.ACTIVE },
}, common_model_options);



export const UserSkill = <MyModelStatic> sequelize.define('UserSkill', {
  ...common_model_fields,

  skill_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: Skill, key: 'id' } },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  submitter_id:         { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
}, common_model_options);

export const UserSkillSubmitRequest = <MyModelStatic> sequelize.define('UserSkill', {
  ...common_model_fields,

  skill_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: Skill, key: 'id' } },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  submitter_id:         { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  status:               { type: Sequelize.STRING, allowNull: false, defaultValue: STATUSES.PENDING },
}, common_model_options);




export const UserSkillRating = <MyModelStatic> sequelize.define('UserSkillRating', {
  ...common_model_fields,

  user_skill_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: UserSkill, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  aspect:               { type: Sequelize.STRING, allowNull: true },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  tags:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

export const UserSkillRatingReaction = <MyModelStatic> sequelize.define('UserSkillRatingReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: UserSkillRating, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);












/** interview models */

export const Interview = <MyModelStatic> sequelize.define('Interview', {
  ...common_model_fields,

  interviewer_id:            { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  interviewee_id:            { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  title:                     { type: Sequelize.STRING, allowNull: false },
  body:                      { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  industry:                  { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  tags:                      { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  skills_accessed:           { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  view_state:                { type: Sequelize.STRING, allowNull: false, defaultValue: INTERVIEW_VIEW_STATE.OPEN },
  is_private:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  private_access_fee:        { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  
  photo_id:                  { type: Sequelize.TEXT, allowNull: true },
  photo_link:                { type: Sequelize.TEXT, allowNull: true },
  photo_bucket:              { type: Sequelize.TEXT, allowNull: true },
  photo_key:                 { type: Sequelize.TEXT, allowNull: true },

  video_id:                  { type: Sequelize.TEXT, allowNull: true },
  video_link:                { type: Sequelize.TEXT, allowNull: true },
  video_bucket:              { type: Sequelize.TEXT, allowNull: true },
  video_key:                 { type: Sequelize.TEXT, allowNull: true },
  
}, common_model_options);

// skills pertaining to interview
export const InterviewSkill = <MyModelStatic> sequelize.define('InterviewSkill', {
  ...common_model_fields,

  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  skill_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: Skill, key: 'id' } },
}, common_model_options);




export const InterviewerRating = <MyModelStatic> sequelize.define('InterviewerRating', {
  ...common_model_fields,

  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const IntervieweeRating = <MyModelStatic> sequelize.define('IntervieweeRating', {
  ...common_model_fields,

  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);






export const InterviewReaction = <MyModelStatic> sequelize.define('InterviewReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);





export const InterviewComment = <MyModelStatic> sequelize.define('InterviewComment', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const InterviewCommentReaction = <MyModelStatic> sequelize.define('InterviewCommentReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: InterviewComment, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const InterviewCommentReply = <MyModelStatic> sequelize.define('InterviewCommentReply', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: InterviewComment, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const InterviewCommentReplyReaction = <MyModelStatic> sequelize.define('InterviewCommentReplyReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  reply_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: InterviewCommentReply, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);













/** question models */

// used for grouping question models
export const Assessment = <MyModelStatic> sequelize.define('Assessment', {
  ...common_model_fields,

  owner_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
}, common_model_options);




export const Question = <MyModelStatic> sequelize.define('Question', {
  ...common_model_fields,

  owner_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  assessment_id:        { type: Sequelize.INTEGER, allowNull: true, references: { model: Assessment, key: 'id' } },
  difficulty:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
}, common_model_options);

// skills pertaining to question
export const QuestionSkill = <MyModelStatic> sequelize.define('QuestionSkill', {
  ...common_model_fields,

  question_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: Question, key: 'id' } },
  skill_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: Skill, key: 'id' } },
}, common_model_options);




export const Answer = <MyModelStatic> sequelize.define('Answer', {
  ...common_model_fields,

  owner_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  question_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: Question, key: 'id' } },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  video_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  video_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
}, common_model_options);




export const AnswerRating = <MyModelStatic> sequelize.define('AnswerRating', {
  ...common_model_fields,

  answer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: Answer, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  tags:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
}, common_model_options);





export const AnswerReaction = <MyModelStatic> sequelize.define('AnswerReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  answer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: Answer, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);





export const AnswerComment = <MyModelStatic> sequelize.define('AnswerComment', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  answer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: Answer, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const AnswerCommentReaction = <MyModelStatic> sequelize.define('AnswerCommentReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: AnswerComment, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const AnswerCommentReply = <MyModelStatic> sequelize.define('AnswerCommentReply', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: AnswerComment, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const AnswerCommentReplyReaction = <MyModelStatic> sequelize.define('AnswerCommentReplyReaction', {
  ...common_model_fields,

  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  reply_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: AnswerCommentReply, key: 'id' } },
  reaction_type:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, common_model_options);












export const SiteFeedback = <MyModelStatic> sequelize.define('SiteFeedback', {
  ...common_model_fields,

  user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:              { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:               { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  summary:             { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const ApiKey = <MyModelStatic> sequelize.define('ApiKey', {
  ...common_model_fields,

  key:                 { type: Sequelize.STRING, defaultValue: uuidv4 },
  firstname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  lastname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  phone:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  website:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  verified:            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const ApiKeyRequest = <MyModelStatic> sequelize.define('ApiKeyRequest', {
  ...common_model_fields,

  api_key_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: ApiKey, key: 'id' } },
  url:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  method:              { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  headers:             { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  cookie:              { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  body:                { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  files:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
}, common_model_options);




export const NewsDataCache = <MyModelStatic> sequelize.define('NewsDataCache', {
  ...common_model_fields,

  name:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  json_data:           { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);













/** ------- RELATIONSHIPS ------- */

User.hasMany(UserExpoDevice, { as: 'expo_devices', foreignKey: 'user_id', sourceKey: 'id' });
UserExpoDevice.belongsTo(User, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });


User.hasMany(UserNotification, { as: 'to_notifications', foreignKey: 'to_id', sourceKey: 'id' });
UserNotification.belongsTo(User, { as: 'to', foreignKey: 'to_id', targetKey: 'id' });
User.hasMany(UserNotification, { as: 'from_notifications', foreignKey: 'from_id', sourceKey: 'id' });
UserNotification.belongsTo(User, { as: 'from', foreignKey: 'from_id', targetKey: 'id' });

User.hasMany(Message, { as: 'messages_sent', foreignKey: 'from_id', sourceKey: 'id' });
Message.belongsTo(User, { as: 'from', foreignKey: 'from_id', targetKey: 'id' });
User.hasMany(Message, { as: 'messages_received', foreignKey: 'to_id', sourceKey: 'id' });
Message.belongsTo(User, { as: 'to', foreignKey: 'to_id', targetKey: 'id' });


User.hasMany(UserRating, { as: 'ratings_received', foreignKey: 'user_id', sourceKey: 'id' });
UserRating.belongsTo(User, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(UserRating, { as: 'ratings_written', foreignKey: 'writer_id', sourceKey: 'id' });
UserRating.belongsTo(User, { as: 'writer', foreignKey: 'writer_id', targetKey: 'id' });

User.hasMany(UserSkill, { as: 'user_skills', foreignKey: 'user_id', sourceKey: 'id' });
UserSkill.belongsTo(User, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(UserSkill, { as: 'user_skills_submitted', foreignKey: 'submitter_id', sourceKey: 'id' });
UserSkill.belongsTo(User, { as: 'submitter', foreignKey: 'submitter_id', targetKey: 'id' });

Skill.hasMany(UserSkill, { as: 'skill_users', foreignKey: 'skill_id', sourceKey: 'id' });
UserSkill.belongsTo(Skill, { as: 'skill', foreignKey: 'skill_id', targetKey: 'id' });

UserSkill.hasMany(UserSkillRating, { as: 'skill_ratings', foreignKey: 'user_skill_id', sourceKey: 'id' });
UserSkillRating.belongsTo(UserSkill, { as: 'skill', foreignKey: 'user_skill_id', targetKey: 'id' });
User.hasMany(UserSkillRating, { as: 'skill_ratings_written', foreignKey: 'writer_id', sourceKey: 'id' });
UserSkillRating.belongsTo(User, { as: 'user', foreignKey: 'writer_id', targetKey: 'id' });

User.hasMany(Notice, { as: 'user_notices', foreignKey: 'owner_id', sourceKey: 'id' });
Notice.belongsTo(User, { as: 'owner', foreignKey: 'owner_id', targetKey: 'id' });

Notice.hasMany(Notice, { as: 'notice_replies', foreignKey: 'parent_notice_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'parent_notice', foreignKey: 'parent_notice_id', targetKey: 'id' });
Notice.hasMany(Notice, { as: 'notice_quotes', foreignKey: 'quoting_notice_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'quote_notice', foreignKey: 'quoting_notice_id', targetKey: 'id' });
Notice.hasMany(Notice, { as: 'notice_shares', foreignKey: 'share_notice_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'share_notice', foreignKey: 'share_notice_id', targetKey: 'id' });

Notice.hasMany(NoticePhoto, { as: 'notice_photos', foreignKey: 'notice_id', sourceKey: 'id' });
NoticePhoto.belongsTo(Notice, { as: 'notice', foreignKey: 'notice_id', targetKey: 'id' });
Notice.hasMany(NoticeVideo, { as: 'notice_videos', foreignKey: 'notice_id', sourceKey: 'id' });
NoticeVideo.belongsTo(Notice, { as: 'notice', foreignKey: 'notice_id', targetKey: 'id' });
Notice.hasMany(NoticeAudio, { as: 'notice_audios', foreignKey: 'notice_id', sourceKey: 'id' });
NoticeAudio.belongsTo(Notice, { as: 'notice', foreignKey: 'notice_id', targetKey: 'id' });