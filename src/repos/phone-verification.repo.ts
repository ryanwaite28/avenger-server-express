import {
  fn,
  Op,
  WhereOptions
} from 'sequelize';
import { UserPhoneVerification } from '../models/avenger.model';



export async function create_phone_verification(
  params: {
    user_id: number;
    request_id: string;
    phone: string;
  }
) {
  const new_model = await UserPhoneVerification.create(params);
  return new_model;
}

export async function query_phone_verification(
  whereClause: WhereOptions
) {
  try {
    const model_updates = await UserPhoneVerification.findOne({ where: whereClause });
    return model_updates;
  } catch (e) {
    console.log({
      errorMessage: `query_phone_verification error - `,
      e,
      whereClause
    });
    throw e;
  }
}

export async function delete_phone_verification(
  whereClause: WhereOptions
) {
  try {
    const model_updates = await UserPhoneVerification.destroy({ where: whereClause });
    return model_updates;
  } catch (e) {
    console.log({
      errorMessage: `delete_phone_verification error - `,
      e,
      whereClause
    });
    throw e;
  }
}

export async function update_phone_verification(
  newState: Partial<{
    user_id: number;
    request_id: string;
    phone: string;
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_model_update = await UserPhoneVerification.update(
      newState,
      { where: whereClause }
    );
    return user_model_update;
  } catch (e) {
    console.log({
      errorMessage: `update_phone_verification error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}