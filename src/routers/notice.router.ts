import { Router } from 'express';
import { ANALYTIC_EVENTS } from '../enums/avenger.enum';
import { NoticeCreateDto, NoticeUpdateDto } from '../dto/notice.dto';
import { IsNoticeCreateDtoValid, IsNoticeOwner, NoticeExists } from '../guards/notice.guard';
import { YouAuthorizedSlim } from '../guards/you.guard';
import { ValidateRequestBodyDto } from '../middlewares/class-transformer-validator.middleware';
import { NoticeRequestHandler } from '../request-handlers/notice.handler';



export const NoticeRouter: Router = Router({ mergeParams: true });



/** GET */

NoticeRouter.get(`/trending-skills`, NoticeRequestHandler.get_latest_trending_skills_on_notices);
NoticeRouter.get(`/feed`, YouAuthorizedSlim, NoticeRequestHandler.get_feed_content_for_user);
NoticeRouter.get(`/feed/:notice_id`, YouAuthorizedSlim, NoticeRequestHandler.get_feed_content_for_user);

NoticeRouter.get(`/:notice_id/stats/replies-count`, NoticeRequestHandler.get_notice_replies_count);
NoticeRouter.get(`/:notice_id/stats/quotes-count`, NoticeRequestHandler.get_notice_quotes_count);
NoticeRouter.get(`/:notice_id/stats/shares-count`, NoticeRequestHandler.get_notice_shares_count);
NoticeRouter.get(`/:notice_id/stats/seen-count`, NoticeRequestHandler.get_notice_details_expanded_count);
NoticeRouter.get(`/:notice_id/stats/details-expanded-count`, NoticeRequestHandler.get_notice_replies_count);

NoticeRouter.get(`/:notice_id/stats`, NoticeRequestHandler.get_notice_stats);
NoticeRouter.get(`/:notice_id/user-activity`, YouAuthorizedSlim, NoticeRequestHandler.get_user_activity_on_notice);
NoticeRouter.get(`/:notice_id`, NoticeRequestHandler.get_notice_by_id);

NoticeRouter.get('/:notice_id/replies/all', NoticeRequestHandler.get_notice_replies_all);
NoticeRouter.get('/:notice_id/replies', NoticeRequestHandler.get_notice_replies);
NoticeRouter.get('/:notice_id/replies/:child_notice_id', NoticeRequestHandler.get_notice_replies);




/** POST */

NoticeRouter.post(`/`, YouAuthorizedSlim, ValidateRequestBodyDto(NoticeCreateDto), IsNoticeCreateDtoValid, NoticeRequestHandler.create_notice);
NoticeRouter.post(`/:notice_id/toggle-reaction/:reaction_type`, YouAuthorizedSlim, NoticeExists, NoticeRequestHandler.toggle_reaction);
NoticeRouter.post(`/:notice_id/user-activity/seen`, YouAuthorizedSlim, NoticeExists, NoticeRequestHandler.log_user_notice_activity(ANALYTIC_EVENTS.SEEN));
NoticeRouter.post(`/:notice_id/user-activity/details-expanded`, YouAuthorizedSlim, NoticeExists, NoticeRequestHandler.log_user_notice_activity(ANALYTIC_EVENTS.DETAILS_EXPANDED));



/** PUT */

NoticeRouter.put(`/:notice_id`, YouAuthorizedSlim, NoticeExists, IsNoticeOwner, ValidateRequestBodyDto(NoticeUpdateDto), NoticeRequestHandler.update_notice);



/** DELETE */

NoticeRouter.delete(`/:notice_id`, YouAuthorizedSlim, NoticeExists, IsNoticeOwner, NoticeRequestHandler.delete_notice);
