
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
  Answer,
  AnswerComment,
  AnswerCommentReaction,
  AnswerCommentReply,
  AnswerCommentReplyReaction,
  AnswerRating,
  AnswerReaction,
  Assessment,
  Question,
  QuestionSkill,
} from '../models/avenger.model';
import {
  IAnswer,
  IAnswerComment,
  IAnswerCommentReaction,
  IAnswerCommentReply,
  IAnswerCommentReplyReaction,
  IAnswerRating,
  IAnswerReaction,
  IAssessment,
  IQuestion,
  IQuestionSkill,
} from '../interfaces/avenger.models.interface';
import {
  
} from '../dto/skill.dto';
import { STATUSES } from '../enums/common.enum';





const assessment_crud = create_model_crud_repo_from_model_class<IAssessment>(Assessment);
const question_crud = create_model_crud_repo_from_model_class<IQuestion>(Question);
const question_skill_crud = create_model_crud_repo_from_model_class<IQuestionSkill>(QuestionSkill);

const answer_crud = create_model_crud_repo_from_model_class<IAnswer>(Answer);
const answer_reaction_crud = create_model_crud_repo_from_model_class<IAnswerReaction>(AnswerReaction);
const answer_rating_crud = create_model_crud_repo_from_model_class<IAnswerRating>(AnswerRating);
const answer_comment_crud = create_model_crud_repo_from_model_class<IAnswerComment>(AnswerComment);
const answer_comment_reaction_crud = create_model_crud_repo_from_model_class<IAnswerCommentReaction>(AnswerCommentReaction);
const answer_comment_reply_crud = create_model_crud_repo_from_model_class<IAnswerCommentReply>(AnswerCommentReply);
const answer_comment_reply_reaction_crud = create_model_crud_repo_from_model_class<IAnswerCommentReplyReaction>(AnswerCommentReplyReaction);









/** READ */





/** CREATE */





/** UPDATE */





/** DELETE */