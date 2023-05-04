import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  IsEnum,
  ValidateIf,
  IsNumber
} from 'class-validator';
import {
  GENERIC_TEXT_REGEX, YOUTUBE_URL_EMBED
} from '../regex/common.regex';
import {
  RATINGS
} from '../enums/common.enum';
import { INTERVIEW_VIEW_STATE } from '../enums/avenger.enum';




export class InterviewCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;

  @IsOptional()
  @IsInt()
  interviewer_id: number | null;

  @IsOptional()
  @IsInt()
  interviewee_id: number | null;

  @IsOptional()
  @IsString()
  @ValidateIf(interview => interview.title)
  @Matches(GENERIC_TEXT_REGEX)
  title: string;
  
  @IsOptional()
  @IsString()
  @ValidateIf(interview => interview.description)
  @Matches(GENERIC_TEXT_REGEX)
  description: string;

  @IsOptional()
  @IsString()
  industry: string | null;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsEnum(INTERVIEW_VIEW_STATE)
  view_state: string;

  @IsOptional()
  @IsBoolean()
  is_private: boolean;

  @IsOptional()
  @IsInt()
  private_access_fee: number | null;
  
  @IsOptional()
  @IsString()
  photo_id: string | null;

  @IsOptional()
  @IsString()
  photo_link: string | null;

  @IsOptional()
  @IsString()
  photo_bucket: string | null;

  @IsOptional()
  @IsString()
  photo_key: string | null;

  @IsOptional()
  @IsString()
  video_id: string | null;

  @IsOptional()
  @Matches(YOUTUBE_URL_EMBED)
  video_link: string | null;

  @IsOptional()
  @IsString()
  video_bucket: string | null;

  @IsOptional()
  @IsString()
  video_key: string | null;

  @IsOptional()
  @IsInt({ each: true })
  skill_ids: number[];
}

export class InterviewUpdateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  description: string;

  @IsOptional()
  @IsString()
  industry: string | null;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsEnum(INTERVIEW_VIEW_STATE)
  view_state: string;

  @IsOptional()
  @IsBoolean()
  is_private: boolean;

  @IsOptional()
  @IsInt()
  private_access_fee: number | null;
}



export class InterviewerRatingCreateDto {
  @IsNotEmpty()
  @IsInt()
  interview_id: number;

  @IsNotEmpty()
  @IsInt()
  writer_id: number;
  
  @IsNotEmpty()
  @IsInt()
  @IsEnum(RATINGS)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  summary: string;

  @IsOptional()
  @IsString()
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}

export class IntervieweeRatingCreateDto {
  @IsNotEmpty()
  @IsInt()
  interview_id: number;

  @IsNotEmpty()
  @IsInt()
  writer_id: number;

  @IsNotEmpty()
  @IsInt()
  @IsEnum(RATINGS)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  summary: string;

  @IsOptional()
  @IsString()
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}

export class InterviewCommentCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;

  @IsNotEmpty()
  @IsInt()
  interview_id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}

export class InterviewCommentUpdateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}

export class InterviewCommentReplyCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;

  @IsNotEmpty()
  @IsInt()
  comment_id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}

export class InterviewCommentReplyUpdateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}