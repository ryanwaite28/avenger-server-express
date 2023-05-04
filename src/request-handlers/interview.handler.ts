import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { IUser } from '../interfaces/avenger.models.interface';
import { ExpressResponse, ServiceMethodResults, PlainObject } from '../interfaces/common.interface';
import { CatchRequestHandlerError } from '../decorators/service-method-error-handler.decorator';
import { InterviewService } from '../services/interview.service';
import { ANALYTIC_EVENTS, INTERVIEW_STAT } from '../enums/avenger.enum';
import {
  InterviewCommentCreateDto,
  InterviewCommentReplyCreateDto,
  InterviewCommentReplyUpdateDto,
  InterviewCommentUpdateDto,
  InterviewCreateDto,
  IntervieweeRatingCreateDto,
  InterviewerRatingCreateDto,
  InterviewUpdateDto
} from '../dto/interview.dto';






export class InterviewRequestHandler {

  @CatchRequestHandlerError()
  static async get_interview_by_id(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_by_id(interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_interviewer_rating_by_id(request: Request, response: Response): ExpressResponse {
    const rating_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interviewer_rating_by_id(rating_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interviewee_rating_by_id(request: Request, response: Response): ExpressResponse {
    const rating_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_by_id(rating_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_interview_comment_by_id(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comment_by_id(comment_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interview_comment_reply_by_id(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comment_reply_by_id(reply_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async get_user_activity_on_interview(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_user_activity_on_interview(you.id, interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_user_activity_on_interview_comment(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_user_activity_on_interview_comment(you.id, comment_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_user_activity_on_interview_comment_reply(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_user_activity_on_interview_comment_reply(you.id, reply_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async get_feed_content_for_user(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const timestamp: string | Date = request.params.timestamp;
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_feed_content_for_user(you.id, timestamp);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_latest_trending_skills_on_interviews(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_latest_trending_skills_on_interviews();
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }


  @CatchRequestHandlerError()
  static async get_interviewer_ratings_all(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interviewer_ratings_all(interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interviewer_ratings(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const rating_id: number = parseInt(request.params.rating_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interviewer_ratings(interview_id, rating_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_interviewee_ratings_all(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interviewee_ratings_all(interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interviewee_ratings(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const rating_id: number = parseInt(request.params.rating_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interviewee_ratings(interview_id, rating_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async check_interviewer_rating_by_writer_id_and_interview_id(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.check_interviewer_rating_by_writer_id_and_interview_id(interview_id, user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async check_interviewee_rating_by_writer_id_and_interview_id(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.check_interviewee_rating_by_writer_id_and_interview_id(interview_id, user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async get_interview_comments_all(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comments_all(interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interview_comments(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comments(interview_id, comment_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_interview_comment_replies_all(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comment_replies_all(comment_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interview_comment_replies(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comment_replies(comment_id, reply_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  /** Stats */

  @CatchRequestHandlerError()
  static async get_interview_stats(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_stats(interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interview_comment_stats(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comment_stats(comment_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async get_interview_comment_reply_stats(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_comment_reply_stats(reply_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  // @CatchRequestHandlerError()
  // static async get_interview_seen_count(request: Request, response: Response): ExpressResponse {
  //   const interview_id: number = parseInt(request.params.interview_id, 10);
  //   const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_stat(interview_id, INTERVIEW_STAT.SEEN_COUNT);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  // @CatchRequestHandlerError()
  // static async get_interview_details_expanded_count(request: Request, response: Response): ExpressResponse {
  //   const interview_id: number = parseInt(request.params.interview_id, 10);
  //   const serviceMethodResults: ServiceMethodResults = await InterviewService.get_interview_stat(interview_id, INTERVIEW_STAT.DETAILS_EXPANDED_COUNT);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  /** End Stats */


  @CatchRequestHandlerError()
  static async toggle_interview_reaction(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const reaction_type: string = request.params.reaction_type;
    const serviceMethodResults: ServiceMethodResults = await InterviewService.toggle_interview_reaction({ owner_id: you.id, interview_id, reaction_type });
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  static async toggle_interview_comment_reaction(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const reaction_type: string = request.params.reaction_type;
    const serviceMethodResults: ServiceMethodResults = await InterviewService.toggle_interview_comment_reaction({ owner_id: you.id, comment_id, reaction_type });
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  static async toggle_interview_comment_reply_reaction(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const reaction_type: string = request.params.reaction_type;
    const serviceMethodResults: ServiceMethodResults = await InterviewService.toggle_interview_comment_reply_reaction({ owner_id: you.id, reply_id, reaction_type });
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }




  @CatchRequestHandlerError()
  static async create_interview(request: Request, response: Response): ExpressResponse {
    const dto: InterviewCreateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.create_interview(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async create_interviewer_rating(request: Request, response: Response): ExpressResponse {
    const dto: InterviewerRatingCreateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.create_interviewer_rating(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async create_interviewee_rating(request: Request, response: Response): ExpressResponse {
    const dto: IntervieweeRatingCreateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.create_interviewee_rating(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async create_interview_comment(request: Request, response: Response): ExpressResponse {
    const dto: InterviewCommentCreateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.create_interview_comment(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async create_interview_comment_reply(request: Request, response: Response): ExpressResponse {
    const dto: InterviewCommentReplyCreateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.create_interview_comment_reply(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async update_interview(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const dto: InterviewUpdateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.update_interview(interview_id, dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async update_interview_comment(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const dto: InterviewCommentUpdateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.update_interview_comment(comment_id, dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async update_interview_comment_reply(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const dto: InterviewCommentReplyUpdateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await InterviewService.update_interview_comment_reply(reply_id, dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async delete_interview(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.delete_interview(interview_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async delete_interview_comment(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.delete_interview_comment(comment_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  @CatchRequestHandlerError()
  static async delete_interview_comment_reply(request: Request, response: Response): ExpressResponse {
    const interview_id: number = parseInt(request.params.interview_id, 10);
    const comment_id: number = parseInt(request.params.comment_id, 10);
    const reply_id: number = parseInt(request.params.reply_id, 10);
    const serviceMethodResults: ServiceMethodResults = await InterviewService.delete_interview_comment_reply(reply_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }




  /** Analytics */

  static log_user_interview_activity(event: ANALYTIC_EVENTS, multi: boolean = false) {
    return async function fn(request: Request, response: Response): ExpressResponse {
      const you: IUser = response.locals.you;
      const interview_id: number = parseInt(request.params.interview_id, 10);
      const serviceMethodResults: ServiceMethodResults = await InterviewService.log_user_interview_activity({ user_id: you.id, interview_id, event }, multi);
      return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
    }
  }

}