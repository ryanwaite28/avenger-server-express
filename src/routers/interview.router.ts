import { Router } from "express";
import { ValidateRequestBodyDto } from "../middlewares/class-transformer-validator.middleware";
import { YouAuthorizedSlim } from "../guards/you.guard";
import { InterviewRequestHandler } from "../request-handlers/interview.handler";
import {
  InterviewCommentCreateDto,
  InterviewCommentReplyCreateDto,
  InterviewCommentReplyUpdateDto,
  InterviewCommentUpdateDto,
  InterviewCreateDto,
  IntervieweeRatingCreateDto,
  InterviewerRatingCreateDto,
  InterviewUpdateDto,
} from "../dto/interview.dto";
import {
  InterviewCommentExists,
  InterviewCommentReplyExists,
  InterviewExists,
  IsInterviewCommentOwner,
  IsInterviewCommentReplyOwner,
  IsInterviewCreateDtoValid,
  IsInterviewOwner,
  DidNotCreateInterviewerRatingGuard,
  DidNotCreateIntervieweeRatingGuard
} from "../guards/interview.guard";
import { ANALYTIC_EVENTS } from "../enums/avenger.enum";



export const InterviewRouter: Router = Router({ mergeParams: true });




/** GET */

InterviewRouter.get(`/trending-skills`, InterviewRequestHandler.get_latest_trending_skills_on_interviews);
InterviewRouter.get(`/feed`, YouAuthorizedSlim, InterviewRequestHandler.get_feed_content_for_user);
InterviewRouter.get(`/feed/:timestamp`, YouAuthorizedSlim, InterviewRequestHandler.get_feed_content_for_user);



InterviewRouter.get('/:interview_id/interviewer-ratings/all', InterviewRequestHandler.get_interviewer_ratings_all);
InterviewRouter.get('/:interview_id/interviewer-ratings', InterviewRequestHandler.get_interviewer_ratings);
InterviewRouter.get('/:interview_id/interviewer-ratings/:rating_id', InterviewRequestHandler.get_interviewer_ratings);

InterviewRouter.get('/:interview_id/interviewee-ratings/all', InterviewRequestHandler.get_interviewee_ratings_all);
InterviewRouter.get('/:interview_id/interviewee-ratings', InterviewRequestHandler.get_interviewee_ratings);
InterviewRouter.get('/:interview_id/interviewee-ratings/:rating_id', InterviewRequestHandler.get_interviewee_ratings);


InterviewRouter.get(`/:interview_id/interviewer-ratings/writer/:user_id`, InterviewExists, InterviewRequestHandler.check_interviewer_rating_by_writer_id_and_interview_id);
InterviewRouter.get(`/:interview_id/interviewee-ratings/writer/:user_id`, InterviewExists, InterviewRequestHandler.check_interviewee_rating_by_writer_id_and_interview_id);


InterviewRouter.get('/:interview_id/comments/all', InterviewRequestHandler.get_interview_comments_all);
InterviewRouter.get('/:interview_id/comments', InterviewRequestHandler.get_interview_comments);
InterviewRouter.get('/:interview_id/comments/:comment_id', InterviewRequestHandler.get_interview_comments);

InterviewRouter.get('/:interview_id/comments/:comment_id/replies/all', InterviewRequestHandler.get_interview_comment_replies_all);
InterviewRouter.get('/:interview_id/comments/:comment_id/replies', InterviewRequestHandler.get_interview_comment_replies);
InterviewRouter.get('/:interview_id/comments/:comment_id/replies/:reply_id', InterviewRequestHandler.get_interview_comment_replies);



InterviewRouter.get(`/:interview_id/stats`, InterviewRequestHandler.get_interview_stats);
InterviewRouter.get(`/:interview_id/comments/:comment_id/stats`, InterviewRequestHandler.get_interview_comment_stats);
InterviewRouter.get(`/:interview_id/comments/:comment_id/replies/:reply_id/stats`, InterviewRequestHandler.get_interview_comment_reply_stats);

InterviewRouter.get(`/:interview_id/user-activity`, YouAuthorizedSlim, InterviewRequestHandler.get_user_activity_on_interview);
InterviewRouter.get(`/:interview_id/comments/:comment_id/user-activity`, YouAuthorizedSlim, InterviewRequestHandler.get_user_activity_on_interview_comment);
InterviewRouter.get(`/:interview_id/comments/:comment_id/replies/:reply_id/user-activity`, YouAuthorizedSlim, InterviewRequestHandler.get_user_activity_on_interview_comment_reply);

InterviewRouter.get(`/:interview_id`, InterviewExists, InterviewRequestHandler.get_interview_by_id);
InterviewRouter.get(`/:interview_id/comments/:comment_id`, InterviewExists, InterviewRequestHandler.get_interview_comment_by_id);
InterviewRouter.get(`/:interview_id/comments/:comment_id/replies/:reply_id`, InterviewExists, InterviewRequestHandler.get_interview_comment_reply_by_id);




/** POST */

InterviewRouter.post(`/:interview_id/user-activity/seen`, YouAuthorizedSlim, InterviewExists, InterviewRequestHandler.log_user_interview_activity(ANALYTIC_EVENTS.SEEN));
InterviewRouter.post(`/:interview_id/user-activity/details-expanded`, YouAuthorizedSlim, InterviewExists, InterviewRequestHandler.log_user_interview_activity(ANALYTIC_EVENTS.DETAILS_EXPANDED));


InterviewRouter.post(`/:interview_id/toggle-reaction/:reaction_type`, YouAuthorizedSlim, InterviewExists, InterviewRequestHandler.toggle_interview_reaction);
InterviewRouter.post(`/:interview_id/comments/:comment_id/toggle-reaction/:reaction_type`, YouAuthorizedSlim, InterviewExists, InterviewRequestHandler.toggle_interview_comment_reaction);
InterviewRouter.post(`/:interview_id/comments/:comment_id/replies/:reply_id/toggle-reaction/:reaction_type`, YouAuthorizedSlim, InterviewExists, InterviewRequestHandler.toggle_interview_comment_reply_reaction);


InterviewRouter.post(`/:interview_id/interviewer-ratings`, YouAuthorizedSlim, InterviewExists, DidNotCreateInterviewerRatingGuard, ValidateRequestBodyDto(InterviewerRatingCreateDto), InterviewRequestHandler.create_interviewer_rating);
InterviewRouter.post(`/:interview_id/interviewee-ratings`, YouAuthorizedSlim, InterviewExists, DidNotCreateIntervieweeRatingGuard, ValidateRequestBodyDto(IntervieweeRatingCreateDto), InterviewRequestHandler.create_interviewee_rating);

InterviewRouter.post(`/:interview_id/comments/:comment_id/replies`, YouAuthorizedSlim, ValidateRequestBodyDto(InterviewCommentReplyCreateDto), InterviewRequestHandler.create_interview_comment_reply);
InterviewRouter.post(`/:interview_id/comments`, YouAuthorizedSlim, ValidateRequestBodyDto(InterviewCommentCreateDto), InterviewRequestHandler.create_interview_comment);
InterviewRouter.post(`/`, YouAuthorizedSlim, ValidateRequestBodyDto(InterviewCreateDto), IsInterviewCreateDtoValid, InterviewRequestHandler.create_interview);


/** PUT */

InterviewRouter.put(`/:interview_id`, YouAuthorizedSlim, InterviewExists, IsInterviewOwner, ValidateRequestBodyDto(InterviewUpdateDto), InterviewRequestHandler.update_interview);
InterviewRouter.put(`/:interview_id/comments/:comment_id/`, YouAuthorizedSlim, InterviewCommentExists, IsInterviewCommentOwner, ValidateRequestBodyDto(InterviewCommentUpdateDto), InterviewRequestHandler.update_interview_comment);
InterviewRouter.put(`/:interview_id/comments/:comment_id/replies/:reply_id`, YouAuthorizedSlim, InterviewCommentReplyExists, IsInterviewCommentReplyOwner, ValidateRequestBodyDto(InterviewCommentReplyUpdateDto), InterviewRequestHandler.update_interview_comment_reply);



/** DELETE */

InterviewRouter.delete(`/:interview_id`, YouAuthorizedSlim, InterviewExists, IsInterviewOwner, InterviewRequestHandler.delete_interview);
InterviewRouter.delete(`/:interview_id/comments/:comment_id/`, YouAuthorizedSlim, InterviewCommentExists, IsInterviewCommentOwner, InterviewRequestHandler.delete_interview_comment);
InterviewRouter.delete(`/:interview_id/comments/:comment_id/replies/:reply_id`, YouAuthorizedSlim, InterviewCommentReplyExists, IsInterviewCommentReplyOwner, InterviewRequestHandler.delete_interview_comment_reply);