import { AdvService } from '../../../infrastructure';

const getAdvertising = () => AdvService.getAdvertising();

export const HomeScreenViewModel = () => ({ getAdvertising });
