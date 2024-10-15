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
  userLocation: string;
  from: string;
  to: string;
  selfVehicle: string;
  userType: "driver" | "merchant-driver";
  phoneNumber: string;
}

export interface Merchant {
  userId: {
    firstName: string;
    LastName?: string;
  };
  from: string;
  to: string;
  vehicle: string;
  userLocation: string;
  userType: "merchant" | "merchant-driver";
  phoneNumber: "string";
}

export interface ApiResponse<T> {
  resultMessage: {
    en: string;
    tr: string;
  };
  resultCode: string;
  data: T;
}
