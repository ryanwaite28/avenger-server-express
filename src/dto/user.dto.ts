import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsPhoneNumber,
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
import {
  DISPLAYNAME_MATCHES_VALIDATION_ERROR_MESSAGE,
  DISPLAYNAME_REQUIRED_VALIDATION_ERROR_MESSAGE,
  EMAIL_MATCHES_VALIDATION_ERROR_MESSAGE,
  EMAIL_REQUIRED_VALIDATION_ERROR_MESSAGE,
  PASSWORD_MATCHES_VALIDATION_ERROR_MESSAGE,
  PASSWORD_REQUIRED_VALIDATION_ERROR_MESSAGE,
  USERNAME_EMAIL_REQUIRED_VALIDATION_ERROR_MESSAGE,
  USERNAME_MATCHES_VALIDATION_ERROR_MESSAGE,
  USERNAME_REQUIRED_VALIDATION_ERROR_MESSAGE,
} from '../messages/user.error.messages';
import {
  USERNAME_REGEX,
  DISPLAYNAME_REGEX,
  PASSWORD_REGEX
} from '../regex/user.regex';





export class UserSignUpDto {
  @IsNotEmpty({ message: USERNAME_REQUIRED_VALIDATION_ERROR_MESSAGE })
  @Matches(USERNAME_REGEX, { message: USERNAME_MATCHES_VALIDATION_ERROR_MESSAGE })
  username: string;
  
  @IsNotEmpty({ message: DISPLAYNAME_REQUIRED_VALIDATION_ERROR_MESSAGE })
  @Matches(DISPLAYNAME_REGEX, { message: DISPLAYNAME_MATCHES_VALIDATION_ERROR_MESSAGE })
  displayname: string;

  @IsNotEmpty({ message: EMAIL_REQUIRED_VALIDATION_ERROR_MESSAGE })
  @IsEmail(undefined, { message: EMAIL_MATCHES_VALIDATION_ERROR_MESSAGE })
  email: string;

  @IsNotEmpty({ message: PASSWORD_REQUIRED_VALIDATION_ERROR_MESSAGE })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MATCHES_VALIDATION_ERROR_MESSAGE })
  password: string;
}

export class UserSignInDto {
  @IsNotEmpty({ message: USERNAME_EMAIL_REQUIRED_VALIDATION_ERROR_MESSAGE })
  username_email: string;

  @IsNotEmpty({ message: PASSWORD_REQUIRED_VALIDATION_ERROR_MESSAGE })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Matches(USERNAME_REGEX, { message: USERNAME_MATCHES_VALIDATION_ERROR_MESSAGE })
  username: string;

  @IsOptional()
  @Matches(DISPLAYNAME_REGEX, { message: DISPLAYNAME_MATCHES_VALIDATION_ERROR_MESSAGE })
  displayname: string;
  
  @IsOptional()
  @IsEmail(undefined, { message: EMAIL_MATCHES_VALIDATION_ERROR_MESSAGE })
  email: string;

  @IsOptional()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MATCHES_VALIDATION_ERROR_MESSAGE })
  password: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string | null;
  
  @IsOptional()
  @IsPhoneNumber()
  temp_phone: string | null;

  @IsOptional()
  @IsString()
  stripe_customer_account_id: string | null;

  @IsOptional()
  @IsString()
  stripe_account_id: string | null;

  @IsOptional()
  @IsBoolean()
  stripe_account_verified: boolean;

  @IsOptional()
  @IsString()
  platform_subscription_id: string | null;

  @IsOptional()
  @IsString()
  headline: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsString()
  icon_link: string | null;

  @IsOptional()
  @IsString()
  icon_id: string | null;

  @IsOptional()
  @IsString()
  id_card_front_link: string | null;

  @IsOptional()
  @IsString()
  id_card_front_id: string | null;

  @IsOptional()
  @IsString()
  id_card_back_link: string | null;

  @IsOptional()
  @IsString()
  id_card_back_id: string | null;

  @IsOptional()
  @IsString()
  photo_id_link: string | null;

  @IsOptional()
  @IsString()
  photo_id_id: string | null;

  @IsOptional()
  @IsString()
  wallpaper_link: string | null;

  @IsOptional()
  @IsString()
  wallpaper_id: string | null;

  @IsOptional()
  @IsBoolean()
  allow_messaging: boolean;

  @IsOptional()
  @IsBoolean()
  allow_conversations: boolean;

  @IsOptional()
  @IsString()
  location: string | null;

  @IsOptional()
  @IsString()
  location_id: string | null;

  @IsOptional()
  @IsString()
  location_json: string | null;

  @IsOptional()
  @IsString()
  zipcode: string | null;

  @IsOptional()
  @IsString()
  city: string | null;

  @IsOptional()
  @IsString()
  state: string | null;

  @IsOptional()
  @IsString()
  county: string | null;

  @IsOptional()
  @IsString()
  country: string | null;

  @IsOptional()
  @IsBoolean()
  public: boolean;

  @IsOptional()
  @IsBoolean()
  online: boolean;

  @IsOptional()
  @IsBoolean()
  cerified: boolean;

  @IsOptional()
  @IsBoolean()
  person_verified: boolean;

  @IsOptional()
  @IsBoolean()
  email_verified: boolean;

  @IsOptional()
  @IsBoolean()
  phone_verified: boolean;

  @IsOptional()
  @IsBoolean()
  can_message: boolean;

  @IsOptional()
  @IsBoolean()
  can_converse: boolean;

  @IsOptional()
  @IsString()
  notifications_last_opened: string;
}

export class UserFieldCreateDto {
  @IsNotEmpty()
  @Matches(GENERIC_TEXT_REGEX)
  fieldname: string;

  @IsNotEmpty()
  @Matches(GENERIC_TEXT_REGEX)
  fieldvalue: string;
}

export class UserFieldUpdateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @Matches(GENERIC_TEXT_REGEX)
  fieldname: string;

  @IsNotEmpty()
  @Matches(GENERIC_TEXT_REGEX)
  fieldvalue: string;
}

export class UserRatingCreateDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

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
}

export class MessageCreateDto {
  @IsNotEmpty()
  @IsInt()
  from_id: number;

  @IsNotEmpty()
  @IsInt()
  to_id: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}