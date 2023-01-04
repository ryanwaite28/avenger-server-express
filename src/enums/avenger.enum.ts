export enum AVENGER_EVENT_TYPES {
  NEW_RATING = `NEW_RATING`,
  NEW_SKILL_RATING = `NEW_SKILL_RATING`,
  NEW_SKILL_SUBMITTED = `NEW_SKILL_SUBMITTED`,
  NEW_SKILL_RECEIVED = `NEW_SKILL_RECEIVED`,
}



export enum AVENGER_NOTIFICATION_TARGET_TYPES {
  DELIVERY = 'DELIVERY',
  DELIVERY_DISPUTE = 'DELIVERY_DISPUTE',
  DELIVERY_DISPUTE_SETTLEMENT_OFFER = 'DELIVERY_DISPUTE_SETTLEMENT_OFFER',
  DELIVERY_TRACKING_UPDATE = 'DELIVERY_TRACKING_UPDATE',
}



export enum AVENGER_ADMIN_ROLES {
  ADMINISTRATOR = 'ADMINISTRATOR',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}



export enum AVENGER_SKILL_STATUS {
  ACTIVE = `ACTIVE`,
}


export enum INTERVIEW_VIEW_STATE {
  OPEN = `OPEN`,
  ARCHIVED = `ARCHIVED`,
}



export enum COMMON_SOCKET_EVENT_TYPES {
  // socket actions
  SOCKET_TRACK = 'SOCKET_TRACK',
  SOCKET_UNTRACK = 'SOCKET_UNTRACK',
  SOCKET_TO_USER_EVENT = 'SOCKET_TO_USER_EVENT',
  SOCKET_JOIN_ROOM = 'SOCKET_JOIN_ROOM',
  SOCKET_LEAVE_ROOM = 'SOCKET_LEAVE_ROOM',

  // events
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_MESSAGING = 'NEW_MESSAGING',
  MESSAGING_EVENTS_SUBSCRIBED = 'MESSAGING_EVENTS_SUBSCRIBED',
  MESSAGING_EVENTS_UNSUBSCRIBED = 'MESSAGING_EVENTS_UNSUBSCRIBED',
  TO_MESSAGING_ROOM = 'TO_MESSAGING_ROOM',
  JOIN_TO_MESSAGING_ROOM = 'JOIN_TO_MESSAGING_ROOM',
  LEAVE_TO_MESSAGING_ROOM = 'LEAVE_TO_MESSAGING_ROOM',
  MESSAGE_TYPING = 'MESSAGE_TYPING',
  MESSAGE_TYPING_STOPPED = 'MESSAGE_TYPING_STOPPED',
  
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_UNFOLLOWER = 'NEW_UNFOLLOWER',
  NEW_CONVERSATION = 'NEW_CONVERSATION',
  NEW_CONVERSATION_MESSAGE = 'NEW_CONVERSATION_MESSAGE',
  CONVERSATION_MEMBER_ADDED = 'CONVERSATION_MEMBER_ADDED',
  CONVERSATION_MEMBER_REMOVED = 'CONVERSATION_MEMBER_REMOVED',
  CONVERSATION_MEMBER_LEFT = 'CONVERSATION_MEMBER_LEFT',
  CONVERSATION_EVENTS_SUBSCRIBED = 'CONVERSATION_EVENTS_SUBSCRIBED',
  CONVERSATION_EVENTS_UNSUBSCRIBED = 'CONVERSATION_EVENTS_UNSUBSCRIBED',
  CONVERSATION_MESSAGE_TYPING = 'CONVERSATION_MESSAGE_TYPING',
  CONVERSATION_MESSAGE_TYPING_STOPPED = 'CONVERSATION_MESSAGE_TYPING_STOPPED',
  CONVERSATION_UPDATED = 'CONVERSATION_UPDATED',
  CONVERSATION_DELETED = 'CONVERSATION_DELETED',
}