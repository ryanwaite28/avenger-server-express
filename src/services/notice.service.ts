import {
  ServiceMethodResults
} from "../interfaces/common.interface";
import { HttpStatusCode } from "../enums/http-codes.enum";
import {
  create_notice,
  delete_notice,
  get_notice_by_id,
  get_notice_replies,
  get_notice_replies_all,
  get_notice_stat, 
  get_notice_stats, 
  update_notice,
  get_feed_content_for_user,
  get_user_activity_on_notice,
  get_user_notice_reaction,
  create_notice_reaction,
  update_notice_reaction,
  delete_notice_reaction,
  check_user_notice_activity,
  create_user_notice_activity,
  check_user_shared_notice,
  get_latest_trending_skills_on_notices
} from "../repos/notice.repo";
import { AVENGER_EVENT_TYPES, AVENGER_NOTIFICATION_TARGET_TYPES, ANALYTIC_EVENTS, NOTICE_STAT } from "../enums/avenger.enum";
import { NoticeCreateDto, NoticeUpdateDto } from "../dto/notice.dto";
import { REACTIONS } from "../enums/common.enum";
import { CommonSocketEventsHandler } from "./common.socket-event-handler";
import { INotice, IUser } from "../interfaces/avenger.models.interface";
import { MENTIONS_REGEX } from "../regex/common.regex";
import { get_user_by_username } from "../repos/users.repo";
import { create_notification_and_send } from "../repos/notifications.repo";



export class NoticeService {
  
  static async get_notice_by_id(id: number): Promise<ServiceMethodResults> {
    const data = await get_notice_by_id(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_notice_replies_all(parent_notice_id: number): Promise<ServiceMethodResults> {
    const data = await get_notice_replies_all(parent_notice_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_notice_replies(parent_notice_id: number, min_id?: number): Promise<ServiceMethodResults> {
    const data = await get_notice_replies(parent_notice_id, min_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_notice_stats(id: number): Promise<ServiceMethodResults> {
    const data = await get_notice_stats(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_notice_stat(id: number, stat: NOTICE_STAT): Promise<ServiceMethodResults> {
    const data = await get_notice_stat(id, stat);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_feed_content_for_user(user_id: number, notice_id?: string | number): Promise<ServiceMethodResults> {
    const data = await get_feed_content_for_user(user_id, notice_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_user_activity_on_notice(user_id: number, notice_id: number): Promise<ServiceMethodResults> {
    const data = await get_user_activity_on_notice(user_id, notice_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_latest_trending_skills_on_notices() {
    const data = await get_latest_trending_skills_on_notices();
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async create_notice(dto: NoticeCreateDto): Promise<ServiceMethodResults> {
    let notice: INotice | null = null;

    /* 
      analyze the context
      - if parent_notice_id is present on the dto; it is a reply
      - etc
    */

    if (dto.parent_notice_id) {
      notice = await create_notice(dto);
      CommonSocketEventsHandler.emitEventToRoom({
        room: `NOTICE:${dto.parent_notice_id}`,
        event: `NOTICE:${dto.parent_notice_id}:${AVENGER_EVENT_TYPES.NEW_NOTICE_REPLY}`,
        data: {
          notice,
        }
      });
    }

    else if (dto.quoting_notice_id) {
      notice = await create_notice(dto);
      CommonSocketEventsHandler.emitEventToRoom({
        room: `NOTICE:${dto.quoting_notice_id}`,
        event: `NOTICE:${dto.quoting_notice_id}:${AVENGER_EVENT_TYPES.NOTICE_QUOTED}`,
        data: {
          notice,
        }
      });
    }

    else if (dto.share_notice_id) {
      // check if user already shared notice
      const check = await check_user_shared_notice(dto.owner_id, dto.share_notice_id);
      if (check) {
        // unshare it
        await delete_notice(check.id);
        CommonSocketEventsHandler.emitEventToRoom({
          room: `NOTICE:${dto.share_notice_id}`,
          event: `NOTICE:${dto.share_notice_id}:${AVENGER_EVENT_TYPES.NOTICE_UNSHARED}`,
          data: {
            notice,
          }
        });
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            data: notice,
            message: `Notice unshared`,
          }
        };
        return serviceMethodResults;
      }
      
      // share does not exist; share it
      notice = await create_notice(dto);
      CommonSocketEventsHandler.emitEventToRoom({
        room: `NOTICE:${dto.share_notice_id}`,
        event: `NOTICE:${dto.share_notice_id}:${AVENGER_EVENT_TYPES.NOTICE_SHARED}`,
        data: {
          notice,
        }
      });
    }
    else {
      // regular notice
      notice = await create_notice(dto);
    }

    // check for mentions
    const mentions: string[] = dto.body?.match(MENTIONS_REGEX)?.map((str: string) => str.slice(1)) || [];
    if (mentions.length) {
      // notify each user of mention
      for (let index = 0; index < mentions.length; index++) {
        const username = mentions[index];
        get_user_by_username(username).then((user: IUser | null) => {
          if (!user) {
            return;
          }

          create_notification_and_send({
            from_id: notice.owner_id,
            to_id: user.id,
            event: AVENGER_EVENT_TYPES.NOTICE_MENTION,
            target_type: AVENGER_NOTIFICATION_TARGET_TYPES.NOTICE,
            target_id: notice.id,
            to_phone: user.phone,
            extras_data: { notice }
          });
        });
      }
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: notice,
      }
    };
    return serviceMethodResults;
  }

  static async update_notice(notice_id: number, dto: NoticeUpdateDto): Promise<ServiceMethodResults> {
    const data = await update_notice(notice_id, dto);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `NOTICE:${notice_id}`,
      event: `NOTICE:${notice_id}:${AVENGER_EVENT_TYPES.NOTICE_UPDATED}`,
      data: {
        notice: data.model,
        results: data.rows,
      },
    });
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          notice: data.model,
          results: data.rows,
        },
      }
    };
    return serviceMethodResults;
  }

  static async delete_notice(notice_id: number): Promise<ServiceMethodResults> {
    const data = await delete_notice(notice_id);

    if (data.model) {
      CommonSocketEventsHandler.emitEventToRoom({
        room: `NOTICE:${notice_id}`,
        event: `NOTICE:${notice_id}:${AVENGER_EVENT_TYPES.NOTICE_DELETED}`,
        data: {
          notice: data.model,
          results: data.results,
        },
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          notice: data.model,
          results: data.results,
        },
      }
    };
    return serviceMethodResults;
  }

  static async toggle_reaction(params: { user_id: number, notice_id: number, reaction_type: string }): Promise<ServiceMethodResults> {
    const { user_id, notice_id, reaction_type } = params;

    if (!(reaction_type in REACTIONS)) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Reaction not valid: ${reaction_type}`,
        }
      };
      return serviceMethodResults;
    }

    let reaction = await get_user_notice_reaction(user_id, notice_id);
    if (!reaction) {
      // no existing reaction; create
      reaction = await create_notice_reaction(params);
    }
    else {
      if (reaction.reaction_type === reaction_type) {
        // same reaction type sent; un-toggle/delete
        const deletes = await delete_notice_reaction(reaction.id);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `un-toggled reaction`,
            data: null
          }
        };
        CommonSocketEventsHandler.emitEventToRoom({
          room: `NOTICE:${notice_id}`,
          event: `NOTICE:${notice_id}:${AVENGER_EVENT_TYPES.REACTION_RESCINDED}`,
          data: {
            notice_id,
          }
        });
        return serviceMethodResults;
      }

      // update reaction with new type
      const results = await update_notice_reaction(reaction.user_id, reaction_type);
      reaction = await get_user_notice_reaction(user_id, notice_id);
    }

    CommonSocketEventsHandler.emitEventToRoom({
      room: `NOTICE:${notice_id}`,
      event: `NOTICE:${notice_id}:${AVENGER_EVENT_TYPES.NEW_REACTION}`,
      data: {
        notice_id,
      }
    });
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: reaction,
        message: `toggled reaction`
      }
    };
    return serviceMethodResults;
  }

  static async log_user_notice_activity(params: { user_id: number, notice_id: number, event: ANALYTIC_EVENTS }, multi: boolean = false) {
    /* 
      `multi` parameter is for indicating if multiple occurences of the event can/should be tracked
    */

    // if not multi, check if activity was already captured. if so, return
    if (!multi) {
      const check = await check_user_notice_activity(params);
      if (check) {
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `User activity already collected`
          }
        };
        return serviceMethodResults;
      }
    }

    const analytic = await create_user_notice_activity(params);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `NOTICE:${params.notice_id}`,
      event: `NOTICE:${params.notice_id}:${AVENGER_EVENT_TYPES.NEW_ANALYTIC}`,
      data: params
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `User analytic collected`,
        data: analytic
      }
    };
    return serviceMethodResults;
  }

}