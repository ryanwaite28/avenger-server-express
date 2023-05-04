import { ServiceMethodResults } from "../interfaces/common.interface";
import { HttpStatusCode } from "../enums/http-codes.enum";
import {
  check_interviewer_rating_by_writer_id_and_interview_id,
  check_interviewee_rating_by_writer_id_and_interview_id,
  check_user_interview_activity,
  create_interview,
  create_interview_comment,
  create_interview_comment_reply,
  create_interview_reaction,
  create_user_interview_activity,
  delete_interview,
  delete_interview_reaction,
  get_feed_content_for_user,
  get_interviewer_rating_by_id,
  get_interviewee_rating_by_id,
  get_interview_by_id,
  get_interview_comment_by_id,
  get_interview_comment_reply_by_id,
  get_interview_comments,
  get_interview_comments_all,
  get_interview_comment_replies,
  get_interview_comment_replies_all,
  get_interview_stat,
  get_interview_stats,
  get_latest_trending_skills_on_interviews,
  get_user_activity_on_interview,
  get_user_interview_reaction,
  update_interview,
  update_interview_reaction,
  get_user_activity_on_interview_comment,
  get_user_activity_on_interview_comment_reply,
  get_interview_comment_stats,
  get_interview_comment_reply_stats,
  get_user_interview_comment_reaction,
  create_interview_comment_reaction,
  update_interview_comment_reaction,
  get_user_interview_comment_reply_reaction,
  create_interview_comment_reply_reaction,
  create_interviewer_rating,
  create_interviewee_rating,
  delete_interview_comment,
  delete_interview_comment_reply,
  update_interview_comment_reply,
  update_interview_comment,
  get_interviewer_ratings_all,
  get_interviewee_ratings_all,
  get_interviewer_ratings,
  get_interviewee_ratings,
  get_interview_ratings_stat,
  update_interview_comment_reply_reaction,
  delete_interview_comment_reaction,
  delete_interview_comment_reply_reaction,
} from "../repos/interview.repo";
import {
  ANALYTIC_EVENTS,
  AVENGER_EVENT_TYPES,
  AVENGER_NOTIFICATION_TARGET_TYPES,
  INTERVIEW_STAT,
  MODELS,
} from "../enums/avenger.enum";
import {
  InterviewCommentCreateDto,
  InterviewCommentReplyCreateDto,
  InterviewCommentReplyUpdateDto,
  InterviewCommentUpdateDto,
  InterviewCreateDto,
  InterviewUpdateDto,
  InterviewerRatingCreateDto,
  IntervieweeRatingCreateDto
} from "../dto/interview.dto";
import {
  IInterview,
  IComment,
  IUser,
  IRating,
} from "../interfaces/avenger.models.interface";
import { MENTIONS_REGEX } from "../regex/common.regex";
import { create_notification_and_send } from "../repos/notifications.repo";
import { get_user_by_username } from "../repos/users.repo";
import { CommonSocketEventsHandler } from "./common.socket-event-handler";
import { REACTIONS } from "../enums/common.enum";





export class InterviewService {

  static async get_interview_by_id(id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_by_id(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_interview_comment_by_id(id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comment_by_id(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_interview_comment_reply_by_id(id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comment_reply_by_id(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }


  static async get_interviewer_rating_by_id(id: number): Promise<ServiceMethodResults> {
    const data = await get_interviewer_rating_by_id(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_interviewee_rating_by_id(id: number): Promise<ServiceMethodResults> {
    const data = await get_interviewee_rating_by_id(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }


  static async get_interviewer_ratings_all(interview_id: number): Promise<ServiceMethodResults> {
    const data = await get_interviewer_ratings_all(interview_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_interviewer_ratings(interview_id: number, min_id?: number): Promise<ServiceMethodResults> {
    const data = await get_interviewer_ratings(interview_id, min_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interviewee_ratings_all(interview_id: number): Promise<ServiceMethodResults> {
    const data = await get_interviewee_ratings_all(interview_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interviewee_ratings(interview_id: number, min_id?: number): Promise<ServiceMethodResults> {
    const data = await get_interviewee_ratings(interview_id, min_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async check_interviewer_rating_by_writer_id_and_interview_id(interview_id: number, user_id: number): Promise<ServiceMethodResults> {
    const data = await check_interviewer_rating_by_writer_id_and_interview_id(user_id, interview_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async check_interviewee_rating_by_writer_id_and_interview_id(interview_id: number, user_id: number): Promise<ServiceMethodResults> {
    const data = await check_interviewee_rating_by_writer_id_and_interview_id(user_id, interview_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interview_comments_all(interview_id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comments_all(interview_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interview_comments(interview_id: number, min_id?: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comments(interview_id, min_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interview_comment_replies_all(comment_id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comment_replies_all(comment_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interview_comment_replies(comment_id: number, min_id?: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comment_replies(comment_id, min_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interview_stats(id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_stats(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_interview_comment_stats(id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comment_stats(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_interview_comment_reply_stats(id: number): Promise<ServiceMethodResults> {
    const data = await get_interview_comment_reply_stats(id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_interview_stat(id: number, stat: INTERVIEW_STAT): Promise<ServiceMethodResults> {
    const data = await get_interview_stat(id, stat);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_feed_content_for_user(user_id: number, timestamp: string | Date): Promise<ServiceMethodResults> {
    const data = await get_feed_content_for_user(user_id, timestamp);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_user_activity_on_interview(user_id: number, interview_id: number): Promise<ServiceMethodResults> {
    const data = await get_user_activity_on_interview(user_id, interview_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_user_activity_on_interview_comment(user_id: number, comment_id: number): Promise<ServiceMethodResults> {
    const data = await get_user_activity_on_interview_comment(user_id, comment_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  static async get_user_activity_on_interview_comment_reply(user_id: number, reply_id: number): Promise<ServiceMethodResults> {
    const data = await get_user_activity_on_interview_comment_reply(user_id, reply_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async get_latest_trending_skills_on_interviews() {
    const data = await get_latest_trending_skills_on_interviews();
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async create_interview(dto: InterviewCreateDto): Promise<ServiceMethodResults> {

   const interview = await create_interview(dto);

    // check for mentions
    const mentions: string[] = dto.description?.match(MENTIONS_REGEX)?.map((str: string) => str.slice(1)) || [];
    if (mentions.length) {
      // notify each user of mention
      for (let index = 0; index < mentions.length; index++) {
        const username = mentions[index];
        get_user_by_username(username).then((user: IUser | null) => {
          if (!user) {
            return;
          }

          create_notification_and_send({
            from_id: interview.owner_id,
            to_id: user.id,
            event: `INTERVIEW:${interview.id}:${AVENGER_EVENT_TYPES.MENTION}`,
            target_type: MODELS.INTERVIEW,
            target_id: interview.id,
            to_phone: user.phone,
            extras_data: { interview }
          });
        });
      }
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: interview,
      }
    };
    return serviceMethodResults;
  }
  static async create_interviewer_rating(dto: InterviewerRatingCreateDto): Promise<ServiceMethodResults> {
    const rating: IRating = await create_interviewer_rating(dto);
    const rating_stats = await get_interview_ratings_stat(dto.interview_id, INTERVIEW_STAT.INTERVIEWER_RATING);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW:${dto.interview_id}`,
      event: `INTERVIEW:${dto.interview_id}:${AVENGER_EVENT_TYPES.INTERVIEWER_RATING}`,
      data: {
        rating,
        rating_stats
      },
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          rating,
          rating_stats
        },
      }
    };
    return serviceMethodResults;
  }
  static async create_interviewee_rating(dto: IntervieweeRatingCreateDto): Promise<ServiceMethodResults> {
    const rating: IRating = await create_interviewee_rating(dto);
    const rating_stats = await get_interview_ratings_stat(dto.interview_id, INTERVIEW_STAT.INTERVIEWEE_RATING);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW:${dto.interview_id}`,
      event: `INTERVIEW:${dto.interview_id}:${AVENGER_EVENT_TYPES.INTERVIEWEE_RATING}`,
      data: {
        rating,
        rating_stats
      },
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          rating,
          rating_stats
        }
      }
    };
    return serviceMethodResults;
  }
  static async create_interview_comment(dto: InterviewCommentCreateDto): Promise<ServiceMethodResults> {
    const comment: any = await create_interview_comment(dto);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW:${dto.interview_id}`,
      event: `INTERVIEW:${dto.interview_id}:${AVENGER_EVENT_TYPES.NEW_COMMENT}`,
      data: {
        comment
      },
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: comment,
      }
    };
    return serviceMethodResults;
  }
  static async create_interview_comment_reply(dto: InterviewCommentReplyCreateDto): Promise<ServiceMethodResults> {
    const reply = await create_interview_comment_reply(dto);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW_COMMENT:${dto.comment_id}`,
      event: `INTERVIEW_COMMENT:${dto.comment_id}:${AVENGER_EVENT_TYPES.NEW_COMMENT_REPLY}`,
      data: {
        reply
      },
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          reply
        },
      }
    };
    return serviceMethodResults;
  }

  static async update_interview(interview_id: number, dto: InterviewUpdateDto): Promise<ServiceMethodResults> {
    const data = await update_interview(interview_id, dto);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW:${interview_id}`,
      event: `INTERVIEW:${interview_id}:${AVENGER_EVENT_TYPES.UPDATED}`,
      data: {
        interview: data.model,
        results: data.rows,
      },
    });
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          interview: data.model,
          results: data.rows,
        },
      }
    };
    return serviceMethodResults;
  }
  static async update_interview_comment(interview_id: number, dto: InterviewCommentUpdateDto): Promise<ServiceMethodResults> {
    const data = await update_interview_comment(interview_id, dto);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW_COMMENT:${interview_id}`,
      event: `INTERVIEW_COMMENT:${interview_id}:${AVENGER_EVENT_TYPES.UPDATED}`,
      data: {
        comment: data.model,
        results: data.rows,
      },
    });
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          comment: data.model,
          results: data.rows,
        },
      }
    };
    return serviceMethodResults;
  }
  static async update_interview_comment_reply(reply_id: number, dto: InterviewCommentReplyUpdateDto): Promise<ServiceMethodResults> {
    const data = await update_interview_comment_reply(reply_id, dto);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW_COMMENT_REPLY:${reply_id}`,
      event: `INTERVIEW_COMMENT_REPLY:${reply_id}:${AVENGER_EVENT_TYPES.UPDATED}`,
      data: {
        reply: data.model,
        results: data.rows,
      },
    });
    
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          reply: data.model,
          results: data.rows,
        },
      }
    };
    return serviceMethodResults;
  }



  static async delete_interview(interview_id: number): Promise<ServiceMethodResults> {
    const data = await delete_interview(interview_id);

    if (data.model) {
      CommonSocketEventsHandler.emitEventToRoom({
        room: `INTERVIEW:${interview_id}`,
        event: `INTERVIEW:${interview_id}:${AVENGER_EVENT_TYPES.DELETED}`,
        data: {
          interview: data.model,
          results: data.results,
        },
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          interview: data.model,
          results: data.results,
        },
      }
    };
    return serviceMethodResults;
  }
  static async delete_interview_comment(comment_id: number): Promise<ServiceMethodResults> {
    const data = await delete_interview_comment(comment_id);

    if (data.model) {
      CommonSocketEventsHandler.emitEventToRoom({
        room: `INTERVIEW_COMMENT:${comment_id}`,
        event: `INTERVIEW_COMMENT:${comment_id}:${AVENGER_EVENT_TYPES.DELETED}`,
        data: {
          comment: data.model,
          results: data.results,
        },
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          comment: data.model,
          results: data.results,
        },
      }
    };
    return serviceMethodResults;
  }
  static async delete_interview_comment_reply(interview_id: number): Promise<ServiceMethodResults> {
    const data = await delete_interview_comment_reply(interview_id);

    if (data.model) {
      CommonSocketEventsHandler.emitEventToRoom({
        room: `INTERVIEW_COMMENT_REPLY:${interview_id}`,
        event: `INTERVIEW_COMMENT_REPLY:${interview_id}:${AVENGER_EVENT_TYPES.DELETED}`,
        data: {
          reply: data.model,
          results: data.results,
        },
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: {
          reply: data.model,
          results: data.results,
        },
      }
    };
    return serviceMethodResults;
  }


  static async toggle_interview_reaction(params: { owner_id: number, interview_id: number, reaction_type: string }): Promise<ServiceMethodResults> {
    const { owner_id, interview_id, reaction_type } = params;

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

    let reaction = await get_user_interview_reaction(owner_id, interview_id);
    if (!reaction) {
      // no existing reaction; create
      reaction = await create_interview_reaction(params);
    }
    else {
      if (reaction.reaction_type === reaction_type) {
        // same reaction type sent; un-toggle/delete
        const deletes = await delete_interview_reaction(reaction.id);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `un-toggled reaction`,
            data: null
          }
        };
        CommonSocketEventsHandler.emitEventToRoom({
          room: `INTERVIEW:${interview_id}`,
          event: `INTERVIEW:${interview_id}:${AVENGER_EVENT_TYPES.REACTION_RESCINDED}`,
          data: {
            interview_id,
          }
        });
        return serviceMethodResults;
      }
      else {
        // update reaction with new type
        const results = await update_interview_reaction(reaction.user_id, reaction_type);
        reaction = results.model;
      }
    }

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW:${interview_id}`,
      event: `INTERVIEW:${interview_id}:${AVENGER_EVENT_TYPES.NEW_REACTION}`,
      data: {
        interview_id,
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

  static async toggle_interview_comment_reaction(params: { owner_id: number, comment_id: number, reaction_type: string }): Promise<ServiceMethodResults> {
    const { owner_id, comment_id, reaction_type } = params;

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

    let reaction = await get_user_interview_comment_reaction(owner_id, comment_id);
    if (!reaction) {
      // no existing reaction; create
      reaction = await create_interview_comment_reaction(params);
    }
    else {
      if (reaction.reaction_type === reaction_type) {
        // same reaction type sent; un-toggle/delete
        const deletes = await delete_interview_comment_reaction(reaction.id);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `un-toggled reaction`,
            data: null
          }
        };
        CommonSocketEventsHandler.emitEventToRoom({
          room: `INTERVIEW_COMMENT:${comment_id}`,
          event: `INTERVIEW_COMMENT:${comment_id}:${AVENGER_EVENT_TYPES.REACTION_RESCINDED}`,
          data: {
            comment_id,
          }
        });
        return serviceMethodResults;
      }
      else {
        // update reaction with new type
        const results = await update_interview_comment_reaction(reaction.user_id, reaction_type);
        reaction = results.model;
      }
    }

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW_COMMENT:${comment_id}`,
      event: `INTERVIEW_COMMENT:${comment_id}:${AVENGER_EVENT_TYPES.NEW_REACTION}`,
      data: {
        comment_id,
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

  static async toggle_interview_comment_reply_reaction(params: { owner_id: number, reply_id: number, reaction_type: string }): Promise<ServiceMethodResults> {
    const { owner_id, reply_id, reaction_type } = params;

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

    let reaction = await get_user_interview_comment_reply_reaction(owner_id, reply_id);
    if (!reaction) {
      // no existing reaction; create
      reaction = await create_interview_comment_reply_reaction(params);
    }
    else {
      if (reaction.reaction_type === reaction_type) {
        // same reaction type sent; un-toggle/delete
        const deletes = await delete_interview_comment_reply_reaction(reaction.id);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.OK,
          error: false,
          info: {
            message: `un-toggled reaction`,
            data: null
          }
        };
        CommonSocketEventsHandler.emitEventToRoom({
          room: `INTERVIEW_COMMENT_REPLY:${reply_id}`,
          event: `INTERVIEW_COMMENT_REPLY:${reply_id}:${AVENGER_EVENT_TYPES.REACTION_RESCINDED}`,
          data: {
            reply_id,
          }
        });
        return serviceMethodResults;
      }
      else {
        // update reaction with new type
        const results = await update_interview_comment_reply_reaction(reaction.user_id, reaction_type);
        reaction = results.model;
      }
    }

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW_COMMENT_REPLY:${reply_id}`,
      event: `INTERVIEW_COMMENT_REPLY:${reply_id}:${AVENGER_EVENT_TYPES.NEW_REACTION}`,
      data: {
        reply_id,
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
  
  static async log_user_interview_activity(params: { user_id: number, interview_id: number, event: ANALYTIC_EVENTS }, multi: boolean = false) {
    /* 
      `multi` parameter is for indicating if multiple occurences of the event can/should be tracked
    */

    // if not multi, check if activity was already captured. if so, return
    if (!multi) {
      const check = await check_user_interview_activity(params);
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

    const analytic = await create_user_interview_activity(params);

    CommonSocketEventsHandler.emitEventToRoom({
      room: `INTERVIEW:${params.interview_id}`,
      event: `INTERVIEW:${params.interview_id}:${AVENGER_EVENT_TYPES.NEW_ANALYTIC}`,
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