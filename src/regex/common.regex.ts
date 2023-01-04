export const AUTH_BEARER_HEADER_REGEX: RegExp = /Bearer\s[^]/;
export const GENERIC_TEXT_REGEX: RegExp = /^[a-zA-Z0-9\s\'\-\_\.\@\$\#]{1,250}/;
export const PERSON_NAME_REGEX: RegExp = /^[a-zA-Z\s\'\-\_\.]{2,50}$/;
export const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
export const BASE64_REGEX = /^data:([A-Za-z-+\/]+);base64,(.+)$/;