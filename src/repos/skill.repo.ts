import {
  fn,
  Includeable,
  Model,
  Op,
  WhereOptions
} from 'sequelize';
import { user_attrs_slim } from '../utils/constants.utils';
import {
  checkSkillName,
  create_model_crud_repo_from_model_class,
} from '../utils/helpers.utils';
import { Skill, User, UserSkill, UserSkillRating, UserSkillRatingReaction, UserSkillSubmitRequest } from '../models/avenger.model';
import { ISkill, IUserSkill, IUserSkillRating, IUserSkillRatingReaction, IUserSkillSubmitRequest } from '../interfaces/avenger.models.interface';
import { UserSkillAddDto, UserSkillRatingCreateDto } from '../dto/skill.dto';
import { STATUSES } from '../enums/common.enum';




const skill_crud = create_model_crud_repo_from_model_class<ISkill>(Skill);
const user_skill_crud = create_model_crud_repo_from_model_class<IUserSkill>(UserSkill);
const user_skill_submit_request_crud = create_model_crud_repo_from_model_class<IUserSkillSubmitRequest>(UserSkillSubmitRequest);
const user_skill_rating_crud = create_model_crud_repo_from_model_class<IUserSkillRating>(UserSkillRating);
const user_skill_rating_reaction_crud = create_model_crud_repo_from_model_class<IUserSkillRatingReaction>(UserSkillRatingReaction);

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
    model: UserSkill,
    as: `skill`,
  }, 
  {
    model: User,
    as: `writer`,
    attributes: user_attrs_slim
  },
];




export function get_skill_by_id(id: number): Promise<ISkill | null> {
  return skill_crud.findById(id);
}

export function get_skill_by_name(name: string): Promise<ISkill | null> {
  return skill_crud.findOne({
    where: { name: checkSkillName(name) },
  });
}





export function get_users_by_skill_id(skill_id: number): Promise<IUserSkill[]> {
  return user_skill_crud.findAll({
    where: { skill_id },
    include: user_skill_includes
  });
}

export function get_user_skill_by_id(id: number): Promise<IUserSkill | null> {
  return user_skill_crud.findOne({
    where: { id },
    include: user_skill_includes
  });
}

export function get_user_skills_by_user_id(user_id: number): Promise<IUserSkill[]> {
  return user_skill_crud.findAll({
    where: { user_id },
    include: user_skill_includes
  });
}

export function get_user_skills_by_submitter_id(submitter_id: number): Promise<IUserSkill[]> {
  return user_skill_crud.findAll({
    where: { submitter_id },
    include: user_skill_includes
  });
}



export function get_user_skill_rating_by_id(id: number): Promise<IUserSkillRating | null> {
  return user_skill_rating_crud.findOne({
    where: { id },
    include: user_skill_rating_includes,
  });
}

export function get_user_skill_ratings_by_writer_id(writer_id: number): Promise<IUserSkillRating | null> {
  return user_skill_rating_crud.findOne({
    where: { writer_id },
    include: user_skill_rating_includes,
  });
}



export function get_user_skills_all(user_id: number) {
  return user_skill_crud.findAll({
    where: { user_id },
    include: user_skill_includes
  });
}

export function get_user_skills(user_id: number, min_id?: number) {
  return user_skill_crud.paginate({
    user_id_field: 'user_id',
    user_id,
    min_id,
    include: user_skill_includes
  });
}


export function get_user_skill_ratings_all(user_skill_id: number) {
  return user_skill_rating_crud.findAll({
    where: { user_skill_id },
    include: user_skill_rating_includes
  });
}

export function get_user_skill_ratings(user_skill_id: number, min_id?: number) {
  return user_skill_rating_crud.paginate({
    user_id_field: 'user_skill_id',
    user_id: user_skill_id,
    min_id,
    include: user_skill_rating_includes
  });
}


export async function add_user_skill(dto: UserSkillAddDto): Promise<IUserSkill> {
  const data = await user_skill_crud.create(dto, { include: user_skill_includes });
  return data;
}

export async function remove_user_skill(id: number) {
  return user_skill_crud.deleteById(id);
}




export function get_user_skills_requests_submitted_all(user_id: number) {
  return user_skill_submit_request_crud.findAll({
    where: { submitter_id: user_id },
    include: user_skill_includes
  });
}

export function get_user_skills_requests_submitted(user_id: number, min_id?: number) {
  return user_skill_submit_request_crud.paginate({
    user_id_field: 'submitter_id',
    user_id,
    min_id,
    include: user_skill_includes
  });
}

export async function submit_user_skill(dto: UserSkillAddDto): Promise<IUserSkillSubmitRequest> {
  const data = await user_skill_submit_request_crud.create({ ...dto, status: STATUSES.PENDING }, { include: user_skill_includes });
  return data;
}
export function check_user_skill_submission_pending(dto: UserSkillAddDto) {
  return user_skill_submit_request_crud.findOne({
    where: { ...dto, status: STATUSES.PENDING },
    include: user_skill_includes
  });
}
export async function update_user_skill_submission(id: number, status: STATUSES) {
  const updates = await user_skill_submit_request_crud.updateById(id, { status });
  return user_skill_submit_request_crud.findById(id, {
    include: user_skill_includes
  }); 
}

export async function create_user_skill_rating(dto: UserSkillRatingCreateDto) {
  const data = await user_skill_rating_crud.create(dto, { include: user_skill_rating_includes });
  return data;
}



export function check_user_skill_rating_reaction(user_id: number, rating_id: number) {
  return user_skill_rating_reaction_crud.findOne({ where: { user_id, rating_id } });
}

export function add_user_skill_rating_reaction(params: { user_id: number, rating_id: number, reaction_type: string }) {
  return user_skill_rating_reaction_crud.create(params, { include: [{ model: User, as: 'user', attributes: user_attrs_slim }] });
}

export function update_user_skill_rating_reaction(id: number, reaction_type: string) {
  return user_skill_rating_reaction_crud.updateById(id, { reaction_type });
}

export function remove_user_skill_rating_reaction(id: number) {
  return user_skill_rating_reaction_crud.deleteById(id);
}