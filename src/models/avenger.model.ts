import * as Sequelize from 'Sequelize';
import { v1 as uuidv1 } from 'uuid';

import { AVENGER_ADMIN_ROLES } from '../enums/avenger.enum';
import { MyModelStatic } from '../interfaces/common.interface';
import {
  common_options,
  sequelizeInst as sequelize
} from './_def.model';





export const User = <MyModelStatic> sequelize.define('User', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

  username:                            { type: Sequelize.STRING, allowNull: false },
  displayname:                         { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:                               { type: Sequelize.STRING, allowNull: false },
  password:                            { type: Sequelize.STRING, allowNull: false },
  
  phone:                               { type: Sequelize.STRING, allowNull: true, defaultValue: null },
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
  notifications_last_opened:           { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, {
  ...common_options,
  indexes: [{ unique: true, fields: ['email', 'uuid']} ] 
});




export const UserField = <MyModelStatic> sequelize.define('UserField', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  fieldname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  fieldtype:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  fieldvalue:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);




export const UserFollow = <MyModelStatic> sequelize.define('UserFollow', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  follow_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserRating = <MyModelStatic> sequelize.define('UserRating', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  aspect:               { type: Sequelize.STRING, allowNull: true },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  tags:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserSkill = <MyModelStatic> sequelize.define('UserSkill', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  submitter_id:         { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  name:                 { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserSkillRating = <MyModelStatic> sequelize.define('UserSkillRating', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  skill_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: UserSkill, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  aspect:               { type: Sequelize.STRING, allowNull: true },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  tags:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);





export const UserEmailVerification = <MyModelStatic> sequelize.define('UserEmailVerification', {
  id:                      { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  email:                   { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  verification_code:       { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV4 },
  verified:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  uuid:                    { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);




export const UserPhoneVerification = <MyModelStatic> sequelize.define('UserPhoneVerification', {
  id:                      { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                 { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  request_id:              { type: Sequelize.STRING, unique: true, allowNull: true },
  phone:                   { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  verification_code:       { type: Sequelize.STRING, allowNull: false },
  uuid:                    { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);




export const Notification = <MyModelStatic> sequelize.define('Notification', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  from_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:               { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  event:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  target_type:         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  read:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  image_link:          { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_id:            { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserNotificationLastOpened = <MyModelStatic> sequelize.define('UserNotificationLastOpened', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  notifications_last_opened:           { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserAccountHold = <MyModelStatic> sequelize.define('UserAccountHold', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  reason:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const StripeAction = <MyModelStatic> sequelize.define('StripeAction', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  action_event:                        { type: Sequelize.STRING, allowNull: false }, // charge, refund, transfer
  action_id:                           { type: Sequelize.STRING, allowNull: false },
  action_metadata:                     { type: Sequelize.JSON, allowNull: true, defaultValue: '' },
  micro_app:                           { type: Sequelize.STRING, allowNull: true },
  target_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  target_metadata:                     { type: Sequelize.JSON, allowNull: true, defaultValue: '' },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserExpoDevice = <MyModelStatic> sequelize.define('UserExpoDevice', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: Sequelize.JSON, allowNull: true, defaultValue: null },
  device_id:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_type:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserDevice = <MyModelStatic> sequelize.define('UserDevice', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: Sequelize.JSON, allowNull: true, defaultValue: null },
  device_id:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_type:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserPaymentIntent = <MyModelStatic> sequelize.define('UserPaymentIntent', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  payment_intent_id:                   { type: Sequelize.STRING, allowNull: false },
  payment_intent_event:                { type: Sequelize.STRING, allowNull: false },
  target_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserCharge = <MyModelStatic> sequelize.define('UserCharge', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  charge_id:                           { type: Sequelize.STRING, allowNull: false },
  charge_event:                        { type: Sequelize.STRING, allowNull: false },
  micro_app:                           { type: Sequelize.STRING, allowNull: true },
  target_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserTransfer = <MyModelStatic> sequelize.define('UserTransfer', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  transfer_id:                         { type: Sequelize.STRING, allowNull: false },
  transfer_event:                      { type: Sequelize.STRING, allowNull: false },
  micro_app:                           { type: Sequelize.STRING, allowNull: true },
  target_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const UserRefund = <MyModelStatic> sequelize.define('UserRefund', {
  id:                                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:                             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  refund_id:                           { type: Sequelize.STRING, allowNull: false },
  refund_event:                        { type: Sequelize.STRING, allowNull: false },
  micro_app:                           { type: Sequelize.STRING, allowNull: true },
  target_type:                         { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
  status:                              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  uuid:                                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const MessagingRequest = <MyModelStatic> sequelize.define('MessagingRequest', {
  id:                 { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  sender_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  uuid:               { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const Messaging = <MyModelStatic> sequelize.define('Messaging', {
  id:                 { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  sender_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  uuid:               { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const Message = <MyModelStatic> sequelize.define('Message', {
  id:                 { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  from_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  body:               { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  app_context:        { type: Sequelize.STRING, allowNull: true, defaultValue: '' }, // _common/hotspot.myfavors/etc
  opened:             { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  uuid:               { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const MessagePhoto = <MyModelStatic> sequelize.define('MessagePhoto', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  message_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: Message, key: 'id' } },
  photo_link:          { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  photo_id:            { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const Admin = <MyModelStatic> sequelize.define('Admin', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
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
  uuid:                { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const ResetPasswordRequest = <MyModelStatic> sequelize.define('ResetPasswordRequest', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  completed:           { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:        { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV4 },
  uuid:                { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);






// Interview


export const Interview = <MyModelStatic> sequelize.define('Interview', {
  id:                        { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  interviewer_id:            { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  interviewee_id:            { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  title:                     { type: Sequelize.STRING, allowNull: false },
  body:                      { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  industry:                  { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  tags:                      { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  skills_accessed:           { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
  view_state:                { type: Sequelize.STRING, allowNull: false },
  is_private:                { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  private_access_fee:        { type: Sequelize.TEXT, allowNull: true, defaultValue: 0 },
  
  photo_id:                  { type: Sequelize.TEXT, allowNull: true },
  photo_link:                { type: Sequelize.TEXT, allowNull: true },
  photo_bucket:              { type: Sequelize.TEXT, allowNull: true },
  photo_key:                 { type: Sequelize.TEXT, allowNull: true },

  video_id:                  { type: Sequelize.TEXT, allowNull: true },
  video_link:                { type: Sequelize.TEXT, allowNull: true },
  video_bucket:              { type: Sequelize.TEXT, allowNull: true },
  video_key:                 { type: Sequelize.TEXT, allowNull: true },
  
  uuid:                      { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);




export const InterviewerRating = <MyModelStatic> sequelize.define('InterviewerRating', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  interviewer_id:       { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const IntervieweeRating = <MyModelStatic> sequelize.define('IntervieweeRating', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  interviewee_id:       { type: Sequelize.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);






export const InterviewReaction = <MyModelStatic> sequelize.define('InterviewReaction', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  type:                 { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);





export const InterviewComment = <MyModelStatic> sequelize.define('InterviewComment', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interview_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const InterviewCommentReaction = <MyModelStatic> sequelize.define('InterviewCommentReaction', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: InterviewComment, key: 'id' } },
  type:                 { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const InterviewCommentReply = <MyModelStatic> sequelize.define('InterviewCommentReply', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: InterviewComment, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const InterviewCommentReplyReaction = <MyModelStatic> sequelize.define('InterviewCommentReplyReaction', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  reply_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: InterviewCommentReply, key: 'id' } },
  type:                 { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);








export const Assessment = <MyModelStatic> sequelize.define('Assessment', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const Question = <MyModelStatic> sequelize.define('Question', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  assessment_id:        { type: Sequelize.INTEGER, allowNull: true, references: { model: Assessment, key: 'id' } },
  position:             { type: Sequelize.INTEGER, allowNull: true },
  difficulty:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  skills:               { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const Answer = <MyModelStatic> sequelize.define('Answer', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  question_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: Question, key: 'id' } },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  video_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  video_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const AnswerReaction = <MyModelStatic> sequelize.define('AnswerReaction', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  answer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: Answer, key: 'id' } },
  type:                 { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);





export const AnswerComment = <MyModelStatic> sequelize.define('AnswerComment', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  answer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: Answer, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const AnswerCommentReaction = <MyModelStatic> sequelize.define('AnswerCommentReaction', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: AnswerComment, key: 'id' } },
  type:                 { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const AnswerCommentReply = <MyModelStatic> sequelize.define('AnswerCommentReply', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  comment_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: AnswerComment, key: 'id' } },
  body:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);




export const AnswerCommentReplyReaction = <MyModelStatic> sequelize.define('AnswerCommentReplyReaction', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:              { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  reply_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: AnswerCommentReply, key: 'id' } },
  type:                 { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);



export const AnswerRating = <MyModelStatic> sequelize.define('AnswerRating', {
  id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  answer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: Answer, key: 'id' } },
  writer_id:            { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  summary:              { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  tags:                 { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  image_link:           { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  uuid:                 { type: Sequelize.STRING, defaultValue: uuidv1 }
}, common_options);





export const SiteFeedback = <MyModelStatic> sequelize.define('SiteFeedback', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:              { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
  title:               { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  summary:             { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);




export const ApiKey = <MyModelStatic> sequelize.define('ApiKey', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  key:                 { type: Sequelize.STRING, defaultValue: uuidv1 },
  firstname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  lastname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  phone:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  website:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  verified:            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  requests_count:      { type: Sequelize.INTEGER, defaultValue: 0 },
}, common_options);




export const NewsDataCache = <MyModelStatic> sequelize.define('NewsDataCache', {
  id:                  { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  json_data:           { type: Sequelize.TEXT, allowNull: true, defaultValue: '' },
  uuid:                { type: Sequelize.STRING, defaultValue: uuidv1 },
}, common_options);













/** ------- RELATIONSHIPS ------- */

User.hasMany(UserExpoDevice, { as: 'expo_devices', foreignKey: 'user_id', sourceKey: 'id' });
UserExpoDevice.belongsTo(User, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });


User.hasMany(Notification, { as: 'to_notifications', foreignKey: 'to_id', sourceKey: 'id' });
Notification.belongsTo(User, { as: 'to', foreignKey: 'to_id', targetKey: 'id' });
User.hasMany(Notification, { as: 'from_notifications', foreignKey: 'from_id', sourceKey: 'id' });
Notification.belongsTo(User, { as: 'from', foreignKey: 'from_id', targetKey: 'id' });

User.hasMany(Message, { as: 'messages_sent', foreignKey: 'from_id', sourceKey: 'id' });
Message.belongsTo(User, { as: 'from', foreignKey: 'from_id', targetKey: 'id' });
User.hasMany(Message, { as: 'messages_received', foreignKey: 'to_id', sourceKey: 'id' });
Message.belongsTo(User, { as: 'to', foreignKey: 'to_id', targetKey: 'id' });