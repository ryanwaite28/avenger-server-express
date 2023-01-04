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
import { IsSkillExists } from '../validators/skill.validator';



export class UserSkillCreateDto {
  @IsNotEmpty()
  @IsInt()
  @IsSkillExists()
  skill_id: number;

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsOptional()
  @IsInt()
  submitter_id: number | null;
}

export class UserSkillRatingCreateDto {
  @IsNotEmpty()
  @IsInt()
  skill_id: number;

  @IsNotEmpty()
  @IsInt()
  writer_id: number;

  @IsOptional()
  @IsString()
  aspect: string | null;

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
