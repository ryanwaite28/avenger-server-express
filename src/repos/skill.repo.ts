import {
  col,
  fn,
  Includeable,
  Model,
  Op,
  where,
  WhereOptions
} from 'sequelize';
import { user_attrs_slim } from '../utils/constants.utils';
import {
  checkSkillName,
  create_model_crud_repo_from_model_class,
} from '../utils/helpers.utils';

import { Skill, User } from '../models/avenger.model';
import { ISkill, IRating, IUser } from '../interfaces/avenger.models.interface';
import { UserSkillAddDto, UserSkillRatingCreateDto } from '../dto/skill.dto';
import { STATUSES } from '../enums/common.enum';
import { MODELS } from '../enums/avenger.enum';
// import { analytic_crud, comment_crud, skill_crud, rating_crud, reaction_crud, reply_crud, skill_crud } from "./_base-model.repo";
import { generic_owner_include } from "./_common.repo";
import { user_crud } from './users.repo';


export const skill_crud = create_model_crud_repo_from_model_class<ISkill>(Skill);



const user_skill_includes: Includeable[] = [
  {
    model: Skill,
    as: `skill`,
  },
  {
    model: User,
    as: `submitter`,
    attributes: user_attrs_slim
  },
  {
    model: User,
    as: `user`,
    attributes: user_attrs_slim
  },
];

const user_skill_rating_includes: Includeable[] = [
  {
    model: User,
    as: `writer`,
    attributes: user_attrs_slim
  },
];





/** READ */

export function get_skill_by_id(id: number): Promise<ISkill | null> {
  return skill_crud.findById(id);
}

export function get_skill_by_name(name: string): Promise<ISkill | null> {
  return skill_crud.findOne({
    where: { name: checkSkillName(name) },
  });
}

export function get_skill_by_like_query(query: string) {
  const useQuery = query.replace(/%/gi, ''); // strip possible percentages
  return skill_crud.findAll({
    where: {
      name: where(fn('LOWER', col('name')), 'LIKE', '%' + useQuery + '%'),
    },
    limit: 20,
    order: [['name', 'ASC']]
  });
}




export function get_users_by_skill_id(skill_id: number): Promise<IUser[]> {
  return user_crud.findAll({
    include: { model: Skill, through: { where: { 'SkillId': skill_id } } }
  });
}

export function get_user_skill_by_id(id: number): Promise<ISkill | null> {
  return skill_crud.findOne({
    where: { id },
    include: user_skill_includes
  });
}

export function get_user_skills_by_user_id(user_id: number): Promise<ISkill[]> {
  return skill_crud.findAll({
    where: { user_id },
    include: user_skill_includes
  });
}


// export function get_user_skill_rating_by_id(id: number): Promise<IRating | null> {
//   return rating_crud.findOne({
//     where: { id },
//     include: user_skill_rating_includes,
//   });
// }

// export function get_user_skill_ratings_by_writer_id(writer_id: number): Promise<IRating | null> {
//   return rating_crud.findOne({
//     where: { writer_id, target_type: MODELS.USER },
//     include: user_skill_rating_includes,
//   });
// }



export function get_user_skills_all(user_id: number) {
  return skill_crud.findAll({
    where: { user_id },
    include: user_skill_includes
  });
}

export function get_user_skills(user_id: number, min_id?: number) {
  return skill_crud.paginate({
    user_id_field: 'user_id',
    user_id,
    min_id,
    include: user_skill_includes
  });
}


// export function get_user_skill_ratings_all(user_skill_id: number) {
//   return rating_crud.findAll({
//     where: { user_skill_id },
//     include: user_skill_rating_includes
//   });
// }

// export function get_user_skill_ratings(user_skill_id: number, min_id?: number) {
//   return rating_crud.paginate({
//     user_id_field: 'user_skill_id',
//     user_id: user_skill_id,
//     min_id,
//     include: user_skill_rating_includes
//   });
// }

// export function check_user_skill_rating_reaction(user_id: number, rating_id: number) {
//   return reaction_crud.findOne({ where: { user_id, target_id: rating_id, target_type: MODELS.CONTENT_SKILL } });
// }



/** CREATE */

// export function add_user_skill_rating_reaction(params: { user_id: number, rating_id: number, reaction_type: string }) {
//   return reaction_crud.create({
//     user_id: params.user_id,
//     reaction_type: params.reaction_type,
//     target_id: params.rating_id,
//     target_type: MODELS.CONTENT_SKILL,
//   }, { include: [{ model: User, as: 'user', attributes: user_attrs_slim }] });
// }

export async function add_user_skill(dto: UserSkillAddDto): Promise<ISkill> {
  const data = await skill_crud.create(dto, { include: user_skill_includes });
  return data;
}


// export async function create_user_skill_rating(dto: UserSkillRatingCreateDto) {
//   const data = await rating_crud.create({
//     writer_id: dto.writer_id,
//     aspect: dto.aspect,
//     rating: dto.rating,
//     title: dto.title,
//     summary: dto.summary,
//     tags: dto.tags,
//     image_link: dto.image_link,
//     image_id: dto.image_id,
//     target_id: dto.skill_id,
//     target_type: MODELS.CONTENT_SKILL,
//   }, { include: user_skill_rating_includes });
//   return data;
// }






/** UPDATE */

// export function update_user_skill_rating_reaction(id: number, reaction_type: string) {
//   return reaction_crud.updateById(id, { reaction_type });
// }





/** DELETE */

export async function remove_user_skill(id: number) {
  return skill_crud.deleteById(id);
}

// export function remove_user_skill_rating_reaction(id: number) {
//   return reaction_crud.deleteById(id);
// }
