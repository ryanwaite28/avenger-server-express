import {
  col,
  fn,
  Model,
  Op,
  where,
  WhereOptions
} from 'sequelize';
import { ApiKey, User, UserExpoDevice, UserCoreModels } from '../models/avenger.model';
import { PlainObject } from '../interfaces/common.interface';
import { user_attrs_slim } from '../utils/constants.utils';
import { convertModelCurry, convertModelsCurry, convertModel, create_model_crud_repo_from_model_class } from '../utils/helpers.utils';
import { IApiKey, IUser, IUserExpoDevice, IFollow } from '../interfaces/avenger.models.interface';
import { UpdateUserDto, UserSignUpDto, UserSignInDto } from '../dto/user.dto';
import { MODELS } from '../enums/avenger.enum';
// import { analytic_crud, comment_crud, contentskill_crud, follow_crud, rating_crud, reaction_crud, reply_crud } from "./_base-model.repo";
import { generic_owner_include } from "./_common.repo";




export const user_crud = create_model_crud_repo_from_model_class<IUser>(User);
const follow_crud = create_model_crud_repo_from_model_class<IFollow>(UserCoreModels[MODELS.FOLLOW]);
const user_expo_device_crud = create_model_crud_repo_from_model_class<IUserExpoDevice>(UserExpoDevice);



export async function get_user_by_where(whereClause: WhereOptions) {
  const user = await user_crud.findOne({
    where: whereClause,
    attributes: user_attrs_slim
  });
  return user;
}

export async function create_user(params: UserSignUpDto) {
  const createOptions = { ...params };
  const new_user_model = await User.create(createOptions);
  const user = await get_user_by_id(new_user_model.dataValues.id);
  return user!;
}

export function get_users_by_like_query(query: string, exclude_user_id: number = -1) {
  const useQuery = query.replace(/\%/gi, '').toLowerCase(); // strip possible percentages
  const useWhere = {
    id: {
      [Op.ne]: exclude_user_id
    },
    [Op.or]: [
      { username: where(fn('LOWER', col('username')), 'LIKE', '%' + useQuery + '%'), },
      { displayname: where(fn('LOWER', col('displayname')), 'LIKE', '%' + useQuery + '%'), },
    ]
  };
  console.log(useWhere);
  return user_crud.findAll({
    where: useWhere,
    attributes: user_attrs_slim,
    limit: 20,
    order: [['displayname', 'ASC']]
  });
}

export async function get_random_users(limit: number) {
  const users = await user_crud.findAll({
    limit,
    order: [fn( 'RANDOM' )],
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
    attributes: [
      'id',
      'username',
      'icon_link',
      'uuid',
      'created_at',
      'updated_at',
      'deleted_at',
    ]
  })
  return users;
}

export async function get_user_by_email(email: string) {
  try {
    const userModel = await user_crud.findOne({
      where: { email },
      attributes: user_attrs_slim
    })
    return userModel;
  } catch (e) {
    console.log(`get_user_by_email error - `, e);
    return null;
  }
}

export async function get_user_by_paypal(paypal: string) {
  try {
    const userModel = await user_crud.findOne({
      where: { paypal },
      attributes: user_attrs_slim
    });
    return userModel;
  } catch (e) {
    console.log(`get_user_by_paypal error - `, e);
    return null;
  }
}

export async function get_user_by_phone(phone: string) {
  try {
    const userModel = await user_crud.findOne({
      where: { phone },
      attributes: user_attrs_slim,
      include: [{
        model: UserExpoDevice,
        as: `expo_devices`,
      }],
    });
    return userModel;
  } catch (e) {
    console.log(`get_user_by_phone error - `, e);
    return null;
  }
}



export async function get_user_by_id(id: number) {
  const user_model = await user_crud.findOne({
    where: { id },
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
    attributes: {
      exclude: ['password']
    }
  });
  return user_model;
}

export async function get_user_by_stripe_customer_account_id(stripe_customer_account_id: string) {
  const user_model = await user_crud.findOne({
    where: { stripe_customer_account_id },
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
    attributes: user_attrs_slim
  });
  return user_model;
}

export async function get_user_by_username(username: string) {
  const user_model = await user_crud.findOne({
    where: { username },
    attributes: { exclude: ['password'] },
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
  })
  return user_model;
}

export async function get_user_by_uuid(uuid: string) {
  try {
    const user_model = await user_crud.findOne({
      where: { uuid },
      attributes: { exclude: ['password'] },
      include: [{
        model: UserExpoDevice,
        as: `expo_devices`,
      }],
    });
    return user_model;
  } catch (e) {
    console.log({
      errorMessage: `get_user_by_uuid error - `,
      e,
      uuid
    });
    return null;
  }
}

export async function update_user(newState: Partial<UpdateUserDto>, whereClause: WhereOptions) {
  try {
    const user_model_update = await user_crud.update(newState, { where: whereClause, returning: true });
    return user_model_update;
  }
  catch (e) {
    console.log({
      errorMessage: `update_user error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}

export function get_api_key(key: string) {
  return ApiKey.findOne({
    where: { key },
    include: [{
      model: User,
      as: 'user',
      attributes: user_attrs_slim
    }]
  })
  .then((model: Model | null) => convertModel<IApiKey>(model));
}

export function get_user_api_key(user_id: number) {
  return ApiKey.findOne({
    where: { user_id },
    include: [{
      model: User,
      as: 'user',
      attributes: user_attrs_slim
    }]
  })
  .then((model: Model | null) => convertModel<IApiKey>(model));
}

export async function create_user_api_key(params: {
  user_id:             number,
  firstname:           string,
  middlename:          string,
  lastname:            string,
  email:               string,
  phone:               string,
  website:             string,
  subscription_plan:   string,
}) {
  const new_key = await ApiKey.create(params).then((model: Model | null) => convertModel<IApiKey>(model));
  return new_key!;
}


export function get_user_expo_device_by_token(token: string) {
  return user_expo_device_crud.findOne({
    where: { token,  }
  })
}

export function get_user_expo_devices(user_id: number) {
  return user_expo_device_crud.findAll({
    where: { user_id }
  });
}

export function register_expo_device_and_push_token(params: {
  user_id: number,
  token: string,
  device_info?: PlainObject | null 
}) {
  const { user_id, token, device_info } = params;
  const useDeviceInfo = device_info && JSON.stringify(device_info);
  const createParams = { user_id, token, device_info: useDeviceInfo };
  console.log(`register_expo_device_and_push_token:`, { createParams });
  return user_expo_device_crud.create(params);
}

export function remove_expo_device_from_user(token: string) {
  return user_expo_device_crud.delete({
    where: {
      token,
    }
  });
}

export function remove_expo_device_and_push_token(user_id: number, token: string) {
  return user_expo_device_crud.delete({
    where: {
      user_id,
      token,
    }
  });
}




export async function get_user_followings_ids(user_id: number) {
  const ids: number[] = await follow_crud.findAll({
    where: { user_id },
    attributes: ['follow_id'],
  })
  .then((models) => models.map(m => m.follow_id));
  return ids;
}

export async function get_user_followers_ids(user_id: number) {
  const ids: number[] = await follow_crud.findAll({
    where: { user_id },
    attributes: ['user_id'],
  })
  .then((models) => models.map(m => m.user_id));
  return ids;
}

export async function check_user_follow(user_id: number, follow_id: number) {
  const check = await follow_crud.findOne({
    where: { user_id, follow_id },
  });
  return check;
}

export async function create_user_follow(user_id: number, follow_id: number) {
  const follow = await follow_crud.create(
    { user_id, follow_id },
  );
  return follow;
}

export async function delete_user_follow(user_id: number, follow_id: number) {
  const deletes = await follow_crud.destroy({
    where: { user_id, follow_id },
  });
  return deletes;
}