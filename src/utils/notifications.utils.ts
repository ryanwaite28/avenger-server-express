import { get_user_by_id } from "../repos/users.repo";
import { INotification } from "../interfaces/app.interface";
import { Model } from "sequelize";


export const populate_notification_obj = async (notification_model: Model) => {
  console.log(`populate_deliverme_notification_obj attempt ==========`);

  const notificationObj = notification_model.toJSON() as INotification;
  const user_model = await get_user_by_id(notificationObj.from_id);
  const full_name = user_model.displayname;
  let message = "";
  let mount_prop_key = "";
  let mount_value = null;

  switch (notificationObj.event) {
    // case CARRY_EVENT_TYPES.CARRIER_ASSIGNED: {
    //   const delivery: IDelivery | null = await get_delivery_by_id(
    //     notificationObj.target_id
    //   );
    //   message = `${full_name} is now handling your delivery: ${
    //     delivery!.title
    //   }`;
    //   mount_prop_key = "delivery";
    //   mount_value = delivery!;
    //   break;
    // }
  }

  notificationObj.from = user_model!;
  notificationObj.message = message;
  notificationObj[mount_prop_key] = mount_value;

  return notificationObj;
};