export interface UserRegisterInterface {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserEditInfoResponseInterface {
  success: boolean;
  data: {
    name: string;
    lastname: string;
    email: string;
    contact_number: string;
  };
}

export interface UserHouse {
  id: string;
  name: string;
  street: string;
  complementStreet: string | null;
  city: string;
  state: string;
  zipcode: string;
  userId?: string;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ServiceInPackageOrder = {
  name: string;
  quantity: number;
};

export type PackageOrderPurchaseStatus =
  | 'PENDING_REVIEW'
  | 'ASSIGNED_APPOINTMENT'
  | 'APPOINTMENT_RESCHEDULE_REQUESTED'
  | 'QUOTED'
  | 'PAID'
  | 'CANCELLED';

export interface UserQuote {
  id: string;
  name: string;
  initialPrice: number;
  finalPrice: number | null;
  range: number;
  purchaseStatus: PackageOrderPurchaseStatus;

  appointmentAt: string | null;
  appointmentTimeZone: string | null;
  appointmentAcceptedAt: string | null;
  appointmentVersion: number;

  services: ServiceInPackageOrder[];
  createdAt: string;
  updatedAt: string;
  userHouse: UserHouse;
}

export type UserQuoteResponseAction =
  | 'ACCEPT_APPOINTMENT'
  | 'REQUEST_RESCHEDULE'
  | 'CANCEL_QUOTE';

export interface RespondUserQuotePayload {
  action: UserQuoteResponseAction;
  expectedAppointmentVersion: number;
}

export type UserQuoteResponseUpdated = Pick<
  UserQuote,
  | 'id'
  | 'purchaseStatus'
  | 'appointmentAt'
  | 'appointmentTimeZone'
  | 'appointmentAcceptedAt'
  | 'appointmentVersion'
  | 'updatedAt'
>;

export interface UserRegisterResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  token: string;
}
