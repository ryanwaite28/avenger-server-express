import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  IsEnum,
  IsBoolean,
  MaxLength
} from 'class-validator';
import {
  GENERIC_TEXT_REGEX
} from '../regex/common.regex';




export class NoticeCreateDto {
  @IsNotEmpty()
  @IsInt()
  owner_id: number;
  
  @IsOptional()
  @IsInt()
  parent_notice_id: number | null; // if this notice is a reply to another
  
  @IsOptional()
  @IsInt()
  quoting_notice_id: number | null; // if this notice is quoting another
  
  @IsOptional()
  @IsInt()
  share_notice_id: number | null; // if this notice is a share of another
  
  @IsOptional()
  @IsString()
  @MaxLength(500)
  body: string | null;
  
  @IsOptional()
  @IsString()
  tags: string;
  
  @IsOptional()
  @IsBoolean()
  is_explicit: boolean;
  
  @IsOptional()
  @IsBoolean()
  is_private: boolean;
  
  @IsOptional()
  @IsString()
  visibility: string;
}

export class NoticeUpdateDto {
  @IsOptional()
  @IsInt()
  pinned_reply_id: number | null;
}