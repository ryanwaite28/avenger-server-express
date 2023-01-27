import {
  JSON as JSON_TYPE,
  STRING, TEXT,
  DATE, NOW,
  BOOLEAN,
  INTEGER,
  UUIDV1, UUIDV4,
  fn, Op, col, where, literal
} from 'sequelize';
import { STATUSES } from '../enums/common.enum';
import { v4 as uuidv4 } from 'uuid';

import { AVENGER_ADMIN_ROLES, AVENGER_SKILL_STATUS, INTERVIEW_VIEW_STATE, MODELS } from '../enums/avenger.enum';
import { MyModelStatic, PlainObject } from '../interfaces/common.interface';
import {
  sequelizeInst as sequelize,
  common_model_options,
  common_model_fields,
  core_model_options,
} from './_def.model';






interface childCoreModelCreateFnArgs {
  userModel: MyModelStatic,
  ignoreRelationships?: boolean,
  parentModelName: string,
  parentModelClass: MyModelStatic,
  foreignKey: string,
}

interface childCoreModelCreateFn {
  (params: childCoreModelCreateFnArgs): MyModelStatic;
}

const childCoreModelCreateFnByModelMap: { [key in MODELS]?: childCoreModelCreateFn } = {
  [MODELS.ANALYTIC]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Analytic`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
      
      user_id:                   { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
      event:                     { type: TEXT, allowNull: true },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_analytics`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });

      params.userModel.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_analytics`, foreignKey: 'user_id', sourceKey: 'id' });
      childModel.belongsTo(params.userModel, { as: `${params.parentModelName.toLowerCase()}_user`, foreignKey: 'user_id', targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.MENTION]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Mention`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      user_id:              { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_mentions`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });

      params.userModel.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_mentions`, foreignKey: 'user_id', sourceKey: 'id' });
      childModel.belongsTo(params.userModel, { as: `${params.parentModelName.toLowerCase()}_user`, foreignKey: 'user_id', targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.REACTION]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Reaction`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      user_id:              { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
      reaction_type:        { type: STRING, allowNull: false, defaultValue: '' },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `reactions`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });

      params.userModel.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_reactions`, foreignKey: 'user_id', sourceKey: 'id' });
      childModel.belongsTo(params.userModel, { as: `user`, foreignKey: 'user_id', targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.COMMENT]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Comment`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      owner_id:             { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
      body:                 { type: TEXT, allowNull: false, defaultValue: '' },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `comments`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });

      params.userModel.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_comments`, foreignKey: 'user_id', sourceKey: 'id' });
      childModel.belongsTo(params.userModel, { as: `owner`, foreignKey: 'user_id', targetKey: 'id' });
    }

    return childModel;
  },

  [MODELS.RATING]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Rating`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      writer_id:            { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
      aspect:               { type: STRING, allowNull: true, defaultValue: true },
      rating:               { type: INTEGER, allowNull: false, defaultValue: 5 },
      title:                { type: STRING, allowNull: false, defaultValue: '' },
      summary:              { type: TEXT, allowNull: false, defaultValue: '' },
      image_link:           { type: STRING, allowNull: true, defaultValue: '' },
      image_id:             { type: STRING, allowNull: true, defaultValue: '' },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_ratings`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });

      params.userModel.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_ratings_written`, foreignKey: 'writer_id', sourceKey: 'id' });
      childModel.belongsTo(params.userModel, { as: `writer`, foreignKey: 'writer_id', targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.PHOTO]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Photo`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      photo_id:                  { type: TEXT, allowNull: true },
      photo_link:                { type: TEXT, allowNull: true },
      photo_bucket:              { type: TEXT, allowNull: true },
      photo_key:                 { type: TEXT, allowNull: true },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `photos`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.VIDEO]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Video`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      video_id:                  { type: TEXT, allowNull: true },
      video_link:                { type: TEXT, allowNull: true },
      video_bucket:              { type: TEXT, allowNull: true },
      video_key:                 { type: TEXT, allowNull: true },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `videos`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.AUDIO]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Audio`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      audio_id:                  { type: TEXT, allowNull: true },
      audio_link:                { type: TEXT, allowNull: true },
      audio_bucket:              { type: TEXT, allowNull: true },
      audio_key:                 { type: TEXT, allowNull: true },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `audios`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });
    }
    return childModel;
  },

  [MODELS.FIELD]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Field`, {
      ...common_model_fields,
      [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    
      fieldname:            { type: STRING, allowNull: false, defaultValue: '' },
      fieldvalue:           { type: STRING, allowNull: false, defaultValue: '' },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `fields`, foreignKey: params.foreignKey, sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: params.foreignKey, targetKey: 'id' });
    }
    return childModel;
  },

  // [MODELS.ACTION_REQUEST]: (params: childCoreModelCreateFnArgs) => {
  //   const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}ActionRequest`, {
  //     ...common_model_fields,
  //     [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
      
    
  //     from_id:              { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
  //     to_id:                { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
  //     action:               { type: STRING, allowNull: false },
  //     status:               { type: STRING, allowNull: false, defaultValue: STATUSES.PENDING },
  //   }, common_model_options);

  //   return childModel;
  // },

  [MODELS.FOLLOW]: (params: childCoreModelCreateFnArgs) => {
    const childModel = <MyModelStatic> sequelize.define(`${params.parentModelName}Follow`, {
      ...common_model_fields,
      user_id:                { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
      follow_id:              { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
    }, common_model_options);
    if (!params.ignoreRelationships) {
      params.parentModelClass.hasMany(childModel, { as: `followers`, foreignKey: 'follow_id', sourceKey: 'id' });
      childModel.belongsTo(params.parentModelClass, { as: params.parentModelName.toLowerCase(), foreignKey: 'follow_id', targetKey: 'id' });

      params.userModel.hasMany(childModel, { as: `${params.parentModelName.toLowerCase()}_followings`, foreignKey: 'user_id', sourceKey: 'id' });
      childModel.belongsTo(params.userModel, { as: `follow`, foreignKey: 'user_id', targetKey: 'id' });
    }
    return childModel;
  },
};


export function createChildCoreModels (params: {
  userModel: MyModelStatic,
  parentModelName: string,
  parentModelClass: MyModelStatic,
  childrenModelDefs: { childModelName: MODELS, ignoreRelationships?: boolean, }[],
  foreignKey?: string,
}) {

  const parentModelNameLower = params.parentModelName.toLowerCase();
  const foreignKey: string = params.foreignKey || `${parentModelNameLower}_id`;
  const childrenModelsMap: PlainObject<MyModelStatic> = {};

  for (const childModelType of params.childrenModelDefs) {
    if (childrenModelsMap[childModelType.childModelName]) {
      continue;
    }
    const createChildCoreModelFn = childCoreModelCreateFnByModelMap[childModelType.childModelName];
    const childModel = createChildCoreModelFn({
      userModel: params.userModel,
      parentModelClass: params.parentModelClass,
      parentModelName: params.parentModelName,
      ignoreRelationships: childModelType.ignoreRelationships,
      foreignKey: foreignKey
    });
    childrenModelsMap[childModelType.childModelName] = childModel;
    
    if (childModelType.childModelName === MODELS.COMMENT) {
      // reply only exists under a comment
      const replyModel = <MyModelStatic> sequelize.define(`${params.parentModelName}CommentReply`, {
        ...common_model_fields,
        // reply depends on comment; no need for [params.foreignKey]:       { type: INTEGER, allowNull: false, references: { model: params.parentModelClass, key: 'id' } },
      
        owner_id:             { type: INTEGER, allowNull: false, references: { model: params.userModel, key: 'id' } },
        comment_id:           { type: INTEGER, allowNull: false, references: { model: childModel, key: 'id' } },
        body:                 { type: TEXT, allowNull: false, defaultValue: '' },
      }, common_model_options);
      childModel.hasMany(replyModel, { as: `${params.parentModelName.toLowerCase()}_comment_replies`, foreignKey: 'comment_id', sourceKey: 'id' });
      replyModel.belongsTo(childModel, { as: `comment`, foreignKey: foreignKey, targetKey: 'id' });

      params.userModel.hasMany(replyModel, { as: `${params.parentModelName.toLowerCase()}_comment_replies`, foreignKey: 'writer_id', sourceKey: 'id' });
      replyModel.belongsTo(params.userModel, { as: `owner`, foreignKey: 'owner_id', targetKey: 'id' });
      childrenModelsMap[MODELS.REPLY] = replyModel;
    }
  }

  return childrenModelsMap;
}