export interface UserEditInfoResponseInterface {
  success: boolean
  data: {
    name: string
    lastname: string
    email: string
    contact_number: string
  }
}

export interface UserBasicResponseInterface {
  success: boolean
  error?: string
}

export interface UserHouseResponseItem {
  id: string
  name: string
  street: string
  complement_street: string
  city: string
  state: string
  zipcode: string
  image_url?: string
}

export interface UserHousesResponse {
  success: boolean
  data?: UserHouseResponseItem[]
  error?: string
}

export interface UserHouseResponse {
  success: boolean
  data: UserHouseResponseItem
  error?: string
}