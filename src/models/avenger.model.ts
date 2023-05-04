import {
  JSON as JSON_TYPE,
  STRING, TEXT,
  DATE, NOW,
  BOOLEAN,
  INTEGER,
  UUIDV1
} from 'sequelize';
import { STATUSES } from '../enums/common.enum';

import { AVENGER_ADMIN_ROLES, AVENGER_SKILL_STATUS, INTERVIEW_VIEW_STATE, MODELS } from '../enums/avenger.enum';
import { MyModelStatic } from '../interfaces/common.interface';
import { createCommonGenericModelSocialModels } from './create-model-social-models.helper';
import {
  sequelizeInst as sequelize,
  common_model_fields,
  common_model_options,
  core_model_options,
  DB_ENV,
} from './_def.model';
import { createChildCoreModels } from './_helper.model';








/** admin models */

export const Admin = <MyModelStatic> sequelize.define('Admin', {
  ...common_model_fields,

  firstname:           { type: STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: STRING, allowNull: false, defaultValue: '' },
  lastname:            { type: STRING, allowNull: false, defaultValue: '' },
  icon_link:           { type: STRING, allowNull: true, defaultValue: '' },
  icon_id:             { type: STRING, allowNull: true, defaultValue: '' },
  email:               { type: STRING, allowNull: false },
  password:            { type: STRING, allowNull: false },
  phone:               { type: STRING, allowNull: true },
  role:                { type: STRING, allowNull: false, defaultValue: AVENGER_ADMIN_ROLES.ADMINISTRATOR },
  active:              { type: BOOLEAN, allowNull: false, defaultValue: true },
}, common_model_options);


/** END admin models */



/** user model */

export const User = <MyModelStatic> sequelize.define('User', {
  ...common_model_fields,

  username:                            { type: STRING, allowNull: false },
  displayname:                         { type: STRING, allowNull: false, defaultValue: '' },
  email:                               { type: STRING, allowNull: false },
  password:                            { type: STRING, allowNull: false },
  
  phone:                               { type: STRING, allowNull: true, defaultValue: null },
  temp_phone:                          { type: STRING, allowNull: true, defaultValue: null },
  stripe_customer_account_id:          { type: STRING, allowNull: true, defaultValue: null },
  stripe_account_id:                   { type: STRING, allowNull: true, defaultValue: null },
  stripe_account_verified:             { type: BOOLEAN, allowNull: false, defaultValue: false },
  platform_subscription_id:            { type: STRING, allowNull: true, defaultValue: null },

  headline:                            { type: STRING, allowNull: false, defaultValue: '' },
  bio:                                 { type: TEXT, allowNull: false, defaultValue: '' },
  icon_link:                           { type: STRING, allowNull: true, defaultValue: '' },
  icon_id:                             { type: STRING, allowNull: true, defaultValue: '' },

  id_card_front_link:                  { type: STRING, allowNull: true, defaultValue: '' },
  id_card_front_id:                    { type: STRING, allowNull: true, defaultValue: '' },
  id_card_back_link:                   { type: STRING, allowNull: true, defaultValue: '' },
  id_card_back_id:                     { type: STRING, allowNull: true, defaultValue: '' },

  photo_id_link:                       { type: STRING, allowNull: true, defaultValue: '' },
  photo_id_id:                         { type: STRING, allowNull: true, defaultValue: '' },
  wallpaper_link:                      { type: STRING, allowNull: true, defaultValue: '' },
  wallpaper_id:                        { type: STRING, allowNull: true, defaultValue: '' },
  
  allow_messaging:                     { type: BOOLEAN, allowNull: false, defaultValue: true },
  allow_conversations:                 { type: BOOLEAN, allowNull: false, defaultValue: true },
  
  location:                            { type: STRING, allowNull: true, defaultValue: '' },
  location_id:                         { type: STRING, allowNull: true, defaultValue: '' },
  location_json:                       { type: JSON_TYPE, allowNull: true, defaultValue: '' },
  zipcode:                             { type: STRING, allowNull: true, defaultValue: '' },
  city:                                { type: STRING, allowNull: true, defaultValue: '' },
  state:                               { type: STRING, allowNull: true, defaultValue: '' },
  county:                              { type: STRING, allowNull: true, defaultValue: '' },
  country:                             { type: STRING, allowNull: true, defaultValue: '' },

  public:                              { type: BOOLEAN, allowNull: false, defaultValue: true },
  online:                              { type: BOOLEAN, allowNull: false, defaultValue: false },
  cerified:                            { type: BOOLEAN, allowNull: false, defaultValue: false },
  person_verified:                     { type: BOOLEAN, allowNull: false, defaultValue: false },
  email_verified:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
  phone_verified:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
  can_message:                         { type: BOOLEAN, allowNull: false, defaultValue: true },
  can_converse:                        { type: BOOLEAN, allowNull: false, defaultValue: true },
  allow_skill_submissions:             { type: BOOLEAN, allowNull: false, defaultValue: true },
  notifications_last_opened:           { type: DATE, allowNull: false, defaultValue: NOW },
}, common_model_options);

export const Skill = <MyModelStatic> sequelize.define('Skill', {
  ...common_model_fields,

  name:                 { type: STRING, allowNull: false, unique: true },
  status:               { type: STRING, allowNull: false, defaultValue: AVENGER_SKILL_STATUS.ACTIVE },
}, common_model_options);

export const Tag = <MyModelStatic> sequelize.define('Tag', {
  ...common_model_fields,

  name:                 { type: STRING, allowNull: false, unique: true },
  status:               { type: STRING, allowNull: false, defaultValue: AVENGER_SKILL_STATUS.ACTIVE },
}, common_model_options);


/** END user model */





export const UserEmailVerification = <MyModelStatic> sequelize.define('UserEmailVerification', {
  ...common_model_fields,

  user_id:                 { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  email:                   { type: STRING, allowNull: false },
  verification_code:       { type: STRING, allowNull: false, unique: true, defaultValue: UUIDV1 },
  verified:                { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);




export const UserPhoneVerification = <MyModelStatic> sequelize.define('UserPhoneVerification', {
  ...common_model_fields,

  user_id:                 { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  request_id:              { type: STRING, allowNull: false, unique: true },
  phone:                   { type: STRING, allowNull: false },
  verification_code:       { type: STRING, allowNull: false },
  verified:                { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);




export const UserExpoDevice = <MyModelStatic> sequelize.define('UserExpoDevice', {
  ...common_model_fields,

  user_id:              { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: JSON_TYPE, allowNull: true, defaultValue: null },
  device_id:            { type: STRING, allowNull: false, defaultValue: '' },
  device_reaction_type:          { type: STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserDevice = <MyModelStatic> sequelize.define('UserDevice', {
  ...common_model_fields,

  user_id:              { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  token:                { type: STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: JSON_TYPE, allowNull: true, defaultValue: null },
  device_id:            { type: STRING, allowNull: false, defaultValue: '' },
  device_reaction_type:          { type: STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const UserResetPasswordRequest = <MyModelStatic> sequelize.define('UserResetPasswordRequest', {
  ...common_model_fields,

  user_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  completed:           { type: BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:        { type: STRING, allowNull: false, unique: true, defaultValue: UUIDV1 },
}, common_model_options);



export const UserNotification = <MyModelStatic> sequelize.define('UserNotification', {
  ...common_model_fields,

  from_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:               { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  event:               { type: STRING, allowNull: false, defaultValue: '' },
  target_type:         { type: STRING, allowNull: false, defaultValue: '' },
  target_id:           { type: INTEGER, allowNull: false, defaultValue: 0 },
  read:                { type: BOOLEAN, allowNull: false, defaultValue: false },
  image_link:          { type: TEXT, allowNull: true, defaultValue: '' },
  image_id:            { type: TEXT, allowNull: true, defaultValue: '' },
}, common_model_options);




export const UserUserNotificationLastOpened = <MyModelStatic> sequelize.define('UserUserNotificationLastOpened', {
  ...common_model_fields,

  user_id:                             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  notifications_last_opened:           { type: DATE, allowNull: false, defaultValue: NOW },
}, common_model_options);




export const UserAccountHold = <MyModelStatic> sequelize.define('UserAccountHold', {
  ...common_model_fields,

  user_id:                             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  status:                              { type: STRING, allowNull: false, defaultValue: '' },
  reason:                              { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);




export const MessagingRequest = <MyModelStatic> sequelize.define('MessagingRequest', {
  ...common_model_fields,

  user_id:            { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  sender_id:          { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
}, common_model_options);




export const Messaging = <MyModelStatic> sequelize.define('Messaging', {
  ...common_model_fields,

  user_id:            { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  sender_id:          { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
}, common_model_options);



export const Message = <MyModelStatic> sequelize.define('Message', {
  ...common_model_fields,

  from_id:            { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  to_id:              { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  body:               { type: TEXT, allowNull: false },
  opened:             { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);




/** stripe models */

export const StripeAction = <MyModelStatic> sequelize.define('StripeAction', {
  ...common_model_fields,

  user_id:                             { type: INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  action_event:                        { type: STRING, allowNull: false }, // charge, refund, transfer
  action_id:                           { type: STRING, allowNull: false },
  action_metadata:                     { type: JSON_TYPE, allowNull: true, defaultValue: '' },
  target_reaction_type:                { type: STRING, allowNull: true, defaultValue: '' },
  target_id:                           { type: INTEGER, allowNull: true, defaultValue: 0 },
  target_metadata:                     { type: JSON_TYPE, allowNull: true, defaultValue: '' },
  status:                              { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);






/** user notices (tweets) */

export const Notice = <MyModelStatic> sequelize.define('Notice', {
  ...common_model_fields,

  owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },

  pinned_reply_id:     { type: INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } },
  parent_notice_id:    { type: INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } }, // if this notice is a reply to another
  quoting_notice_id:   { type: INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } }, // if this notice is quoting another
  share_notice_id:     { type: INTEGER, allowNull: true, references: { model: 'Notice', key: 'id' } }, // if this notice is a share of another

  body:                { type: STRING(500), allowNull: true },

  is_explicit:         { type: BOOLEAN, allowNull: false, defaultValue: false },
  is_private:          { type: BOOLEAN, allowNull: false, defaultValue: false },
  visibility:          { type: STRING(75), allowNull: false, defaultValue: '' },
}, { ...common_model_options, tableName: `Notice`, modelName: `Notice` });











/** interview models */

export const Interview = <MyModelStatic> sequelize.define('Interview', {
  ...common_model_fields,

  owner_id:                  { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interviewer_id:            { type: INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  interviewee_id:            { type: INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  title:                     { type: STRING, allowNull: true },
  description:               { type: TEXT, allowNull: true },
  industry:                  { type: TEXT, allowNull: true, defaultValue: '' },
  skills_accessed:           { type: TEXT, allowNull: false, defaultValue: '' },
  view_state:                { type: STRING, allowNull: false, defaultValue: INTERVIEW_VIEW_STATE.OPEN },
  is_private:                { type: BOOLEAN, allowNull: false, defaultValue: false },
  private_access_fee:        { type: INTEGER, allowNull: true, defaultValue: 0 },
  
  photo_id:                  { type: TEXT, allowNull: true },
  photo_link:                { type: TEXT, allowNull: true },
  photo_bucket:              { type: TEXT, allowNull: true },
  photo_key:                 { type: TEXT, allowNull: true },

  video_id:                  { type: TEXT, allowNull: true },
  video_link:                { type: TEXT, allowNull: true },
  video_bucket:              { type: TEXT, allowNull: true },
  video_key:                 { type: TEXT, allowNull: true },
}, common_model_options);

export const InterviewerRating = <MyModelStatic> sequelize.define('InterviewerRating', {
  ...common_model_fields,

  interview_id:         { type: INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  writer_id:            { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: STRING, allowNull: false, defaultValue: '' },
  summary:              { type: TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: STRING, allowNull: false, defaultValue: '' },
  image_id:             { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

export const IntervieweeRating = <MyModelStatic> sequelize.define('IntervieweeRating', {
  ...common_model_fields,

  interview_id:         { type: INTEGER, allowNull: false, references: { model: Interview, key: 'id' } },
  writer_id:            { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:               { type: INTEGER, allowNull: false, defaultValue: 5 },
  title:                { type: STRING, allowNull: false, defaultValue: '' },
  summary:              { type: TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: STRING, allowNull: false, defaultValue: '' },
  image_id:             { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);


// someone's request to upload an interview regarding an interviewer and interviewee
export const InterviewerLinkRequest = <MyModelStatic> sequelize.define('InterviewerLinkRequest', {
  ...common_model_fields,

  owner_id:                  { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interviewer_id:            { type: INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  interviewer_status:        { type: STRING, allowNull: false, defaultValue: STATUSES.PENDING },
}, common_model_options);

export const IntervieweeLinkRequest = <MyModelStatic> sequelize.define('IntervieweeLinkRequest', {
  ...common_model_fields,

  owner_id:                  { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  interviewee_id:            { type: INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  interviewee_status:        { type: STRING, allowNull: false, defaultValue: STATUSES.PENDING },
}, common_model_options);







/** question models */

// used for grouping question models
export const Assessment = <MyModelStatic> sequelize.define('Assessment', {
  ...common_model_fields,

  owner_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  title:                { type: STRING, allowNull: false, defaultValue: '' },
  description:          { type: TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: STRING, allowNull: true, defaultValue: '' },
}, common_model_options);




export const Question = <MyModelStatic> sequelize.define('Question', {
  ...common_model_fields,

  owner_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  assessment_id:        { type: INTEGER, allowNull: true, references: { model: Assessment, key: 'id' } },
  difficulty:           { type: STRING, allowNull: true, defaultValue: '' },
  title:                { type: STRING, allowNull: false, defaultValue: '' },
  description:          { type: TEXT, allowNull: false, defaultValue: '' },
  image_link:           { type: STRING, allowNull: true, defaultValue: '' },
  image_id:             { type: STRING, allowNull: true, defaultValue: '' },
}, common_model_options);



export const Answer = <MyModelStatic> sequelize.define('Answer', {
  ...common_model_fields,

  owner_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  question_id:          { type: INTEGER, allowNull: false, references: { model: Question, key: 'id' } },
  title:                { type: STRING, allowNull: false, defaultValue: '' },
  description:          { type: TEXT, allowNull: false, defaultValue: '' },
  video_link:           { type: STRING, allowNull: true, defaultValue: '' },
  video_id:             { type: STRING, allowNull: true, defaultValue: '' },
}, common_model_options);






/** Misc */


export const SiteFeedback = <MyModelStatic> sequelize.define('SiteFeedback', {
  ...common_model_fields,

  user_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  rating:              { type: INTEGER, allowNull: false, defaultValue: 5 },
  title:               { type: TEXT, allowNull: false, defaultValue: '' },
  summary:             { type: TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const ContentReported = <MyModelStatic> sequelize.define('ContentReported', {
  ...common_model_fields,

  user_id:             { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  target_user_id:      { type: INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  target_type:         { type: STRING, allowNull: false, defaultValue: '' },
  target_id:           { type: INTEGER, allowNull: false, defaultValue: 0 },
  category:            { type: STRING, allowNull: false, defaultValue: '' },
  title:               { type: STRING, allowNull: false, defaultValue: '' },
  summary:             { type: TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);




export const ApiKey = <MyModelStatic> sequelize.define('ApiKey', {
  ...common_model_fields,

  key:                 { type: STRING, allowNull: false, defaultValue: UUIDV1 },
  firstname:           { type: STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: STRING, allowNull: true, defaultValue: '' },
  lastname:            { type: STRING, allowNull: false, defaultValue: '' },
  email:               { type: STRING, allowNull: false, defaultValue: '' },
  phone:               { type: STRING, allowNull: false, defaultValue: '' },
  website:             { type: STRING, allowNull: false, defaultValue: '' },
  verified:            { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const ApiKeyRequest = <MyModelStatic> sequelize.define('ApiKeyRequest', {
  ...common_model_fields,

  api_key_id:          { type: INTEGER, allowNull: false, references: { model: ApiKey, key: 'id' } },
  url:                 { type: STRING, allowNull: false, defaultValue: '' },
  method:              { type: STRING, allowNull: true, defaultValue: '' },
  headers:             { type: TEXT, allowNull: false, defaultValue: '' },
  cookie:              { type: TEXT, allowNull: false, defaultValue: '' },
  body:                { type: TEXT, allowNull: false, defaultValue: '' },
  files:               { type: INTEGER, allowNull: false, defaultValue: 0 },
}, common_model_options);




export const NewsDataCache = <MyModelStatic> sequelize.define('NewsDataCache', {
  ...common_model_fields,

  name:                { type: STRING, allowNull: false, defaultValue: '' },
  json_data:           { type: TEXT, allowNull: false, defaultValue: '' },
}, common_model_options);













/** ------- DYNAMIC GENERATED MODELS ------- */


export const UserCoreModels = createChildCoreModels({
  userModel: User,
  parentModelClass: User,
  parentModelName: `User`,
  childrenModelDefs: [
    { childModelName: MODELS.RATING },
    { childModelName: MODELS.FOLLOW },
  ]
});



export const NoticeCoreModels = createChildCoreModels({
  userModel: User,
  parentModelClass: Notice,
  parentModelName: `Notice`,
  childrenModelDefs: [
    { childModelName: MODELS.ANALYTIC },
    { childModelName: MODELS.MENTION },
    { childModelName: MODELS.REACTION },
    { childModelName: MODELS.PHOTO },
    { childModelName: MODELS.VIDEO },
    { childModelName: MODELS.AUDIO },
  ]
});



export const InterviewSocialModels = createCommonGenericModelSocialModels({
  userModel: User,
  parentModelClass: Interview,
  parentModelName: `Interview`,
});

export const InterviewCoreModels = createChildCoreModels({
  userModel: User,
  parentModelClass: Interview,
  parentModelName: `Interview`,
  childrenModelDefs: [
    { childModelName: MODELS.ANALYTIC },
    { childModelName: MODELS.RATING },
  ]
});

export const QuestionSocialModels = createCommonGenericModelSocialModels({
  userModel: User,
  parentModelClass: Question,
  parentModelName: `Question`,
});

export const AnswerSocialModels = createCommonGenericModelSocialModels({
  userModel: User,
  parentModelClass: Answer,
  parentModelName: `Answer`,
});







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



// Tags

export const UserTags = <MyModelStatic> sequelize.define(`UserTags`, {}, common_model_options);
Tag.belongsToMany(User, { through: UserTags, foreignKey: `tag_id` });
User.belongsToMany(Tag, { through: UserTags, foreignKey: `user_id` });

export const NoticeTags = <MyModelStatic> sequelize.define(`NoticeTags`, {}, common_model_options);
Tag.belongsToMany(Notice, { through: NoticeTags, foreignKey: `tag_id` });
Notice.belongsToMany(Tag, { through: NoticeTags, foreignKey: `notice_id` });

export const InterviewTags = <MyModelStatic> sequelize.define(`InterviewTags`, {}, common_model_options);
Tag.belongsToMany(Interview, { through: InterviewTags, foreignKey: `tag_id` });
Interview.belongsToMany(Tag, { through: InterviewTags, foreignKey: `interview_id` });

export const AssessmentTags = <MyModelStatic> sequelize.define(`AssessmentTags`, {}, common_model_options);
Tag.belongsToMany(Assessment, { through: AssessmentTags, foreignKey: `tag_id` });
Assessment.belongsToMany(Tag, { through: AssessmentTags, foreignKey: `assessment_id` });

export const QuestionTags = <MyModelStatic> sequelize.define(`QuestionTags`, {}, common_model_options);
Tag.belongsToMany(Question, { through: QuestionTags, foreignKey: `tag_id` });
Question.belongsToMany(Tag, { through: QuestionTags, foreignKey: `question_id` });

export const AnswerTags = <MyModelStatic> sequelize.define(`AnswerTags`, {}, common_model_options);
Tag.belongsToMany(Answer, { through: AnswerTags, foreignKey: `tag_id` });
Answer.belongsToMany(Tag, { through: AnswerTags, foreignKey: `answer_id` });



// Skills

export const UserSkills = <MyModelStatic> sequelize.define(`UserSkills`, {}, common_model_options);
Skill.belongsToMany(User, { as: 'skill_users', through: UserSkills, foreignKey: `skill_id` });
User.belongsToMany(Skill, { as: 'user_skills', through: UserSkills, foreignKey: `user_id` });

export const NoticeSkills = <MyModelStatic> sequelize.define(`NoticeSkills`, {}, common_model_options);
Skill.belongsToMany(Notice, { through: NoticeSkills, foreignKey: `skill_id` });
Notice.belongsToMany(Skill, { through: NoticeSkills, foreignKey: `notice_id` });

NoticeSkills.hasOne(Notice, { as: 'notice', foreignKey: 'id', sourceKey: 'notice_id' });
Notice.belongsTo(NoticeSkills, { as: 'notice_skill', foreignKey: 'id', targetKey: 'notice_id' });
NoticeSkills.hasOne(Skill, { as: 'skill', foreignKey: 'id', sourceKey: 'skill_id' });
Skill.belongsTo(NoticeSkills, { as: 'skill_notice', foreignKey: 'id', targetKey: 'skill_id' });



export const InterviewSkills = <MyModelStatic> sequelize.define(`InterviewSkills`, {}, common_model_options);
Skill.belongsToMany(Interview, { as: 'interviews', through: InterviewSkills, foreignKey: `skill_id` });
Interview.belongsToMany(Skill, { as: 'skills', through: InterviewSkills, foreignKey: `interview_id` });

InterviewSkills.hasOne(Interview, { as: 'interview', foreignKey: 'id', sourceKey: 'interview_id' });
Interview.belongsTo(InterviewSkills, { as: 'interview_skill', foreignKey: 'id', targetKey: 'interview_id' });
InterviewSkills.hasOne(Skill, { as: 'skill', foreignKey: 'id', sourceKey: 'skill_id' });
Skill.belongsTo(InterviewSkills, { as: 'skill_inteview', foreignKey: 'id', targetKey: 'skill_id' });



export const AssessmentSkills = <MyModelStatic> sequelize.define(`AssessmentSkills`, {}, common_model_options);
Skill.belongsToMany(Assessment, { through: AssessmentSkills, foreignKey: `skill_id` });
Assessment.belongsToMany(Skill, { through: AssessmentSkills, foreignKey: `assessment_id` });

export const QuestionSkills = <MyModelStatic> sequelize.define(`QuestionSkills`, {}, common_model_options);
Skill.belongsToMany(Question, { through: QuestionSkills, foreignKey: `skill_id` });
Question.belongsToMany(Skill, { through: QuestionSkills, foreignKey: `question_id` });

export const AnswerSkills = <MyModelStatic> sequelize.define(`AnswerSkills`, {}, common_model_options);
Skill.belongsToMany(Answer, { through: AnswerSkills, foreignKey: `skill_id` });
Answer.belongsToMany(Skill, { through: AnswerSkills, foreignKey: `answer_id` });





// Notices
User.hasMany(Notice, { as: 'user_notices', foreignKey: 'owner_id', sourceKey: 'id' });
Notice.belongsTo(User, { as: 'owner', foreignKey: 'owner_id', targetKey: 'id' });
Notice.hasOne(Notice, { as: 'pinned_reply', foreignKey: 'pinned_reply_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'pinned_parent', foreignKey: 'pinned_reply_id', targetKey: 'id' });
Notice.hasMany(Notice, { as: 'notice_replies', foreignKey: 'parent_notice_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'parent_notice', foreignKey: 'parent_notice_id', targetKey: 'id' });
Notice.hasMany(Notice, { as: 'notice_quotes', foreignKey: 'quoting_notice_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'quote_notice', foreignKey: 'quoting_notice_id', targetKey: 'id' });
Notice.hasMany(Notice, { as: 'notice_shares', foreignKey: 'share_notice_id', sourceKey: 'id' });
Notice.belongsTo(Notice, { as: 'share_notice', foreignKey: 'share_notice_id', targetKey: 'id' });





// Interview
User.hasMany(Interview, { as: 'interviews', foreignKey: 'owner_id', sourceKey: 'id' });
Interview.belongsTo(User, { as: 'owner', foreignKey: 'owner_id', targetKey: 'id' });
User.hasMany(Interview, { as: 'interviews_interviewer', foreignKey: 'interviewer_id', sourceKey: 'id' });
Interview.belongsTo(User, { as: 'interviewer', foreignKey: 'interviewer_id', targetKey: 'id' });
User.hasMany(Interview, { as: 'interviews_interviewee', foreignKey: 'interviewee_id', sourceKey: 'id' });
Interview.belongsTo(User, { as: 'interviewee', foreignKey: 'interviewee_id', targetKey: 'id' });


Interview.hasMany(InterviewerRating, { as: 'interviewer_ratings', foreignKey: 'interview_id', sourceKey: 'id' });
InterviewerRating.belongsTo(User, { as: 'interview', foreignKey: 'interview_id', targetKey: 'id' });
Interview.hasMany(IntervieweeRating, { as: 'interviewee_ratings', foreignKey: 'interview_id', sourceKey: 'id' });
IntervieweeRating.belongsTo(User, { as: 'interview', foreignKey: 'interview_id', targetKey: 'id' });


User.hasMany(InterviewerRating, { as: 'interviewer_ratings_written', foreignKey: 'writer_id', sourceKey: 'id' });
InterviewerRating.belongsTo(User, { as: 'writer', foreignKey: 'writer_id', targetKey: 'id' });
User.hasMany(IntervieweeRating, { as: 'interviewee_ratings_written', foreignKey: 'writer_id', sourceKey: 'id' });
IntervieweeRating.belongsTo(User, { as: 'writer', foreignKey: 'writer_id', targetKey: 'id' });


// Question / Answer
User.hasMany(Question, { as: 'questions', foreignKey: 'owner_id', sourceKey: 'id' });
Question.belongsTo(User, { as: 'owner', foreignKey: 'owner_id', targetKey: 'id' });


