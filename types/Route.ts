export interface Route {
  from: string;
  to: string;
  vehicle?: string;
  selfVehicleId?: string;
}

export interface Driver {
  userId: {
    firstName: string;
    LastName?: string;
  };
  from: string;
  to: string;
  selfVehicle: string;
  location?: string;
}

export interface Merchant {
  userId: {
    firstName: string;
    LastName?: string;
  };
  from: string;
  to: string;
  vehicle: string;
  location?: string;
}

export interface ApiResponse<T> {
  resultMessage: {
    en: string;
    tr: string;
  };
  resultCode: string;
  data: T;
}
