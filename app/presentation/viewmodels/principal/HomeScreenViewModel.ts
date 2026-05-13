import { AdvService } from '../../../infrastructure';

export const HomeScreenViewModel = () => {
  const getAdvertising = async () => {
    const adv = await AdvService.getAdvertising(); //! todo: procesar la respuesta y dar una correspondiente al visual
    return adv;
  };

  return {
    getAdvertising,
  };
};
