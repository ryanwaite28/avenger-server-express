
import {
  fn,
  Includeable,
  Model,
  Op,
  WhereOptions
} from 'sequelize';
import { user_attrs_slim } from '../utils/constants.utils';
import {
  create_model_crud_repo_from_model_class,
} from '../utils/helpers.utils';
import {
  Interview,
  InterviewComment,
  InterviewCommentReaction,
  InterviewCommentReply,
  InterviewCommentReplyReaction,
  IntervieweeRating,
  InterviewerRating,
  InterviewReaction,
  InterviewSkill,
} from '../models/avenger.model';
import {
  IInterview,
  IInterviewComment,
  IInterviewCommentReaction,
  IInterviewCommentReply,
  IInterviewCommentReplyReaction,
  IIntervieweeRating,
  IInterviewerRating,
  IInterviewReaction,
  IInterviewSkill,
} from '../interfaces/avenger.models.interface';
import {
  
} from '../dto/skill.dto';
import { STATUSES } from '../enums/common.enum';




const interview_crud = create_model_crud_repo_from_model_class<IInterview>(Interview);
const interview_skill_crud = create_model_crud_repo_from_model_class<IInterviewSkill>(InterviewSkill);
const interviewer_rating_crud = create_model_crud_repo_from_model_class<IInterviewerRating>(InterviewerRating);
const interviewee_rating_crud = create_model_crud_repo_from_model_class<IIntervieweeRating>(IntervieweeRating);
const interview_reaction_crud = create_model_crud_repo_from_model_class<IInterviewReaction>(InterviewReaction);
const interview_comment_crud = create_model_crud_repo_from_model_class<IInterviewComment>(InterviewComment);
const interview_comment_reaction_crud = create_model_crud_repo_from_model_class<IInterviewCommentReaction>(InterviewCommentReaction);
const interview_comment_reply_crud = create_model_crud_repo_from_model_class<IInterviewCommentReply>(InterviewCommentReply);
const interview_comment_reply_reaction_crud = create_model_crud_repo_from_model_class<IInterviewCommentReplyReaction>(InterviewCommentReplyReaction);







/** READ */





/** CREATE */





/** UPDATE */





/** DELETE */