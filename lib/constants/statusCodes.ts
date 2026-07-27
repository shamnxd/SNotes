export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const SHARE_STATUS = {
  SUCCESS: "SUCCESS",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  INVALID: "INVALID",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
  USED: "USED",
  NOT_FOUND: "NOT_FOUND",
  LOADING: "LOADING",
  ERROR: "ERROR",
} as const;

export type ShareStatusType = (typeof SHARE_STATUS)[keyof typeof SHARE_STATUS];
