export interface IUserSignUpDto {
  username: string,
  displayname: string,
  email: string,
  password: string,
}

export interface IUserSignInDto {
  username_email: string,
  password: string,
}

export interface IUpdateUserDto {
  username?: string,
  displayname?: string,
  email?: string,
  password?: string,
  phone?: string | null,
  temp_phone?: string | null,
  stripe_customer_account_id?: string | null,
  stripe_account_id?: string | null,
  stripe_account_verified?: boolean,
  platform_subscription_id?: string | null,
  headline?: string,
  bio?: string,
  tags?: string,
  icon_link?: string | null,
  icon_id?: string | null,
  id_card_front_link?: string | null,
  id_card_front_id?: string | null,
  id_card_back_link?: string | null,
  id_card_back_id?: string | null,
  photo_id_link?: string | null,
  photo_id_id?: string | null,
  wallpaper_link?: string | null,
  wallpaper_id?: string | null,
  allow_messaging?: boolean,
  allow_conversations?: boolean,
  location?: string | null,
  location_id?: string | null,
  location_json?: string | null,
  zipcode?: string | null,
  city?: string | null,
  state?: string | null,
  county?: string | null,
  country?: string | null,
  public?: boolean,
  online?: boolean,
  cerified?: boolean,
  person_verified?: boolean,
  email_verified?: boolean,
  phone_verified?: boolean,
  can_message?: boolean,
  can_converse?: boolean,
  notifications_last_opened?: string,
}