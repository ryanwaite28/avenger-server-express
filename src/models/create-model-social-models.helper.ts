import {
  STRING,
  TEXT,
  DATE,
  NOW,
  INTEGER,
  UUIDV1,
} from 'sequelize';
import {
  MyModelStatic
} from '../interfaces/common.interface';
import {
  sequelizeInst as sequelize,
  common_model_options,
  common_model_fields,
} from './_def.model';



export interface ISocialModelsConstructed {
  Reaction: MyModelStatic,
  Viewer: MyModelStatic,
  Photo: MyModelStatic,
  Video: MyModelStatic,
  Audio: MyModelStatic,

  Comment: MyModelStatic,
  CommentReaction: MyModelStatic,
  CommentPhoto: MyModelStatic,
  CommentVideo: MyModelStatic,
  CommentAudio: MyModelStatic,

  CommentReply: MyModelStatic,
  CommentReplyReaction: MyModelStatic,
  CommentReplyPhoto: MyModelStatic,
  CommentReplyVideo: MyModelStatic,
  CommentReplyAudio: MyModelStatic,
}


// create social models helper

export function createCommonGenericModelSocialModels(params: {
  userModel: MyModelStatic,
  parentModelName: string,
  parentModelClass: MyModelStatic,
  ignoreRelations?: boolean,
}): ISocialModelsConstructed {

  const User = params.userModel;
  const { ignoreRelations, parentModelClass, parentModelName } = params;
  const parentModelNameLower = parentModelName.toLowerCase();
  const foreignKey: string = `${parentModelNameLower}_id`;

  const Reaction = <MyModelStatic> sequelize.define(`${parentModelName}Reaction`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    [foreignKey]:    { type: INTEGER, allowNull: false, references: { model: parentModelClass, key: `id` } },
    reaction_type:            { type: STRING, allowNull: false },
  }, common_model_options);
  
  const Viewer = <MyModelStatic> sequelize.define(`${parentModelName}Viewer`, {
    ...common_model_fields,
    user_id:             { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    [foreignKey]:    { type: INTEGER, allowNull: false, references: { model: parentModelClass, key: `id` } },    
  }, common_model_options);
  
  const Photo = <MyModelStatic> sequelize.define(`${parentModelName}Photo`, {
    ...common_model_fields,
    [foreignKey]:    { type: INTEGER, allowNull: false, references: { model: parentModelClass, key: `id` } },
    photo_id:                  { type: TEXT, allowNull: true },
    photo_link:                { type: TEXT, allowNull: true },
    photo_bucket:              { type: TEXT, allowNull: true },
    photo_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  const Video = <MyModelStatic> sequelize.define(`${parentModelName}Video`, {
    ...common_model_fields,
    [foreignKey]:    { type: INTEGER, allowNull: false, references: { model: parentModelClass, key: `id` } },
    video_id:                  { type: TEXT, allowNull: true },
    video_link:                { type: TEXT, allowNull: true },
    video_bucket:              { type: TEXT, allowNull: true },
    video_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  const Audio = <MyModelStatic> sequelize.define(`${parentModelName}Audio`, {
    ...common_model_fields,
    [foreignKey]:    { type: INTEGER, allowNull: false, references: { model: parentModelClass, key: `id` } },
    audio_id:                  { type: TEXT, allowNull: true },
    audio_link:                { type: TEXT, allowNull: true },
    audio_bucket:              { type: TEXT, allowNull: true },
    audio_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  
  
  const Comment = <MyModelStatic> sequelize.define(`${parentModelName}Comment`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    [foreignKey]:    { type: INTEGER, allowNull: false, references: { model: parentModelClass, key: `id` } },
    body:                { type: TEXT, allowNull: false },
  }, common_model_options);
  
  const CommentReaction = <MyModelStatic> sequelize.define(`${parentModelName}CommentReaction`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    reaction_type:            { type: STRING, allowNull: false },
  }, common_model_options);
  
  const CommentPhoto = <MyModelStatic> sequelize.define(`${parentModelName}CommentPhoto`, {
    ...common_model_fields,
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    photo_id:                  { type: TEXT, allowNull: true },
    photo_link:                { type: TEXT, allowNull: true },
    photo_bucket:              { type: TEXT, allowNull: true },
    photo_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  const CommentVideo = <MyModelStatic> sequelize.define(`${parentModelName}CommentVideo`, {
    ...common_model_fields,
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    video_id:                  { type: TEXT, allowNull: true },
    video_link:                { type: TEXT, allowNull: true },
    video_bucket:              { type: TEXT, allowNull: true },
    video_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  const CommentAudio = <MyModelStatic> sequelize.define(`${parentModelName}CommentAudio`, {
    ...common_model_fields,
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    audio_id:                  { type: TEXT, allowNull: true },
    audio_link:                { type: TEXT, allowNull: true },
    audio_bucket:              { type: TEXT, allowNull: true },
    audio_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  
  
  const CommentReply = <MyModelStatic> sequelize.define(`${parentModelName}CommentReply`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    body:                { type: TEXT, allowNull: false },
       
  }, common_model_options);
  
  const CommentReplyReaction = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyReaction`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    reply_id:            { type: INTEGER, allowNull: false, references: { model: CommentReply, key: `id` } },
    reaction_type:            { type: STRING, allowNull: false },
  }, common_model_options);
  
  const CommentReplyPhoto = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyPhoto`, {
    ...common_model_fields,
    reply_id:            { type: INTEGER, allowNull: false, references: { model: CommentReply, key: `id` } },
    photo_id:                  { type: TEXT, allowNull: true },
    photo_link:                { type: TEXT, allowNull: true },
    photo_bucket:              { type: TEXT, allowNull: true },
    photo_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  const CommentReplyVideo = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyVideo`, {
    ...common_model_fields,
    reply_id:            { type: INTEGER, allowNull: false, references: { model: CommentReply, key: `id` } },
    video_id:                  { type: TEXT, allowNull: true },
    video_link:                { type: TEXT, allowNull: true },
    video_bucket:              { type: TEXT, allowNull: true },
    video_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);
  
  const CommentReplyAudio = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyAudio`, {
    ...common_model_fields,
    reply_id:            { type: INTEGER, allowNull: false, references: { model: CommentReply, key: `id` } },
    audio_id:                  { type: TEXT, allowNull: true },
    audio_link:                { type: TEXT, allowNull: true },
    audio_bucket:              { type: TEXT, allowNull: true },
    audio_key:                 { type: TEXT, allowNull: true },    
  }, common_model_options);



  // relations

  if (!ignoreRelations) {
    User.hasMany(Comment, { as: `${parentModelNameLower}_comments`, foreignKey: `owner_id`, sourceKey: `id` });
    Comment.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
    User.hasMany(CommentReply, { as: `${parentModelNameLower}_comment_replies`, foreignKey: `owner_id`, sourceKey: `id` });
    CommentReply.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
  
    User.hasMany(Reaction, { as: `${parentModelNameLower}_reactions`, foreignKey: `owner_id`, sourceKey: `id` });
    Reaction.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
    User.hasMany(CommentReaction, { as: `${parentModelNameLower}_comment_reactions`, foreignKey: `owner_id`, sourceKey: `id` });
    CommentReaction.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
    User.hasMany(CommentReplyReaction, { as: `${parentModelNameLower}_comment_reply_reactions`, foreignKey: `owner_id`, sourceKey: `id` });
    CommentReplyReaction.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
    
    
  
    parentModelClass.hasMany(Viewer, { as: `${parentModelNameLower}_viewers`, foreignKey, sourceKey: `id` });
    Viewer.belongsTo(parentModelClass, { as: parentModelNameLower, foreignKey, targetKey: `id` });
    User.hasMany(Viewer, { as: `${parentModelNameLower}_viewings`, foreignKey: `user_id`, sourceKey: `id` });
    Viewer.belongsTo(User, { as: `viewer`, foreignKey: `user_id`, targetKey: `id` });
  
    parentModelClass.hasMany(Photo, { as: `${parentModelNameLower}_photos`, foreignKey, sourceKey: `id` });
    Photo.belongsTo(parentModelClass, { as: parentModelNameLower, foreignKey, targetKey: `id` });
    parentModelClass.hasMany(Video, { as: `${parentModelNameLower}_videos`, foreignKey, sourceKey: `id` });
    Video.belongsTo(parentModelClass, { as: parentModelNameLower, foreignKey, targetKey: `id` });
    parentModelClass.hasMany(Audio, { as: `${parentModelNameLower}_audios`, foreignKey, sourceKey: `id` });
    Audio.belongsTo(parentModelClass, { as: parentModelNameLower, foreignKey, targetKey: `id` });
  
    parentModelClass.hasMany(Reaction, { as: `reactions`, foreignKey, sourceKey: `id` });
    Reaction.belongsTo(parentModelClass, { as: parentModelNameLower, foreignKey, targetKey: `id` });
    parentModelClass.hasMany(Comment, { as: `comments`, foreignKey, sourceKey: `id` });
    Comment.belongsTo(parentModelClass, { as: parentModelNameLower, foreignKey, targetKey: `id` });
  
    Comment.hasMany(CommentPhoto, { as: `photos`, foreignKey: `comment_id`, sourceKey: `id` });
    CommentPhoto.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
    Comment.hasMany(CommentVideo, { as: `videos`, foreignKey: `comment_id`, sourceKey: `id` });
    CommentVideo.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
    Comment.hasMany(CommentAudio, { as: `audios`, foreignKey: `comment_id`, sourceKey: `id` });
    CommentAudio.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
    
    CommentReply.hasMany(CommentReplyPhoto, { as: `photos`, foreignKey: `reply_id`, sourceKey: `id` });
    CommentReplyPhoto.belongsTo(CommentReply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });
    CommentReply.hasMany(CommentReplyVideo, { as: `videos`, foreignKey: `reply_id`, sourceKey: `id` });
    CommentReplyVideo.belongsTo(CommentReply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });
    CommentReply.hasMany(CommentReplyAudio, { as: `audios`, foreignKey: `reply_id`, sourceKey: `id` });
    CommentReplyAudio.belongsTo(CommentReply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });
    
    Comment.hasMany(CommentReply, { as: `replies`, foreignKey: `comment_id`, sourceKey: `id` });
    CommentReply.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
    Comment.hasMany(CommentReaction, { as: `reactions`, foreignKey: `comment_id`, sourceKey: `id` });
    CommentReaction.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
    CommentReply.hasMany(CommentReplyReaction, { as: `reactions`, foreignKey: `reply_id`, sourceKey: `id` });
    CommentReplyReaction.belongsTo(CommentReply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });
  }
  


  return {
    Reaction,
    Viewer,
    Photo,
    Video,
    Audio,
  
    Comment,
    CommentReaction,
    CommentPhoto,
    CommentVideo,
    CommentAudio,
  
    CommentReply,
    CommentReplyReaction,
    CommentReplyPhoto,
    CommentReplyVideo,
    CommentReplyAudio,
  };
}