import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  IsEnum
} from 'class-validator';
import {
  GENERIC_TEXT_REGEX
} from '../regex/common.regex';
import {
  RATINGS
} from '../enums/common.enum';




export class AssessmentCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;

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
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}

export class AssessmentUpdateDto {
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
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}


export class QuestionCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;

  @IsOptional()
  @IsInt()
  assessment_id: number | null;

  @IsOptional()
  @IsString()
  difficulty: string | null;

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
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}

export class QuestionUpdateDto {
  @IsOptional()
  @IsInt()
  assessment_id: number | null;

  @IsOptional()
  @IsString()
  difficulty: string | null;

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
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}



export class AnswerCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;

  @IsNotEmpty()
  @IsInt()
  question_id: number;

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
  video_link: string | null;

  @IsOptional()
  @IsString()
  video_id: string | null;
}

export class AnswerRatingCreateDto {
  @IsNotEmpty()
  @IsInt()
  answer_id: number;

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
  @Matches(GENERIC_TEXT_REGEX)
  tags: string;
  
  @IsOptional()
  @IsString()
  image_link: string | null;

  @IsOptional()
  @IsString()
  image_id: string | null;
}

export class AnswerCommentCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;
  
  @IsNotEmpty()
  @IsInt()
  answer_id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}

export class AnswerCommentUpdateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}

export class AnswerCommentReplyCreateDto {
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

export class AnswerCommentReplyUpdateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(GENERIC_TEXT_REGEX)
  body: string;
}
