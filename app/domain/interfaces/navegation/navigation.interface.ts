import { PackageInfo } from '../service/service.interface';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerify: undefined;
  MainBottomTab: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerify: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type ServicesStackParamList = {
  Services: undefined;
  SelectHouse: { packageInfo: PackageInfo };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  TermsConditions: undefined;
  ManageHouses: undefined;
  AddHouse: undefined;
  //* membership
  MembershipHome: undefined;
  Quotes: undefined;
};

export type AppParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  ServicesTab: undefined;
};
