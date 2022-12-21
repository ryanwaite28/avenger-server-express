import {
  fn,
  Model,
  Op,
  WhereOptions
} from 'sequelize';
import { ApiKey, User, UserExpoDevice } from '../models/avenger.model';
import { PlainObject } from '../interfaces/common.interface';
import { user_attrs_slim } from '../utils/constants.utils';
import { convertModelCurry, convertModelsCurry, convertModel } from '../utils/helpers.utils';
import { IApiKey, IUser, IUserExpoDevice } from '../interfaces/app.interface';
import { UserSignUpDto } from '../dto/user.dto';




const convertUserModel = convertModelCurry<IUser>();
const convertUserModels = convertModelsCurry<IUser>();

const convertUserExpoDeviceModel = convertModelCurry<IUserExpoDevice>();
const convertUserExpoDeviceModels = convertModelsCurry<IUserExpoDevice>();



export async function get_user_by_where(
  whereClause: WhereOptions
) {
  const user_model = await User.findOne({
    where: whereClause,
    attributes: user_attrs_slim
  })
  .then(convertUserModel);
  return user_model;
}

export async function create_user(
  params: UserSignUpDto
) {
  const new_user_model = await User.create({
    ...params
  });
  const user = await get_user_by_id(new_user_model.dataValues.id);
  return user!;
}

export async function get_random_users(
  limit: number
) {
  const users = await User.findAll({
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
  .then(convertUserModels);
  return users;
}

export async function get_user_by_email(
  email: string
) {
  try {
    const userModel = await User.findOne({
      where: { email },
      attributes: user_attrs_slim
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_email error - `, e);
    return null;
  }
}

export async function get_user_by_paypal(
  paypal: string
) {
  try {
    const userModel = await User.findOne({
      where: { paypal },
      attributes: user_attrs_slim
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_paypal error - `, e);
    return null;
  }
}

export async function get_user_by_phone(
  phone: string
) {
  try {
    const userModel = await User.findOne({
      where: { phone },
      attributes: user_attrs_slim,
      include: [{
        model: UserExpoDevice,
        as: `expo_devices`,
      }],
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_phone error - `, e);
    return null;
  }
}



export async function get_user_by_id(id: number) {
  const user_model = await User.findOne({
    where: { id },
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
    attributes: {
      exclude: ['password']
    }
  })
  .then(convertUserModel);
  return user_model;
}

export async function get_user_by_stripe_customer_account_id(stripe_customer_account_id: string) {
  const user_model = await User.findOne({
    where: { stripe_customer_account_id },
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
    attributes: user_attrs_slim
  })
  .then(convertUserModel)
  .catch((err) => {
    console.log(`could not get user by stripe_customer_account_id`, { stripe_customer_account_id }, err);
    throw err;
  })
  return user_model;
}

export async function get_user_by_username(
  username: string
) {
  const user_model = await User.findOne({
    where: { username },
    attributes: { exclude: ['password'] },
    include: [{
      model: UserExpoDevice,
      as: `expo_devices`,
    }],
  })
  .then(convertUserModel);
  return user_model;
}

export async function get_user_by_uuid(
  uuid: string
) {
  try {
    const user_model = await User.findOne({
      where: { uuid },
      attributes: { exclude: ['password'] },
      include: [{
        model: UserExpoDevice,
        as: `expo_devices`,
      }],
    })
    .then(convertUserModel);
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

export async function update_user(
  newState: Partial<{
    email: string;
    paypal: string;
    username: string;
    phone: string | null;
    temp_phone: string | null;
    bio: string;
    location: string;
    password: string;
    icon_link: string;
    icon_id: string;
    wallpaper_link: string;
    wallpaper_id: string;
    email_verified: boolean;
    phone_verified: boolean;
    stripe_account_verified: boolean;
    stripe_account_id: string;
    stripe_customer_account_id: string;
    platform_subscription_id: string,
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_model_update = await User.update(
      newState as any,
      { where: whereClause }
    );
    return user_model_update;
  } catch (e) {
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
  return UserExpoDevice.findOne({
    where: { token,  }
  })
  .then(convertUserExpoDeviceModel);
}

export function get_user_expo_devices(user_id: number) {
  return UserExpoDevice.findAll({
    where: { user_id }
  })
  .then(convertUserExpoDeviceModels);
}

export function register_expo_device_and_push_token(user_id: number, token: string, device_info: PlainObject | null = null) {
  const params = {
    user_id,
    token,
    device_info: device_info && JSON.stringify(device_info)
  };
  console.log(`register_expo_device_and_push_token:`, { params });
  return UserExpoDevice.create(params)
  .then((model) => convertUserExpoDeviceModel(model)!);
}

export function remove_expo_device_from_user(token: string) {
  return UserExpoDevice.destroy({
    where: {
      token,
    }
  });
}

export function remove_expo_device_and_push_token(user_id: number, token: string) {
  return UserExpoDevice.destroy({
    where: {
      user_id,
      token,
    }
  });
}