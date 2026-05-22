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
