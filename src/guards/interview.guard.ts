import { NextFunction, Request, Response } from 'express';
import { InterviewCreateDto } from '../dto/interview.dto';
import { 
  check_interviewer_rating_by_writer_id_and_interview_id,
  check_interviewee_rating_by_writer_id_and_interview_id,
  get_interview_by_id_slim,
  get_interview_comment_by_id_slim,
  get_interview_comment_reply_by_id_slim
} from '../repos/interview.repo';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { IComment, IInterview, IReply, IUser } from '../interfaces/avenger.models.interface';





export async function InterviewExists(request: Request, response: Response, next: NextFunction) {
  const interview_id: number = parseInt(request.params.interview_id, 10);
  const interview: IInterview = await get_interview_by_id_slim(interview_id);
  if (!interview) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Interview not found by id: ${interview_id}`
    });
  }
  response.locals.interview = interview;
  return next();
}

export async function IsInterviewOwner(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const interview: IInterview = response.locals.interview;
  if (interview.owner_id !== you.id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Interview does not owned by you`
    });
  }
  return next();
}

export async function IsNotInterviewOwner(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const interview: IInterview = response.locals.interview;
  if (interview.owner_id === you.id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Interview is not owned by you`
    });
  }
  return next();
}



export async function IsInterviewCreateDtoValid(request: Request, response: Response, next: NextFunction) {
  const dto: InterviewCreateDto = response.locals['dto'];
  const you: IUser = response.locals.you;

  

  return next();
}





export async function InterviewCommentExists(request: Request, response: Response, next: NextFunction) {
  const comment_id: number = parseInt(request.params.comment_id, 10);
  const comment: IComment = await get_interview_comment_by_id_slim(comment_id);
  if (!comment) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Comment not found by id: ${comment_id}`
    });
  }
  response.locals.comment = comment;
  return next();
}

export async function IsInterviewCommentOwner(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const comment: IComment = response.locals.comment;
  if (comment.owner_id !== you.id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Comment is not owned by you`
    });
  }
  return next();
}



export async function InterviewCommentReplyExists(request: Request, response: Response, next: NextFunction) {
  const reply_id: number = parseInt(request.params.reply_id, 10);
  const reply: IReply = await get_interview_comment_reply_by_id_slim(reply_id);
  if (!reply) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Reply not found by id: ${reply_id}`
    });
  }
  response.locals.reply = reply;
  return next();
}

export async function IsInterviewCommentReplyOwner(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const reply: IReply = response.locals.reply;
  if (reply.owner_id !== you.id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Reply is not owned by you`
    });
  }
  return next();
}

export async function DidNotCreateInterviewerRatingGuard(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const interview: IInterview = response.locals.interview;
  const ratingExists: boolean = await check_interviewer_rating_by_writer_id_and_interview_id(you.id, interview.id);
  if (ratingExists) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Rating already created by user`
    });
  }
  return next();
}

export async function DidNotCreateIntervieweeRatingGuard(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const interview: IInterview = response.locals.interview;
  const ratingExists: boolean = await check_interviewee_rating_by_writer_id_and_interview_id(you.id, interview.id);
  if (ratingExists) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Rating already created by user`
    });
  }
  return next();
}
