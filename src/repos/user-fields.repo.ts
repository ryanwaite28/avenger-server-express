import { MODELS } from '../enums/avenger.enum';
import {
  WhereOptions
} from 'sequelize';
import { UserCoreModels } from '../models/avenger.model';



export async function create_user_field(
  params: {
    user_id: number,
    fieldname: string,
    fieldvalue: string,
  }
) {
  const {
    user_id,
    fieldname,
    fieldvalue,
  } = params;
  const user_field = await UserCoreModels[MODELS.FIELD].create({
    target_type: MODELS.USER,
    target_id: user_id,
    fieldname,
    fieldvalue,
  });
  return user_field;
}

export async function update_user_field(
  newState: Partial<{
    fieldname: string,
    fieldvalue: string,
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_field_update = await UserCoreModels[MODELS.FIELD].update(
      newState,
      { where: whereClause }
    );
    return user_field_update;
  } catch (e) {
    console.log({
      errorMessage: `update_user_field error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}

export async function delete_user_field(
  whereClause: WhereOptions
) {
  try {
    const user_field_destroy = await UserCoreModels[MODELS.FIELD].destroy(
      { where: whereClause }
    );
    return user_field_destroy;
  } catch (e) {
    console.log({
      e,
      whereClause,
      errorMessage: `delete_user_field error - `,
    });
    throw e;
  }
}
