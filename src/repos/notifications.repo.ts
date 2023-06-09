import {
  fn,
  Op,
  WhereOptions,
  FindOptions,
  Includeable,
  Model,
  FindAttributeOptions,
  GroupOption,
  Order
} from 'sequelize';
import { PlainObject } from '../interfaces/common.interface';
import { send_sms } from '../utils/sms-client.utils';
import { validatePhone } from '../utils/validators.utils';
import { UserNotification } from '../models/avenger.model';
import { CommonSocketEventsHandler } from '../services/common.socket-event-handler';
import { populate_notification_obj } from '../utils/notifications.utils';


export async function create_notification(
  params: {
    from_id: number;
    to_id: number;
    event: string;
    target_type: string;
    target_id: number;
  }
) {
  const new_notification_model = await UserNotification.create(<any> params);
  return new_notification_model;
}

export async function create_notification_and_send(
  params: {
    from_id: number;
    to_id: number;
    event: string;
    target_type: string;
    target_id: number;
    to_phone?: string,
    rooms?: string | string[],
    // addonEvents
    extras_data?: PlainObject,
  }
) {
  return UserNotification.create(<any> {
    from_id: params.from_id,
    to_id: params.to_id,
    event: params.event,
    target_type: params.target_type,
    target_id: params.target_id,
  }).then(async (notification_model) => {
    const notification = await populate_notification_obj(notification_model);

    const event_data: any = {
      from_id: params.from_id,
      to_id: params.to_id,
      event: params.event,
      target_type: params.target_type,
      target_id: params.target_id,

      message: notification.message,
      notification,
    };
    
    if (params.extras_data) {
      Object.assign(event_data, params.extras_data);
    }
    
    CommonSocketEventsHandler.emitEventToUserSockets({
      user_id: params.to_id,
      event: params.event,
      event_data,
    });

    if (!!params.to_phone && validatePhone(params.to_phone)) {
      send_sms({
        to_phone_number: params.to_phone,
        message: notification.message,
      });
    }

    // TODO: send event to other optional rooms
    // if (!!params.rooms) {
    //   if ((typeof params.rooms === 'string') || (params.rooms.length)) {
    //     CommonSocketEventsHandler.emitEventToRoom({
    //       room: `NOTICE:${dto.share_notice_id}`,
    //       event: `NOTICE:${dto.share_notice_id}:${AVENGER_EVENT_TYPES.NOTICE_SHARED}`,
    //       data: {
    //         notice,
    //       }
    //     });
    //   }
    // }

    return notification;
  });
}

export async function get_user_unseen_notifications_count(you_id: number, last_seen: string | Date) {
  const count = await UserNotification.count({
    where: { to_id: you_id, created_at: { [Op.gt]: last_seen } },
  });

  return count;
}