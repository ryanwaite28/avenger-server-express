import { col, fn, Includeable, Model, Op, WhereOptions } from "sequelize";
import { user_attrs_slim } from "../utils/constants.utils";
import { create_model_crud_repo_from_model_class } from "../utils/helpers.utils";

import { Interview, Skill, User, InterviewSocialModels, InterviewCoreModels, InterviewSkills } from "../models/avenger.model";
import {
  IAnalytic,
  IComment,
  IInterview,
  IInterviewStats,
  IInterviewUserAnalyticInfo,
  IRating,
  IReaction,
  IReply,
} from "../interfaces/avenger.models.interface";
import { STATUSES } from "../enums/common.enum";
import { ANALYTIC_EVENTS, INTERVIEW_STAT, MODELS } from "../enums/avenger.enum";
import { PlainObject } from "../interfaces/common.interface";
import { get_user_followings_ids } from "./users.repo";
import {
  InterviewCommentCreateDto,
  InterviewCommentReplyCreateDto,
  InterviewCommentReplyUpdateDto,
  InterviewCommentUpdateDto,
  InterviewCreateDto,
  InterviewUpdateDto,
} from "../dto/interview.dto";
import { generic_owner_include } from "./_common.repo";




// console.log({ InterviewCoreModels, InterviewSocialModels });

const interview_crud = create_model_crud_repo_from_model_class<IInterview>(Interview);
const interview_analytic_crud = create_model_crud_repo_from_model_class<IAnalytic>(InterviewCoreModels[MODELS.ANALYTIC]);
const interview_reaction_crud = create_model_crud_repo_from_model_class<IReaction>(InterviewSocialModels.Reaction);
const interview_rating_crud = create_model_crud_repo_from_model_class<IRating>(InterviewCoreModels[MODELS.RATING]);

const interview_comment_crud = create_model_crud_repo_from_model_class<IComment>(InterviewSocialModels.Comment);
const interview_comment_reaction_crud = create_model_crud_repo_from_model_class<IReaction>(InterviewSocialModels.CommentReaction);

const interview_comment_reply_crud = create_model_crud_repo_from_model_class<IReply>(InterviewSocialModels.CommentReply);
const interview_comment_reply_reaction_crud = create_model_crud_repo_from_model_class<IReaction>(InterviewSocialModels.CommentReplyReaction);


const interview_general_includes: Includeable[] = [
  // { model: Skill },
  { model: User, as: `owner`, attributes: user_attrs_slim },
  { model: User, as: `interviewer`, attributes: user_attrs_slim },
  { model: User, as: `interviewee`, attributes: user_attrs_slim },

  { model: InterviewSocialModels.Comment, as: `comments`, attributes: null, limit: 0, separate: true,  },
];

// include: [{ model: Reply, as: `replies`, attributes: null, limit: 0, separate: true }]







/** READ */

export function get_interview_by_id_slim(id: number) {
  return interview_crud.findOne({
    where: { id }
  });
}
export function get_interview_comment_by_id_slim(id: number) {
  return interview_comment_crud.findOne({
    where: { id }
  });
}
export function get_interview_comment_reply_by_id_slim(id: number) {
  return interview_comment_reply_crud.findOne({
    where: { id }
  });
}



export function get_interview_by_id(id: number) {
  return interview_crud.findOne({
    where: { id },
    include: interview_general_includes
  });
}
export function get_interview_comment_by_id(id: number) {
  return interview_comment_crud.findOne({
    where: { id },
    include: generic_owner_include
  });
}
export function get_interview_comment_reply_by_id(id: number) {
  return interview_comment_reply_crud.findOne({
    where: { id },
    include: generic_owner_include
  });
}



export function get_latest_trending_skills_on_interviews() {
  return InterviewSkills.findAll({
    include: [
      { model: Interview, as: 'interview' },
      { model: Skill, as: 'skill' },
    ],
    attributes: [
      [fn('COUNT', col('InterviewSkills.interview_id')), 'skills_count']
    ],
    group: ["interview.id", "skill.id"],
    order: [
      ['skills_count', 'DESC']
    ],
    limit: 5,
  });
}

export async function get_feed_content_for_user(user_id: number, timestamp?: string | Date) {
  const user_followings_ids = await get_user_followings_ids(user_id);
  const ids = [user_id, ...user_followings_ids];
  console.log({ ids });

  const useWhere = timestamp
    ? { owner_id: ids, created_at: { [Op.lt]: timestamp } }
    : { owner_id: ids }

  return interview_crud.findAll({
    where: useWhere,
    include: interview_general_includes,
    limit: 5,
    order: [['id', 'DESC']]
  });
}

export async function get_user_activity_on_interview(owner_id: number, interview_id: number): Promise<IInterviewUserAnalyticInfo> {
  const seen = await interview_analytic_crud.findOne({ where: { user_id: owner_id, interview_id, event: ANALYTIC_EVENTS.SEEN } });
  const details_expanded = await interview_analytic_crud.findOne({ where: { user_id: owner_id, interview_id, event: ANALYTIC_EVENTS.DETAILS_EXPANDED } });
  const reacted = await interview_reaction_crud.findOne({ where: { interview_id, owner_id } });
  const commented = await interview_comment_crud.findOne({ where: { interview_id, owner_id } });

  const info: IInterviewUserAnalyticInfo = {
    seen,
    details_expanded,
    reacted,
    commented: commented as any
  };

  return info;
}
export async function get_user_activity_on_interview_comment(owner_id: number, interview_id: number): Promise<any> {
  const reacted = await interview_comment_reaction_crud.findOne({ where: { interview_id, owner_id } });
  const replied = await interview_comment_reply_crud.findOne({ where: { interview_id, owner_id } });

  const info: any = {
    reacted,
    replied
  };

  return info;
}
export async function get_user_activity_on_interview_comment_reply(owner_id: number, interview_id: number): Promise<any> {
  const reacted = await interview_reaction_crud.findOne({ where: { interview_id, owner_id } });

  const info: any = {
    reacted,
  };

  return info;
}


export function get_interview_comments_all(interview_id: number) {
  return interview_comment_crud.findAll({
    where: { interview_id },
    include: [
      ...generic_owner_include,
      { model: InterviewSocialModels.CommentReply, as: `replies`, attributes: null, limit: 0, separate: true,  },
    ],
  });
}
export function get_interview_comments(interview_id: number, min_id?: number) {
  return interview_comment_crud.paginate({
    user_id_field: 'interview_id',
    user_id: interview_id,
    min_id,
    include: [
      ...generic_owner_include,
      { model: InterviewSocialModels.CommentReply, as: `replies`, attributes: null, limit: 0, separate: true,  },
    ],
  });
}



export function get_interview_comment_replies_all(comment_id: number) {
  return interview_comment_reply_crud.findAll({
    where: { comment_id },
    include: generic_owner_include
  });
}
export function get_interview_comment_replies(comment_id: number, min_id?: number) {
  return interview_comment_reply_crud.paginate({
    user_id_field: 'comment_id',
    user_id: comment_id,
    min_id,
    include: generic_owner_include
  });
}



export async function get_interview_stats(interview_id: number): Promise<IInterviewStats> {
  const skills_count = await InterviewSkills.count({ where: { interview_id } });
  const interviewer_rating: any = await interview_rating_crud.findOne({
    where: { interview_id },
    attributes: [
      [fn('AVG', col('rating')), 'avg'],
      [fn('COUNT', col('rating')), 'count'] 
    ]
  });
  const interviewee_rating: any = await interview_rating_crud.findOne({
    where: { interview_id },
    attributes: [
      [fn('AVG', col('rating')), 'avg'],
      [fn('COUNT', col('rating')), 'count'] 
    ]
  });
  
  const comments_count = await interview_comment_crud.count({ where: { interview_id } });
  const analytics_count = await interview_analytic_crud.count({ where: { interview_id } });
  // const analytics = analytics_data.reduce((obj, analytic) => {
  //   if (!obj[analytic.event]) {
  //     obj[analytic.event] = 0;
  //   }

  //   obj[analytic.event] = obj[analytic.event] + 1;

  //   return obj;
  // }, {});

  const reactions_data = await interview_reaction_crud.findAll({ where: { interview_id } });
  const reactions: PlainObject<number> = reactions_data.reduce((obj, reaction) => {
    if (!obj[reaction.reaction_type]) {
      obj[reaction.reaction_type] = 0;
    }

    obj[reaction.reaction_type] = obj[reaction.reaction_type] + 1;

    return obj;
  }, {});
  
  const stats: IInterviewStats = {
    skills_count,
    interviewer_rating,
    interviewee_rating,
    comments_count,
    
    reactions,
    reactions_count: reactions_data.length,
    analytics_count,
  };

  return stats;
}
export async function get_interview_comment_stats(comment_id: number): Promise<any> {
  
  const replies_count = await interview_comment_reply_crud.count({ where: { comment_id } });

  const reactions_data = await interview_comment_reaction_crud.findAll({ where: { comment_id } });
  const reactions: PlainObject<number> = reactions_data.reduce((obj, reaction) => {
    if (!obj[reaction.reaction_type]) {
      obj[reaction.reaction_type] = 0;
    }

    obj[reaction.reaction_type] = obj[reaction.reaction_type] + 1;

    return obj;
  }, {});
  
  const stats: any = {
    replies_count,
    reactions,
    reactions_count: reactions_data.length,
  };

  return stats;
}
export async function get_interview_comment_reply_stats(reply_id: number): Promise<IInterviewStats> {
  const reactions_data = await interview_comment_reply_reaction_crud.findAll({ where: { reply_id } });
  const reactions: PlainObject<number> = reactions_data.reduce((obj, reaction) => {
    if (!obj[reaction.reaction_type]) {
      obj[reaction.reaction_type] = 0;
    }

    obj[reaction.reaction_type] = obj[reaction.reaction_type] + 1;

    return obj;
  }, {});
  
  const stats: any = {
    reactions,
    reactions_count: reactions_data.length,
  };

  return stats;
}



export async function get_interview_stat(interview_id: number, stat: INTERVIEW_STAT) {
  switch (stat) {
    case INTERVIEW_STAT.SEEN_COUNT: {
      return interview_analytic_crud.count({ where: { interview_id, event: ANALYTIC_EVENTS.SEEN } });
    }
    case INTERVIEW_STAT.DETAILS_EXPANDED_COUNT: {
      return interview_analytic_crud.count({ where: { interview_id, event: ANALYTIC_EVENTS.DETAILS_EXPANDED } });
    }

    default: {
      return -1;
    }
  }
}

export function check_user_interview_activity(params: { user_id: number, interview_id: number, event: ANALYTIC_EVENTS }) {
  return interview_analytic_crud.findOne({ where: params });
}



export function get_user_interview_reaction(user_id: number, interview_id: number) {
  return interview_reaction_crud.findOne({ where: { owner_id: user_id, interview_id }, include: [{ model: User, as: 'owner', attributes: user_attrs_slim }] });
}
export function get_user_interview_comment_reaction(user_id: number, comment_id: number) {
  return interview_comment_reaction_crud.findOne({ where: { owner_id: user_id, comment_id }, include: [{ model: User, as: 'owner', attributes: user_attrs_slim }] });
}
export function get_user_interview_comment_reply_reaction(user_id: number, reply_id: number) {
  return interview_comment_reply_reaction_crud.findOne({ where: { owner_id: user_id, reply_id }, include: [{ model: User, as: 'owner', attributes: user_attrs_slim }] });
}





/** CREATE */

export function create_interview(dto: InterviewCreateDto) {
  // const {
  //   owner_id,
  //   interviewee_id,
  //   interviewer_id,
  //   title,
  //   body,
  // } = dto;

  // const createObj = {
  //   owner_id,
  //   interviewee_id,
  //   interviewer_id,
  //   title,
  //   body,
  // };

  return interview_crud.create({ ...dto, title: dto.title?.trim(), description: dto.description?.trim() }).then((model) => get_interview_by_id(model.id));
}

export function create_user_interview_activity(params: { user_id: number, interview_id: number, event: ANALYTIC_EVENTS }) {
  return interview_analytic_crud.create(params);
}



export function create_interview_comment(dto: InterviewCommentCreateDto) {
  return interview_comment_crud.create(dto).then((model) => get_interview_comment_by_id(model.id));
}
export function create_interview_comment_reply(dto: InterviewCommentReplyCreateDto) {
  return interview_comment_reply_crud.create(dto).then((model) => get_interview_comment_reply_by_id(model.id));
}

export function create_interview_reaction(params: { owner_id: number, interview_id: number, reaction_type: string }) {
  return interview_reaction_crud.create(params);
}
export function create_interview_comment_reaction(params: { owner_id: number, comment_id: number, reaction_type: string }) {
  return interview_comment_reaction_crud.create(params);
}
export function create_interview_comment_reply_reaction(params: { owner_id: number, reply_id: number, reaction_type: string }) {
  return interview_comment_reply_reaction_crud.create(params);
}








/** UPDATE */

export function update_interview(id: number, dto: InterviewUpdateDto) {
  return interview_crud.updateById(id, dto);
}
export function update_interview_comment(id: number, dto: InterviewCommentUpdateDto) {
  return interview_comment_crud.updateById(id, dto);
}
export function update_interview_comment_reply(id: number, dto: InterviewCommentReplyUpdateDto) {
  return interview_comment_reply_crud.updateById(id, dto);
}



export function update_interview_reaction(reaction_id: number, reaction_type: string) {
  return interview_reaction_crud.updateById(reaction_id, { reaction_type });
}
export function update_interview_comment_reaction(reaction_id: number, reaction_type: string) {
  return interview_comment_reaction_crud.updateById(reaction_id, { reaction_type });
}
export function update_interview_comment_reply_reaction(reaction_id: number, reaction_type: string) {
  return interview_comment_reply_reaction_crud.updateById(reaction_id, { reaction_type });
}




/** DELETE */

export function delete_interview(id: number) {
  return interview_crud.deleteById(id);
}
export function delete_interview_comment(id: number) {
  return interview_comment_crud.deleteById(id);
}
export function delete_interview_comment_reply(id: number) {
  return interview_comment_reply_crud.deleteById(id);
}



export function delete_interview_reaction(id) {
  return interview_reaction_crud.deleteById(id);
}
export function delete_interview_comment_reaction(id) {
  return interview_comment_reaction_crud.deleteById(id);
}
export function delete_interview_comment_reply_reaction(id) {
  return interview_comment_reply_reaction_crud.deleteById(id);
}