import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../enums/http-codes.enum';

import { get_notice_by_id_slim } from '../repos/notice.repo';
import { INotice, IUser } from '../interfaces/avenger.models.interface';
import { NoticeCreateDto } from '../dto/notice.dto';



export async function NoticeExists(request: Request, response: Response, next: NextFunction) {
  const notice_id: number = parseInt(request.params.notice_id, 10);
  const notice: INotice = await get_notice_by_id_slim(notice_id);
  if (!notice) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Notice not found by id: ${notice_id}`
    });
  }
  response.locals.notice = notice;
  return next();
}

export async function IsNoticeOwner(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const notice: INotice = response.locals.notice;
  if (notice.owner_id !== you.id) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Notice does not owned by you`
    });
  }
  return next();
}

export async function IsNotNoticeOwner(request: Request, response: Response, next: NextFunction) {
  const you: IUser = response.locals.you;
  const notice: INotice = response.locals.notice;
  if (notice.owner_id === you.id) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Notice does not owned by you`
    });
  }
  return next();
}

export async function IsNoticeCreateDtoValid(request: Request, response: Response, next: NextFunction) {
  const dto: NoticeCreateDto = response.locals['dto'];
  const you: IUser = response.locals.you;

  // check that notice can only be a reply, quote, share or none; cannot be 2 or more
  const isValidContext = (
    (!!dto.parent_notice_id && !dto.quoting_notice_id && !dto.share_notice_id) ||
    (!dto.parent_notice_id && !!dto.quoting_notice_id && !dto.share_notice_id) ||
    (!dto.parent_notice_id && !dto.quoting_notice_id && !!dto.share_notice_id) ||
    (!dto.parent_notice_id && !dto.quoting_notice_id && !dto.share_notice_id) 
  );
  if (!isValidContext) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `Notice cannot have more than one context`
    });
  }

  if (you.id !== dto.owner_id) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `Owner id does not match session user's id`
    });
  }

  if (!dto.share_notice_id && !dto.body) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `Body can only be blank when sharing`
    });
  }

  // if user is trying to share, get the original notice (where share_notice_id = null)
  if (!!dto.share_notice_id) {
    // keep querying until we get to the notice that isn't a share
    let count = 0;
    let notice: INotice | null = { share_notice_id: dto.share_notice_id } as INotice; // setting initial obj; will be replace with each query in the chain/trail
    do {
      count = count + 1;
      notice = await get_notice_by_id_slim(notice.share_notice_id);
    }
    while (!!notice.share_notice_id);

    console.log(`setting correct share notice id`, { dto, notice });
    // now set the dto's share_notice_id to the original notice's id
    if (notice && notice.id) {
      dto.share_notice_id = notice.id;
    }
  }

  return next();
}