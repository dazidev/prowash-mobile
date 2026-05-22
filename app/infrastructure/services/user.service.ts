import axios from 'axios';
import { api } from '../config/axios.config';
import { Asset } from 'react-native-image-picker';

//* tipiado.
import type { ServiceResponse, UserHouse } from '../../domain';
import { handleApiError } from '../../shared';

export class UserService {
  static async editPersonalInfo(id: string, name: string, lastname: string) {
    try {
      const jsonInfo = {
        name: name,
        lastname: lastname,
      };
      const response = await api.post(
        `/api/user/edit/personal-info/${id}`,
        jsonInfo,
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      };
    }
  }

  static async changeUserPassword(
    id: string,
    currentPassword: string,
    newPassword: string,
    repeatNewPassword: string,
  ): Promise<any> {
    try {
      const jsonInfo = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        repeatNewPassword: repeatNewPassword,
      };
      const response = await api.post(
        `/api/user/change/password/${id}`,
        jsonInfo,
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
      };
    }
  }

  static async getUserHouses(): Promise<ServiceResponse<UserHouse[]>> {
    try {
      const response = await api.get(`/api/user/houses`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async addUserHouse(
    house: UserHouse,
  ): Promise<ServiceResponse<UserHouse>> {
    try {
      const { name, street, complementStreet, city, state, zipcode } = house;
      const jsonInfo = {
        name,
        street,
        complementStreet,
        city,
        state,
        zipcode,
      };
      const response = await api.post(`/api/user/house`, jsonInfo);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async deleteUserHouse(
    houseId: string,
  ): Promise<ServiceResponse<unknown>> {
    try {
      await api.delete(`/api/user/house/${houseId}`);
      return {
        success: true,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async uploadHousePhoto(
    image: Asset,
    houseId: string,
  ): Promise<ServiceResponse<unknown>> {
    // tipiar la respuesta
    // TODO: manejar las notificaciones de success o error a nivel global de la app

    if (!image.uri || !image.fileSize || !image.type) return { success: false };

    const ext = (image.fileName?.split('.').pop() ?? 'jpg').toLowerCase();

    const jsonInfo = {
      mime: image.type,
      ext,
      size: image.fileSize,
    };

    let signRes;

    try {
      signRes = await api.post(`/api/user/uploads-sign`, jsonInfo);
    } catch (error: unknown) {
      return handleApiError(error);
    }

    const { uploadUrl, key } = signRes.data;

    const imageData = await fetch(image.uri).then(res => res.blob());

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': image.type },
      body: imageData,
    });

    try {
      const attach = await api.post(`/api/user/house/${houseId}/photo-attach`, {
        key,
      });
      return {
        success: true,
        data: attach.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }
}
