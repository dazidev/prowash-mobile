import axios from 'axios';
import { Platform } from 'react-native';
import { TokenService } from '../services/token.service';

export const api = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://192.168.100.44:3000',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  const token = await TokenService.getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
