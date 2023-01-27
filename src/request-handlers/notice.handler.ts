import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { IUser } from '../interfaces/avenger.models.interface';
import { ExpressResponse, ServiceMethodResults } from '../interfaces/common.interface';
import { CatchRequestHandlerError } from '../decorators/service-method-error-handler.decorator';
import { NoticeService } from '../services/notice.service';
import { NoticeCreateDto, NoticeUpdateDto } from '../dto/notice.dto';
import { ANALYTIC_EVENTS, NOTICE_STAT } from '../enums/avenger.enum';



export class NoticeRequestHandler {

  @CatchRequestHandlerError()
  static async get_notice_by_id(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_by_id(notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_notice_replies_all(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_replies_all(notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_notice_replies(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const child_notice_id: number = parseInt(request.params.child_notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_replies(notice_id, child_notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_feed_content_for_user(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_feed_content_for_user(you.id, notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_user_activity_on_notice(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_user_activity_on_notice(you.id, notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_latest_trending_skills_on_notices(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_latest_trending_skills_on_notices();
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async create_notice(request: Request, response: Response): ExpressResponse {
    const dto: NoticeCreateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await NoticeService.create_notice(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async update_notice(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const dto: NoticeUpdateDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await NoticeService.update_notice(notice_id, dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async delete_notice(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.delete_notice(notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  /** Stats */

  @CatchRequestHandlerError()
  static async get_notice_stats(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_stats(notice_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async get_notice_replies_count(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_stat(notice_id, NOTICE_STAT.REPLIES_COUNT);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_notice_quotes_count(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_stat(notice_id, NOTICE_STAT.QUOTES_COUNT);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_notice_shares_count(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_stat(notice_id, NOTICE_STAT.SHARES_COUNT);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_notice_seen_count(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_stat(notice_id, NOTICE_STAT.SEEN_COUNT);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_notice_details_expanded_count(request: Request, response: Response): ExpressResponse {
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const serviceMethodResults: ServiceMethodResults = await NoticeService.get_notice_stat(notice_id, NOTICE_STAT.DETAILS_EXPANDED_COUNT);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  /** End Stats */


  @CatchRequestHandlerError()
  static async toggle_reaction(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const notice_id: number = parseInt(request.params.notice_id, 10);
    const reaction_type: string = request.params.reaction_type;
    const serviceMethodResults: ServiceMethodResults = await NoticeService.toggle_reaction({ user_id: you.id, notice_id, reaction_type });
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  /** Analytics */

  static log_user_notice_activity(event: ANALYTIC_EVENTS, multi: boolean = false) {
    return async function fn(request: Request, response: Response): ExpressResponse {
      const you: IUser = response.locals.you;
      const notice_id: number = parseInt(request.params.notice_id, 10);
      const serviceMethodResults: ServiceMethodResults = await NoticeService.log_user_notice_activity({ user_id: you.id, notice_id, event }, multi);
      return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
    }
  }
  
}