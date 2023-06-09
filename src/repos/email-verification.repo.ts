import {
  fn,
  Op,
  WhereOptions
} from 'sequelize';
import { UserEmailVerification } from '../models/avenger.model';



export async function create_email_verification(
  params: {
    user_id: number;
    email: string;
  }
) {
  const new_model = await UserEmailVerification.create(params);
  return new_model;
}

export async function query_email_verification(
  whereClause: WhereOptions
) {
  try {
    const model_updates = await UserEmailVerification.findOne({ where: whereClause });
    return model_updates;
  } catch (e) {
    console.log({
      errorMessage: `query_email_verf error - `,
      e,
      whereClause
    });
    throw e;
  }
}

export async function delete_email_verification(
  whereClause: WhereOptions
) {
  try {
    const model_updates = await UserEmailVerification.destroy({ where: whereClause });
    return model_updates;
  } catch (e) {
    console.log({
      errorMessage: `delete_email_verification error - `,
      e,
      whereClause
    });
    throw e;
  }
}

export async function update_email_verification(
  newState: Partial<{
    user_id: number;
    email: string;
    verification_code: string;
    verified: boolean;
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_model_update = await UserEmailVerification.update(
      newState,
      { where: whereClause }
    );
    return user_model_update;
  } catch (e) {
    console.log({
      errorMessage: `update_email_verf error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}