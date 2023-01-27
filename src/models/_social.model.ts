import {
  STRING,
  TEXT,
  DATE,
  NOW,
  INTEGER,
} from 'sequelize';
import {
  MyModelStatic
} from '../interfaces/common.interface';
import {
  sequelizeInst as sequelize,
  common_model_options,
  common_model_fields,
} from './_def.model';




export function createSocialModels(params: {
  userModel: MyModelStatic,
  parentModelName: string,
  parentModelClass: MyModelStatic,
}) {

  const User = params.userModel;
  const { parentModelClass, parentModelName } = params;
  const parentModelNameLower = parentModelName.toLowerCase();
  const foreignKey: string = `${parentModelNameLower}_id`;



  const Comment = <MyModelStatic> sequelize.define(`${parentModelName}Comment`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    [foreignKey]:        { type: INTEGER, allowNull: true, references: { model: parentModelClass, key: `id` } },
    body:                { type: TEXT, allowNull: false },
    last_edited:         { type: DATE, allowNull: false, defaultValue: NOW },
  }, common_model_options);

  const CommentReaction = <MyModelStatic> sequelize.define(`${parentModelName}CommentReaction`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    reaction_id:         { type: INTEGER, allowNull: true },
    reaction:            { type: STRING, allowNull: false },
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



  const Reply = <MyModelStatic> sequelize.define(`${parentModelName}CommentReply`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    comment_id:          { type: INTEGER, allowNull: false, references: { model: Comment, key: `id` } },
    body:                { type: TEXT, allowNull: false },
  }, common_model_options);

  const ReplyReaction = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyReaction`, {
    ...common_model_fields,
    owner_id:            { type: INTEGER, allowNull: false, references: { model: User, key: `id` } },
    reply_id:            { type: INTEGER, allowNull: false, references: { model: Reply, key: `id` } },
    reaction_id:         { type: INTEGER, allowNull: true },
    reaction:            { type: STRING, allowNull: false },
  }, common_model_options);

  const ReplyPhoto = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyPhoto`, {
    ...common_model_fields,
    reply_id:            { type: INTEGER, allowNull: false, references: { model: Reply, key: `id` } },
    photo_id:                  { type: TEXT, allowNull: true },
    photo_link:                { type: TEXT, allowNull: true },
    photo_bucket:              { type: TEXT, allowNull: true },
    photo_key:                 { type: TEXT, allowNull: true },
  }, common_model_options);

  const ReplyVideo = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyVideo`, {
    ...common_model_fields,
    reply_id:            { type: INTEGER, allowNull: false, references: { model: Reply, key: `id` } },
    video_id:                  { type: TEXT, allowNull: true },
    video_link:                { type: TEXT, allowNull: true },
    video_bucket:              { type: TEXT, allowNull: true },
    video_key:                 { type: TEXT, allowNull: true },
  }, common_model_options);

  const ReplyAudio = <MyModelStatic> sequelize.define(`${parentModelName}CommentReplyAudio`, {
    ...common_model_fields,
    reply_id:            { type: INTEGER, allowNull: false, references: { model: Reply, key: `id` } },
    audio_id:                  { type: TEXT, allowNull: true },
    audio_link:                { type: TEXT, allowNull: true },
    audio_bucket:              { type: TEXT, allowNull: true },
    audio_key:                 { type: TEXT, allowNull: true },
  }, common_model_options);




  User.hasMany(Comment, { as: `${parentModelNameLower}_comments`, foreignKey: `owner_id`, sourceKey: `id` });
  Comment.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
  User.hasMany(Reply, { as: `user_${parentModelNameLower}_comment_replies`, foreignKey: `owner_id`, sourceKey: `id` });
  Reply.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });

  User.hasMany(CommentReaction, { as: `user_${parentModelNameLower}_comment_reactions`, foreignKey: `owner_id`, sourceKey: `id` });
  CommentReaction.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });
  User.hasMany(ReplyReaction, { as: `user_${parentModelNameLower}_comment_reply_reactions`, foreignKey: `owner_id`, sourceKey: `id` });
  ReplyReaction.belongsTo(User, { as: `owner`, foreignKey: `owner_id`, targetKey: `id` });



  Comment.hasMany(CommentPhoto, { as: `${parentModelNameLower}_comment_photos`, foreignKey: `comment_id`, sourceKey: `id` });
  CommentPhoto.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
  Comment.hasMany(CommentVideo, { as: `${parentModelNameLower}_comment_videos`, foreignKey: `comment_id`, sourceKey: `id` });
  CommentVideo.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
  Comment.hasMany(CommentAudio, { as: `${parentModelNameLower}_comment_audios`, foreignKey: `comment_id`, sourceKey: `id` });
  CommentAudio.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });

  Reply.hasMany(ReplyPhoto, { as: `${parentModelNameLower}_comment_reply_photos`, foreignKey: `reply_id`, sourceKey: `id` });
  ReplyPhoto.belongsTo(Reply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });
  Reply.hasMany(ReplyVideo, { as: `${parentModelNameLower}_comment_reply_videos`, foreignKey: `reply_id`, sourceKey: `id` });
  ReplyVideo.belongsTo(Reply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });
  Reply.hasMany(ReplyAudio, { as: `${parentModelNameLower}_comment_reply_audios`, foreignKey: `reply_id`, sourceKey: `id` });
  ReplyAudio.belongsTo(Reply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });

  Comment.hasMany(Reply, { as: `replies`, foreignKey: `comment_id`, sourceKey: `id` });
  Reply.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });
  Comment.hasMany(CommentReaction, { as: `reactions`, foreignKey: `comment_id`, sourceKey: `id` });
  CommentReaction.belongsTo(Comment, { as: `comment`, foreignKey: `comment_id`, targetKey: `id` });

  Reply.hasMany(ReplyReaction, { as: `reactions`, foreignKey: `reply_id`, sourceKey: `id` });
  ReplyReaction.belongsTo(Reply, { as: `reply`, foreignKey: `reply_id`, targetKey: `id` });


  return {
    Comment,
    CommentReaction,
    CommentPhoto,
    CommentVideo,
    CommentAudio,
    
    Reply,
    ReplyReaction,
    ReplyPhoto,
    ReplyVideo,
    ReplyAudio,
  };

}