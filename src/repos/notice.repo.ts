import {
  col,
  fn,
  Includeable,
  Model,
  Op,
  WhereOptions
} from 'sequelize';
import {
  sequelizeInst as sequelize,
} from '../models/_def.model';
import { user_attrs_slim } from '../utils/constants.utils';
import {
  create_model_crud_repo_from_model_class,
} from '../utils/helpers.utils';

import { NoticeCreateDto, NoticeUpdateDto } from '../dto/notice.dto';
import { ANALYTIC_EVENTS, MODELS, NOTICE_STAT } from '../enums/avenger.enum';
import { get_user_followings_ids } from './users.repo';
import { IAnalytic, INotice, INoticeStats, INoticeUserAnalyticInfo, IReaction } from '../interfaces/avenger.models.interface';
import { NoticeCoreModels, Notice, User, Skill, NoticeSkills } from '../models/avenger.model';



const notice_crud = create_model_crud_repo_from_model_class<INotice>(Notice);
const analytic_crud = create_model_crud_repo_from_model_class<IAnalytic>(NoticeCoreModels[MODELS.ANALYTIC]);
const reaction_crud = create_model_crud_repo_from_model_class<IReaction>(NoticeCoreModels[MODELS.REACTION]);



const notice_general_includes: Includeable[] = [
  { model: User, as: `owner`, attributes: user_attrs_slim },

  { model: NoticeCoreModels[MODELS.PHOTO], as: `photos`, attributes: null },
  { model: NoticeCoreModels[MODELS.VIDEO], as: `videos`, attributes: null },
  { model: NoticeCoreModels[MODELS.AUDIO], as: `audios`, attributes: null },
  
  { model: Notice, as: `pinned_reply`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
  
  { model: Notice, as: `parent_notice`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
  { model: Notice, as: `quote_notice`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
  { model: Notice, as: `share_notice`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },

  { model: Notice, as: `notice_replies`, attributes: null, limit: 0, separate: true },
];





/** READ */

export function get_notice_by_id_slim(id: number) {
  return notice_crud.findOne({
    where: { id }
  });
}

export function get_notice_by_id(id: number) {
  return notice_crud.findOne({
    where: { id },
    include: notice_general_includes
  });
}

export function get_notice_replies_all(parent_notice_id: number) {
  return notice_crud.findAll({
    where: { parent_notice_id },
    include: notice_general_includes
  });
}

export function get_notice_replies(parent_notice_id: number, min_id?: number) {
  return notice_crud.paginate({
    user_id_field: 'parent_notice_id',
    user_id: parent_notice_id,
    min_id,
    include: notice_general_includes
  });
}

export function get_latest_trending_skills_on_notices() {
  return NoticeSkills.findAll({
    include: [
      { model: Notice, as: 'notice' },
      { model: Skill, as: 'skill' },
    ],
    attributes: [
      [fn('COUNT', col('NoticeSkills.notice_id')), 'skills_count']
    ],
    group: ["notice.id", "skill.id"],
    order: [
      ['skills_count', 'DESC']
    ],
    limit: 5,
  });
}



export async function get_notice_stats(notice_id: number): Promise<INoticeStats> {
  const replies_count = await Notice.count({ where: { parent_notice_id: notice_id } });
  const quotes_count = await Notice.count({ where: { quoting_notice_id: notice_id } });
  const shares_count = await Notice.count({ where: { share_notice_id: notice_id } });

  const analytics_count = await analytic_crud.count({ where: { notice_id } });
  const seen_count = await analytic_crud.count({ where: { notice_id, event: ANALYTIC_EVENTS.SEEN } });
  const details_expanded_count = await analytic_crud.count({ where: { notice_id, event: ANALYTIC_EVENTS.DETAILS_EXPANDED } });

  const reactions_data = await reaction_crud.findAll({ where: { notice_id } });
  const reactions = reactions_data.reduce((obj, reaction) => {
    if (!obj[reaction.reaction_type]) {
      obj[reaction.reaction_type] = 0;
    }

    obj[reaction.reaction_type] = obj[reaction.reaction_type] + 1;

    return obj;
  }, {});
  
  const stats = {
    replies_count,
    quotes_count,
    shares_count,

    reactions,
    reactions_count: reactions_data.length,

    analytics_count,
    seen_count,
    details_expanded_count,
  };

  return stats;
}

export async function get_notice_stat(notice_id: number, stat: NOTICE_STAT) {
  switch (stat) {
    case NOTICE_STAT.REPLIES_COUNT: {
      return Notice.count({ where: { parent_notice_id: notice_id } });
    }
    case NOTICE_STAT.QUOTES_COUNT: {
      return Notice.count({ where: { quoting_notice_id: notice_id } });
    }
    case NOTICE_STAT.SHARES_COUNT: {
      return Notice.count({ where: { share_notice_id: notice_id } });
    }
    case NOTICE_STAT.SEEN_COUNT: {
      return analytic_crud.count({ where: { notice_id, event: ANALYTIC_EVENTS.SEEN } });
    }
    case NOTICE_STAT.DETAILS_EXPANDED_COUNT: {
      return analytic_crud.count({ where: { notice_id, event: ANALYTIC_EVENTS.DETAILS_EXPANDED } });
    }

    default: {
      return -1;
    }
  }
}


export async function get_feed_content_for_user(user_id: number, notice_id?: string | number) {
  const user_followings_ids = await get_user_followings_ids(user_id);
  const ids = [user_id, ...user_followings_ids];
  console.log({ ids });

  const useWhere = notice_id
    ? { owner_id: ids, id: { [Op.lt]: parseInt(notice_id.toString(), 10) } }
    : { owner_id: ids }

  return notice_crud.findAll({
    where: useWhere,
    include: notice_general_includes,
    limit: 5,
    order: [['id', 'DESC']]
  });
}

export async function get_user_activity_on_notice(user_id: number, notice_id: number): Promise<INoticeUserAnalyticInfo> {
  const seen = await analytic_crud.findOne({ where: { user_id, notice_id, event: ANALYTIC_EVENTS.SEEN } });
  const details_expanded = await analytic_crud.findOne({ where: { user_id, notice_id, event: ANALYTIC_EVENTS.DETAILS_EXPANDED } });
  
  const replied = await notice_crud.findOne({ where: { parent_notice_id: notice_id, owner_id: user_id } });
  const quoted = await notice_crud.findOne({ where: { quoting_notice_id: notice_id, owner_id: user_id } });
  const shared = await notice_crud.findOne({ where: { share_notice_id: notice_id, owner_id: user_id } });
  
  const reacted = await reaction_crud.findOne({ where: { notice_id, user_id } });

  return {
    seen,
    details_expanded,
    replied,
    quoted,
    shared,
    reacted
  };
}

export function get_user_notice_reaction(user_id: number, notice_id: number) {
  return reaction_crud.findOne({ where: { user_id, notice_id }, include: [{ model: User, as: 'user', attributes: user_attrs_slim }] });
}

export function check_user_notice_activity(params: { user_id: number, notice_id: number, event: ANALYTIC_EVENTS }) {
  return analytic_crud.findOne({
    where: {
      user_id: params.user_id,
      event: params.event,
       
      notice_id: params.notice_id
    }
  });
}

export function check_user_shared_notice(user_id: number, notice_id: number) {
  return notice_crud.findOne({ where: { owner_id: user_id, share_notice_id: notice_id } });
}


/** CREATE */

export function create_notice(dto: NoticeCreateDto) {
  return notice_crud.create({ ...dto, body: dto.body?.trim() }).then(model => get_notice_by_id(model.id));
}

export function create_notice_reaction(params: { user_id: number, notice_id: number, reaction_type: string }) {
  return reaction_crud.create({
    user_id: params.user_id,
    reaction_type: params.reaction_type,
     
    notice_id: params.notice_id
  });
}

export function create_user_notice_activity(params: { user_id: number, notice_id: number, event: ANALYTIC_EVENTS }) {
  return analytic_crud.create({
    user_id: params.user_id,
      event: params.event,
       
      notice_id: params.notice_id
  });
}


/** UPDATE */

export function update_notice(id: number, dto: NoticeUpdateDto) {
  return notice_crud.updateById(id, dto);
}

export function update_notice_reaction(reaction_id: number, reaction_type: string) {
  return reaction_crud.updateById(reaction_id, { reaction_type });
}



/** DELETE */

export function delete_notice(id: number) {
  return notice_crud.deleteById(id);
}

export function delete_notice_reaction(id: number) {
  return reaction_crud.deleteById(id);
}
