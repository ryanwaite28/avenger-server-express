import {
  fn,
  Model,
  Op,
  WhereOptions
} from 'sequelize';
import { user_attrs_slim } from '../utils/constants.utils';
import { checkSkillName, convertModelCurry, convertModelsCurry } from '../utils/helpers.utils';
import { Skill, User, UserSkill, UserSkillRating } from '../models/avenger.model';
import { ISkill } from '../interfaces/avenger.models.interface';



const convertSkillModel = convertModelCurry<ISkill>();
const convertSkillModels = convertModelsCurry<ISkill>();




export function get_skill_by_name(name: string): Promise<ISkill | null> {
  return Skill.findOne({
    where: { name: checkSkillName(name) },
    include: [
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
    ]
  }).then(convertSkillModel);
}



export function get_user_skill_by_id(id: number) {
  return UserSkill.findOne({
    where: { id },
    include: [
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
    ]
  }).then()
}

export function get_user_skills_by_user_id(user_id: number) {
  return UserSkill.findAll({
    where: { user_id },
    include: [
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
    ]
  })
}

export function get_user_skills_by_submitter_id(submitter_id: number) {
  return UserSkill.findAll({
    where: { submitter_id },
    include: [
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
    ]
  })
}



export function get_user_skill_rating_by_id(id: number) {
  return UserSkillRating.findOne({
    where: { id },
    include: [
      {
        model: UserSkill,
        as: `skill`,
      },
      
      {
        model: User,
        as: `writer`,
        attributes: user_attrs_slim
      },
    ]
  })
}

export function get_user_skill_ratings_by_writer_id(id: number) {
  return UserSkillRating.findOne({
    where: { id },
    include: [
      {
        model: UserSkill,
        as: `skill`,
      },
      
      {
        model: User,
        as: `writer`,
        attributes: user_attrs_slim
      },
    ]
  })
}