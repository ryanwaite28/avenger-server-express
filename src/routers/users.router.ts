import { Router } from 'express';

import { UserExists, UserIdsAreDifferent, YouAuthorized, YouAuthorizedSlim, YouAuthorizedSlimWeak } from '../guards/you.guard';
import { UsersRequestHandler } from '../request-handlers/users.handler';
import { MessagingsRequestHandler } from '../request-handlers/messagings.handler';
import { UserNotificationsRequestHandler } from '../request-handlers/notifications.handler';
import { MessagesRequestHandler } from '../request-handlers/messages.handler';
import { ValidateRequestBodyDto } from '../middlewares/class-transformer-validator.middleware';
import { UserSignInDto, UserSignUpDto } from '../dto/user.dto';
import { SkillRequestHandler } from '../request-handlers/skill.handler';



export const UsersRouter: Router = Router({ mergeParams: true });

/*

  Profile Context 

*/

UsersRouter.get('/phone/:phone', UsersRequestHandler.get_user_by_phone);

UsersRouter.get(`/query/:query`, YouAuthorizedSlimWeak, UsersRequestHandler.get_users_by_like_query);

UsersRouter.get('/random', UsersRequestHandler.get_random_users);
UsersRouter.get('/check-session', UsersRequestHandler.check_session);
UsersRouter.get('/verify-email/:verification_code', UsersRequestHandler.verify_email);
UsersRouter.get('/send-sms-verification/:phone_number', YouAuthorizedSlim, UsersRequestHandler.send_sms_verification);
// UsersRouter.get('/verify-sms-code/request_id/:request_id/code/:code', YouAuthorizedSlim, UsersRequestHandler.verify_sms_code);
UsersRouter.get('/verify-sms-code/request_id/:request_id/code/:code/phone/:phone', YouAuthorizedSlim, UsersRequestHandler.verify_sms_code);


UsersRouter.get('/:you_id/account-info', YouAuthorized, UsersRequestHandler.get_account_info);
UsersRouter.get('/:you_id/stripe-login', YouAuthorized, UsersRequestHandler.stripe_login);

UsersRouter.get('/:you_id/api-key', YouAuthorized, UsersRequestHandler.get_user_api_key);
UsersRouter.get('/:you_id/customer-cards-payment-methods', YouAuthorized, UsersRequestHandler.get_user_customer_cards_payment_methods);
UsersRouter.get('/:you_id/get-subscription', YouAuthorized, UsersRequestHandler.get_subscription);
UsersRouter.get('/:you_id/is-subscription-active', YouAuthorized, UsersRequestHandler.is_subscription_active);

UsersRouter.get('/:you_id/notifications/all', YouAuthorized, UserNotificationsRequestHandler.get_user_notifications_all);
UsersRouter.get('/:you_id/notifications', YouAuthorized, UserNotificationsRequestHandler.get_user_notifications);
UsersRouter.get('/:you_id/notifications/:notification_id', YouAuthorized, UserNotificationsRequestHandler.get_user_notifications);

UsersRouter.get('/:you_id/notifications/app/:micro_app/app-notifications-last-opened', YouAuthorized, UserNotificationsRequestHandler.get_user_app_notification_last_opened);
UsersRouter.get('/:you_id/notifications/app/:micro_app/all', YouAuthorized, UserNotificationsRequestHandler.get_user_app_notifications_all);
UsersRouter.get('/:you_id/notifications/app/:micro_app', YouAuthorized, UserNotificationsRequestHandler.get_user_app_notifications);
UsersRouter.get('/:you_id/notifications/app/:micro_app/:notification_id', YouAuthorized, UserNotificationsRequestHandler.get_user_app_notifications);

UsersRouter.get('/:you_id/messagings/all', YouAuthorized, MessagingsRequestHandler.get_user_messagings_all);
UsersRouter.get('/:you_id/messagings', YouAuthorized, MessagingsRequestHandler.get_user_messagings);
UsersRouter.get('/:you_id/messagings/:messagings_timestamp', YouAuthorized, MessagingsRequestHandler.get_user_messagings);

UsersRouter.get('/:you_id/messages/:user_id', YouAuthorized, UserIdsAreDifferent, MessagesRequestHandler.get_user_messages);
UsersRouter.get('/:you_id/messages/:user_id/:min_id', YouAuthorized, UserIdsAreDifferent, MessagesRequestHandler.get_user_messages);

UsersRouter.get('/:user_id/get-subscription-info', UserExists, UsersRequestHandler.get_subscription_info);

UsersRouter.get('/:id/follows/:follow_id', UsersRequestHandler.check_user_follow);

UsersRouter.get('/:id', UsersRequestHandler.get_user_by_id);


// POST
UsersRouter.post('/', ValidateRequestBodyDto(UserSignUpDto), UsersRequestHandler.sign_up);

UsersRouter.post('/:email/password-reset', UsersRequestHandler.submit_reset_password_request);
UsersRouter.post('/:you_id/feedback', YouAuthorized, UsersRequestHandler.send_feedback);
UsersRouter.post('/:you_id/notifications/update-last-opened', YouAuthorized, UserNotificationsRequestHandler.update_user_last_opened);
UsersRouter.post('/:you_id/notifications/app/:micro_app/update-app-notifications-last-opened', YouAuthorized, UserNotificationsRequestHandler.update_user_app_notification_last_opened);
UsersRouter.post('/:you_id/send-message/:user_id', YouAuthorized, UserIdsAreDifferent, MessagesRequestHandler.send_user_message);
UsersRouter.post('/:you_id/customer-cards-payment-methods/:payment_method_id', YouAuthorized, UsersRequestHandler.add_card_payment_method_to_user_customer);
UsersRouter.post('/:you_id/create-subscription/:payment_method_id', YouAuthorized, UsersRequestHandler.create_subscription);
UsersRouter.post('/:you_id/cancel-subscription', YouAuthorized, UsersRequestHandler.cancel_subscription);

UsersRouter.post('/:you_id/follows/:follow_id', YouAuthorized, UsersRequestHandler.toggle_user_follow);



// PUT
UsersRouter.put('/', ValidateRequestBodyDto(UserSignInDto), UsersRequestHandler.sign_in);

UsersRouter.put('/password-reset/:code', UsersRequestHandler.submit_password_reset_code);
UsersRouter.put('/:you_id/info', YouAuthorized, UsersRequestHandler.update_info);
UsersRouter.put('/:you_id/password', YouAuthorized, UsersRequestHandler.update_password);
UsersRouter.put('/:you_id/phone', YouAuthorized, UsersRequestHandler.update_phone);
UsersRouter.put('/:you_id/icon', YouAuthorized, UsersRequestHandler.update_icon);
UsersRouter.put('/:you_id/wallpaper', YouAuthorized, UsersRequestHandler.update_wallpaper);
UsersRouter.put('/:you_id/register-expo-device-and-push-token', YouAuthorized, UsersRequestHandler.register_expo_device_and_push_token);
UsersRouter.put('/:you_id/create-stripe-account', YouAuthorized, UsersRequestHandler.create_stripe_account);
UsersRouter.put('/:you_id/verify-stripe-account', YouAuthorized, UsersRequestHandler.verify_stripe_account);
UsersRouter.put('/:user_uuid/verify-stripe-account-by-uuid', UsersRequestHandler.verify_stripe_account_by_uuid);
UsersRouter.put('/:you_id/verify-customer-has-cards', YouAuthorized, UsersRequestHandler.verify_customer_has_card_payment_method);

// DELETE
UsersRouter.delete('/:you_id/customer-cards-payment-methods/:payment_method_id', YouAuthorized, UsersRequestHandler.remove_card_payment_method_to_user_customer);

UsersRouter.delete('/:you_id/remove-expo-device-and-push-token/:expo_token', YouAuthorized, UsersRequestHandler.remove_expo_device_and_push_token);





/*

  User Skill Context 
  
*/

UsersRouter.get('/:you_id/skills/all', SkillRequestHandler.get_user_skills_all);
UsersRouter.get('/:you_id/skills', SkillRequestHandler.get_user_skills);
UsersRouter.get('/:you_id/skills/:user_skill_id', SkillRequestHandler.get_user_skills);





/*

  Interview Context 
  
*/







/*

  Question Context 
  
*/

